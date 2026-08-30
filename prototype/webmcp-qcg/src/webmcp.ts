import { useEffect, useMemo, useState } from 'react'
import { ZodError } from 'zod'
import {
  evaluateInput,
  exportInput,
  exportOutput,
  inspectInput,
  manifestOutput,
  recommendationOutput,
  simulationInput,
  simulationOutput
} from './contracts'
import type { QcgServices } from './services'
import type { QcgState, ToolName } from './types'

type JsonSchema = Record<string, unknown>
interface WebMcpTool {
  name: ToolName
  title: string
  description: string
  inputSchema: JsonSchema
  annotations: { readOnlyHint?: boolean; untrustedContentHint?: boolean; destructiveHint?: boolean }
  execute: (input: object, options?: { signal?: AbortSignal }) => Promise<unknown>
}
interface ModelContext {
  registerTool(tool: WebMcpTool, options: { signal: AbortSignal }): Promise<void>
}

declare global {
  interface Document { modelContext?: ModelContext }
}

const identifier = { type: 'string', pattern: '^[a-z0-9][a-z0-9_-]{2,63}$' }
const schemas: Record<ToolName, JsonSchema> = {
  inspect_quantum_experiment: {
    type: 'object',
    additionalProperties: false,
    required: ['artifact_id'],
    properties: {
      artifact_id: { ...identifier, description: 'Identifier of the human-selected quantum artifact already loaded locally.' }
    }
  },
  evaluate_quantum_call: {
    type: 'object',
    additionalProperties: false,
    required: ['manifest_id', 'target_profile_id', 'scientific_intent', 'observable', 'parameters', 'requested_limits'],
    properties: {
      manifest_id: { ...identifier, description: 'Current byte-derived manifest identifier.' },
      target_profile_id: { ...identifier, description: 'Frozen target-profile identifier selected in the visible UI.' },
      scientific_intent: { type: 'string', minLength: 12, maxLength: 320 },
      observable: { type: 'string', minLength: 3, maxLength: 80 },
      parameters: {
        type: 'object',
        additionalProperties: { anyOf: [{ type: 'string', maxLength: 120 }, { type: 'number' }, { type: 'boolean' }] },
        maxProperties: 12
      },
      requested_limits: {
        type: 'object',
        additionalProperties: false,
        required: ['shots', 'timeout_ms', 'max_qubits', 'target'],
        properties: {
          shots: { type: 'integer', minimum: 1, maximum: 256 },
          timeout_ms: { type: 'integer', minimum: 500, maximum: 15000 },
          max_qubits: { type: 'integer', minimum: 1, maximum: 8 },
          target: { type: 'string', enum: ['local_simulator', 'external_reference'] }
        }
      }
    }
  },
  run_bounded_local_simulation: {
    type: 'object',
    additionalProperties: false,
    required: ['recommendation_id'],
    properties: {
      recommendation_id: { ...identifier, description: 'Current simulate_first recommendation. The private consent token stays inside QCG.' }
    }
  },
  export_quantum_evidence_report: {
    type: 'object',
    additionalProperties: false,
    required: ['receipt_id', 'format'],
    properties: {
      receipt_id: { ...identifier, description: 'Current v3 evidence receipt.' },
      format: { type: 'string', enum: ['json', 'markdown'] }
    }
  }
}

function bounded<T extends object>(value: T): T {
  if (JSON.stringify(value).length <= 5000) return value
  return { summary: 'The result exceeds the WebMCP response budget. Review the visible QCG receipt.' } as T
}

