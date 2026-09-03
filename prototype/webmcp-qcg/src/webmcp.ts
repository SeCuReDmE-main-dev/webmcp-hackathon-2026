import { useEffect, useMemo, useRef, useState } from 'react'
import { toJSONSchema, z, ZodError, type ZodType } from 'zod'
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
  outputSchema: JsonSchema
  annotations: { readOnlyHint?: boolean; untrustedContentHint?: boolean; destructiveHint?: boolean }
  execute: (input: object, options?: { signal?: AbortSignal }) => Promise<unknown>
}
interface ModelContext {
  registerTool(tool: WebMcpTool, options: { signal: AbortSignal }): void | Promise<void>
}

declare global {
  interface Document { modelContext?: ModelContext }
}

const identifier = { type: 'string', pattern: '^[a-z0-9][a-z0-9_-]{2,63}$' }
const schemas: Record<ToolName, JsonSchema> = {
  inspect_quantum_experiment: {
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {
      artifact_id: { ...identifier, description: 'Optional identifier shown by the current QCG session. Omit it to inspect the quantum file the person already loaded in this browser.' }
    }
  },
  evaluate_quantum_call: {
    type: 'object',
    additionalProperties: false,
    required: ['manifest_id', 'target_profile_id', 'scientific_intent', 'observable', 'parameters', 'requested_limits'],
    properties: {
      manifest_id: { ...identifier, description: 'Use manifest_id returned by inspect_quantum_experiment.' },
      target_profile_id: { ...identifier, description: 'Use the target profile selected in the visible QCG decision card.' },
      scientific_intent: { type: 'string', minLength: 12, maxLength: 320, description: 'Plain-language purpose of the proposed quantum call.' },
      observable: { type: 'string', minLength: 3, maxLength: 80, description: 'Measurement or result the proposed call is expected to produce.' },
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
      recommendation_id: { ...identifier, description: 'Use recommendation_id returned by evaluate_quantum_call. The page separately verifies one-time human consent.' }
    }
  },
  export_quantum_evidence_report: {
    type: 'object',
    additionalProperties: false,
    required: ['receipt_id', 'format'],
    properties: {
      receipt_id: { ...identifier, description: 'Use receipt_id returned by evaluate_quantum_call or run_bounded_local_simulation.' },
      format: { type: 'string', enum: ['json', 'markdown'], description: 'Choose machine-readable JSON or human-readable Markdown.' }
    }
  }
}

const budgetNoticeSchema: JsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['truncated', 'summary', 'budget_bytes'],
  properties: {
    truncated: { const: true },
    summary: { type: 'string' },
    budget_bytes: { const: 5000 }
  }
}

const outputIdentifier = z.string().regex(/^[a-z0-9][a-z0-9_-]{2,63}$/)
const inspectToolOutput = manifestOutput.extend({
  manifest_id: outputIdentifier.describe('Pass this identifier to evaluate_quantum_call.'),
  artifact_id: outputIdentifier.describe('Identifies the human-loaded file inside the current browser session.')
})
const evaluateToolOutput = recommendationOutput.extend({
  recommendation_id: outputIdentifier.describe('Pass this identifier to run_bounded_local_simulation when local simulation is recommended.'),
  manifest_id: outputIdentifier.describe('The manifest identifier received from inspect_quantum_experiment.'),
  receipt_id: outputIdentifier.describe('Pass this identifier to export_quantum_evidence_report.')
})
const simulationToolOutput = simulationOutput.extend({
  receipt_id: outputIdentifier.describe('Pass this updated evidence receipt identifier to export_quantum_evidence_report.'),
  run_id: outputIdentifier.describe('Identifies this bounded local simulation run.')
})
const exportToolOutput = exportOutput.extend({
  receipt_id: outputIdentifier.describe('The evidence receipt that was exported.'),
  export_id: outputIdentifier.describe('Identifies this export operation.')
})

function boundedOutputSchema(schema: ZodType): JsonSchema {
  const output = toJSONSchema(schema, { target: 'draft-7' }) as JsonSchema
  delete output.$schema
  return { anyOf: [output, budgetNoticeSchema] }
}

const outputSchemas: Record<ToolName, JsonSchema> = {
  inspect_quantum_experiment: boundedOutputSchema(inspectToolOutput),
  evaluate_quantum_call: boundedOutputSchema(evaluateToolOutput),
  run_bounded_local_simulation: boundedOutputSchema(simulationToolOutput),
  export_quantum_evidence_report: boundedOutputSchema(exportToolOutput)
}