function failure(error: unknown): never {
  const message = error instanceof DOMException && error.name === 'AbortError'
    ? 'Tool execution cancelled.'
    : error instanceof ZodError
      ? 'Arguments failed the strict QCG v3 contract.'
      : error instanceof Error && /^(artifact_id|manifest_id|recommendation_id|receipt_id|The artifact|The recommendation|A valid|The bounded|Local Q#|Local QDK|Only Q#)/.test(error.message)
        ? error.message
        : 'QCG request could not be completed.'
  throw new Error(message.slice(0, 260))
}

function executionSignal(options?: { signal?: AbortSignal }): AbortSignal {
  return options?.signal ?? new AbortController().signal
}

export function useQcgWebMcp(
  services: QcgServices,
  state: QcgState,
  onChange: () => void
): {
  supported: boolean
  toolNames: ToolName[]
  registrationStatus: 'unavailable' | 'registering' | 'registered' | 'error'
} {
  const supported = Boolean(document.modelContext?.registerTool)
  const [registrationStatus, setRegistrationStatus] =
    useState<'unavailable' | 'registering' | 'registered' | 'error'>(supported ? 'registering' : 'unavailable')
  const consentIsValid = state.authority_state === 'authorized' && state.humanDecision?.choice === 'accepted'
  const toolNames = useMemo(() => {
    const names: ToolName[] = []
    if (state.manifest) {
      names.push('inspect_quantum_experiment', 'evaluate_quantum_call')
    }
    if (state.recommendation?.decision === 'simulate_first' && consentIsValid) {
      names.push('run_bounded_local_simulation')
    }
    if (state.receipt) names.push('export_quantum_evidence_report')
    return names
  }, [state.manifest?.manifest_id, state.recommendation?.decision, state.receipt?.receipt_id, consentIsValid])

  useEffect(() => {
    const modelContext = document.modelContext
    if (!modelContext?.registerTool) {
      setRegistrationStatus('unavailable')
      return
    }
    setRegistrationStatus('registering')
    const controller = new AbortController()
    const tools: WebMcpTool[] = []
    if (state.manifest) {
      tools.push({
        name: 'inspect_quantum_experiment',
        title: 'Inspect quantum experiment',
        description: 'Verify the manifest of a human-selected quantum artifact already loaded locally. Raw source never crosses this tool contract.',
        inputSchema: schemas.inspect_quantum_experiment,
        annotations: { readOnlyHint: true, untrustedContentHint: true, destructiveHint: false },
        execute: async (input, options) => {
          try {
            const output = await services.inspect(inspectInput.parse(input), 'webmcp')
            onChange()
            return bounded(manifestOutput.parse(output))
          } catch (error) {
            return failure(executionSignal(options).aborted ? new DOMException('', 'AbortError') : error)
          }
        }
      }, {
        name: 'evaluate_quantum_call',
        title: 'Evaluate quantum call',
        description: 'Recommend a safe next action from the manifest, target snapshot and bounded intent. This tool grants no execution authority.',
        inputSchema: schemas.evaluate_quantum_call,
        annotations: { readOnlyHint: true, destructiveHint: false },
        execute: async (input, options) => {
          try {
            const output = await services.evaluate(evaluateInput.parse(input), 'webmcp')
            onChange()
            return bounded(recommendationOutput.parse(output))
          } catch (error) {
            return failure(executionSignal(options).aborted ? new DOMException('', 'AbortError') : error)
          }
        }
      })
    }
    if (state.recommendation?.decision === 'simulate_first' && consentIsValid && state.consent) {
      tools.push({
        name: 'run_bounded_local_simulation',
        title: 'Run bounded local simulation',
        description: 'Consume private visible-human consent and run the approved Q# or OpenQASM Bell fixture locally in a Worker. No provider or QPU call occurs.',
        inputSchema: schemas.run_bounded_local_simulation,
        annotations: { readOnlyHint: false, destructiveHint: false },
        execute: async (input, options) => {
          try {
            const receipt = await services.simulate(simulationInput.parse(input), executionSignal(options), 'webmcp')
            onChange()
            const simulation = receipt.simulation!
            return bounded(simulationOutput.parse({
              receipt_id: receipt.receipt_id,
              run_id: simulation.run_id,
              bell_invariant: simulation.bell_invariant,
              shots_requested: simulation.shots_requested,
              shots_returned: simulation.shots_returned,
              outcome_counts: simulation.outcome_counts,
              effects: receipt.effects,
              digest: receipt.digest,
              summary: 'Bounded local Bell simulation completed after one-time human consent.'
            }))
          } catch (error) {
            onChange()
            return failure(error)
          }
        }
      })
    }
    if (state.receipt) {
      tools.push({
        name: 'export_quantum_evidence_report',
        title: 'Export quantum evidence report',
        description: 'Export the current v3 receipt without re-evaluating or executing the experiment.',
        inputSchema: schemas.export_quantum_evidence_report,
        annotations: { readOnlyHint: true, destructiveHint: false },
        execute: async (input, options) => {
          try {
            const output = await services.exportPacket(exportInput.parse(input), 'webmcp')
            onChange()
            return bounded(exportOutput.parse(output))
          } catch (error) {
            return failure(executionSignal(options).aborted ? new DOMException('', 'AbortError') : error)
          }
        }
      })
    }
    void Promise.all(tools.map((tool) => modelContext.registerTool(tool, { signal: controller.signal })))
      .then(() => {
        if (!controller.signal.aborted) setRegistrationStatus('registered')
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          controller.abort()
          setRegistrationStatus('error')
        }
      })
    return () => controller.abort()
  }, [
    services,
    state.manifest?.manifest_id,
    state.recommendation?.decision,
    state.consent?.consent_id,
    state.consent?.used,
    state.consent?.revoked_at,
    state.authority_state,
    state.receipt?.receipt_id,
    consentIsValid,
    onChange
  ])

  return { supported, toolNames, registrationStatus }
}