export const WEBMCP_RESPONSE_BUDGET_BYTES = 5_000 as const

export interface WebMcpBudgetNotice {
  truncated: true
  summary: string
  budget_bytes: typeof WEBMCP_RESPONSE_BUDGET_BYTES
}

export function boundedWebMcpResponse<T extends object>(value: T): T | WebMcpBudgetNotice {
  const byteLength = new TextEncoder().encode(JSON.stringify(value)).byteLength
  if (byteLength <= WEBMCP_RESPONSE_BUDGET_BYTES) return value
  return {
    truncated: true,
    summary: 'The result exceeds the WebMCP response budget. Review the visible QCG receipt.',
    budget_bytes: WEBMCP_RESPONSE_BUDGET_BYTES
  }
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
  _state: QcgState,
  onChange: () => void
): {
  supported: boolean
  toolNames: ToolName[]
  registrationStatus: 'unavailable' | 'registering' | 'registered' | 'error'
} {
  const supported = Boolean(document.modelContext?.registerTool)
  const [registrationStatus, setRegistrationStatus] =
    useState<'unavailable' | 'registering' | 'registered' | 'error'>(supported ? 'registering' : 'unavailable')
  // Discovery is stable at page load so agents and directory scanners can map
  // the complete QCG capability surface. Each service still enforces its own
  // manifest, recommendation, human-decision, consent and receipt preconditions.
  const toolNames = useMemo<ToolName[]>(() => [
    'inspect_quantum_experiment',
    'evaluate_quantum_call',
    'run_bounded_local_simulation',
    'export_quantum_evidence_report'
  ], [])

  const registrations = useRef(new Map<ToolName, { controller: AbortController; pending: boolean }>())
  const registrationFailures = useRef(new Set<ToolName>())
  const desiredToolNames = useRef<ToolName[]>(toolNames)
  desiredToolNames.current = toolNames
  const tools = useMemo<Record<ToolName, WebMcpTool>>(() => ({
    inspect_quantum_experiment: {
      name: 'inspect_quantum_experiment', title: 'Inspect quantum experiment',
      description: 'Return metadata for the quantum file the person loaded in this browser. The result includes manifest_id for evaluate_quantum_call and never includes the file contents.',
      inputSchema: schemas.inspect_quantum_experiment,
      outputSchema: outputSchemas.inspect_quantum_experiment,
      annotations: { readOnlyHint: true, untrustedContentHint: true, destructiveHint: false },
      execute: async (input, options) => {
        try {
          const rawInput = input as Record<string, unknown>
          const requestedId = typeof rawInput.artifact_id === 'string' ? rawInput.artifact_id : services.snapshot().manifest?.artifact_id
          if (!requestedId) throw new Error('The artifact must be loaded by a person before inspection.')
          const output = await services.inspect(inspectInput.parse({ artifact_id: requestedId }), 'webmcp')
          onChange()
          return boundedWebMcpResponse(inspectToolOutput.parse(output))
        } catch (error) { return failure(executionSignal(options).aborted ? new DOMException('', 'AbortError') : error) }
      }
    },
    evaluate_quantum_call: {
      name: 'evaluate_quantum_call', title: 'Evaluate quantum call',
      description: 'Review the inspected file against a selected target and return one recommended next step. Use manifest_id from inspect_quantum_experiment. The result includes recommendation_id for an approved local simulation.',
      inputSchema: schemas.evaluate_quantum_call,
      outputSchema: outputSchemas.evaluate_quantum_call,
      annotations: { readOnlyHint: true, destructiveHint: false },
      execute: async (input, options) => {
        try {
          const output = await services.evaluate(evaluateInput.parse(input), 'webmcp')
          onChange()
          const receiptId = services.snapshot().receipt?.receipt_id
          if (!receiptId) throw new Error('receipt_id was not created for the current recommendation.')
          return boundedWebMcpResponse(evaluateToolOutput.parse({ ...output, receipt_id: receiptId }))
        } catch (error) { return failure(executionSignal(options).aborted ? new DOMException('', 'AbortError') : error) }
      }
    },
    run_bounded_local_simulation: {
      name: 'run_bounded_local_simulation', title: 'Run bounded local simulation',
      description: 'Run the approved two-qubit Bell example in this browser after the person accepts the recommendation. Use recommendation_id from evaluate_quantum_call. Requires one-time human consent and makes no hardware or provider call.',
      inputSchema: schemas.run_bounded_local_simulation,
      outputSchema: outputSchemas.run_bounded_local_simulation,
      annotations: { readOnlyHint: false, destructiveHint: false },
      execute: async (input, options) => {
        try {
          const receipt = await services.simulate(simulationInput.parse(input), executionSignal(options), 'webmcp')
          onChange()
          const simulation = receipt.simulation!
          return boundedWebMcpResponse(simulationToolOutput.parse({
            receipt_id: receipt.receipt_id, run_id: simulation.run_id, bell_invariant: simulation.bell_invariant,
            shots_requested: simulation.shots_requested, shots_returned: simulation.shots_returned,
            outcome_counts: simulation.outcome_counts, effects: receipt.effects, digest: receipt.digest,
            summary: 'Bounded local Bell simulation completed after one-time human consent.'
          }))
        } catch (error) { onChange(); return failure(error) }
      }
    },
    export_quantum_evidence_report: {
      name: 'export_quantum_evidence_report', title: 'Export quantum evidence report',
      description: 'Export an existing evidence receipt as JSON or Markdown. Use receipt_id returned by evaluate_quantum_call or run_bounded_local_simulation. This does not evaluate or run the experiment again.',
      inputSchema: schemas.export_quantum_evidence_report,
      outputSchema: outputSchemas.export_quantum_evidence_report,
      annotations: { readOnlyHint: true, destructiveHint: false },
      execute: async (input, options) => {
        try {
          const output = await services.exportPacket(exportInput.parse(input), 'webmcp')
          onChange()
          return boundedWebMcpResponse(exportToolOutput.parse(output))
        } catch (error) { return failure(executionSignal(options).aborted ? new DOMException('', 'AbortError') : error) }
      }
    }
  }), [onChange, services])

  useEffect(() => {
    const modelContext = document.modelContext
    if (!modelContext?.registerTool) {
      for (const registration of registrations.current.values()) registration.controller.abort()
      registrations.current.clear()
      registrationFailures.current.clear()
      setRegistrationStatus('unavailable')
      return
    }
    const desired = new Set(toolNames)
    const refreshStatus = (): void => {
      const active = desiredToolNames.current
      if (active.some((name) => registrationFailures.current.has(name))) {
        setRegistrationStatus('error')
        return
      }
      const ready = active.every((name) => {
        const registration = registrations.current.get(name)
        return Boolean(registration && !registration.pending && !registration.controller.signal.aborted)
      })
      setRegistrationStatus(ready ? 'registered' : 'registering')
    }
    for (const [name, registration] of registrations.current) {
      if (!desired.has(name)) {
        registration.controller.abort()
        registrations.current.delete(name)
        registrationFailures.current.delete(name)
      }
    }
    const additions = toolNames.filter((name) => !registrations.current.has(name)).map((name) => {
      registrationFailures.current.delete(name)
      const registration = { controller: new AbortController(), pending: true }
      registrations.current.set(name, registration)
      return { name, registration }
    })
    if (!additions.length) {
      refreshStatus()
      return
    }
    setRegistrationStatus('registering')
    for (const { name, registration } of additions) {
      let registrationResult: void | Promise<void>
      try {
        registrationResult = modelContext.registerTool(tools[name], { signal: registration.controller.signal })
      } catch {
        registration.controller.abort()
        registrations.current.delete(name)
        registrationFailures.current.add(name)
        setRegistrationStatus('error')
        continue
      }
      void Promise.resolve(registrationResult).then(() => {
        if (registrations.current.get(name) !== registration || registration.controller.signal.aborted) return
        registration.pending = false
        refreshStatus()
      }).catch(() => {
        if (registrations.current.get(name) !== registration || !desiredToolNames.current.includes(name)) return
        registration.controller.abort()
        registrations.current.delete(name)
        registrationFailures.current.add(name)
        setRegistrationStatus('error')
      })
    }
  }, [
    supported, toolNames, tools
  ])

  useEffect(() => () => {
    for (const registration of registrations.current.values()) registration.controller.abort()
    registrations.current.clear()
    registrationFailures.current.clear()
  }, [])

  return { supported, toolNames, registrationStatus }
}
