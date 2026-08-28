import { useEffect, useState } from 'react'
import { ZodError } from 'zod'
import { evaluateInput, evaluationOutput, exportInput, exportOutput, inspectInput, inspectionOutput, simulationInput, simulationOutput } from './contracts'
import type { QcgServices } from './services'
import type { QcgState, ToolName } from './types'

type JsonSchema = Record<string, unknown>
interface WebMcpTool {
  name: ToolName
  title: string
  description: string
  inputSchema: JsonSchema
  annotations: { readOnlyHint?: boolean; untrustedContentHint?: boolean }
  execute: (input: object, options?: { signal?: AbortSignal }) => Promise<unknown>
}
interface ModelContext {
  registerTool(tool: WebMcpTool, options: { signal: AbortSignal }): Promise<void>
}

declare global {
  interface Document { modelContext?: ModelContext }
}

const schemas: Record<ToolName, JsonSchema> = {
  inspect_quantum_experiment: { type: 'object', additionalProperties: false, required: ['artifact_id'], properties: { artifact_id: { type: 'string', pattern: '^[a-z0-9][a-z0-9_-]{2,63}$', description: 'Selected QCG artifact identifier.' } } },
  evaluate_quantum_call: {
    type: 'object', additionalProperties: false, required: ['inspection_id', 'scientific_intent', 'requested_limits'],
    properties: {
      inspection_id: { type: 'string', pattern: '^[a-z0-9][a-z0-9_-]{2,63}$', description: 'Current QCG inspection identifier.' },
      scientific_intent: { type: 'string', minLength: 12, maxLength: 320, description: 'Scientific question the caller intends to answer.' },
      requested_limits: {
        type: 'object', additionalProperties: false, required: ['shots', 'timeout_ms', 'max_qubits', 'target'],
        properties: {
          shots: { type: 'integer', minimum: 1, maximum: 256 },
          timeout_ms: { type: 'integer', minimum: 500, maximum: 15000 },
          max_qubits: { type: 'integer', minimum: 1, maximum: 8 },
          target: { type: 'string', enum: ['local_simulator', 'external_unspecified'] }
        }
      }
    }
  },
  run_bounded_qsharp_simulation: { type: 'object', additionalProperties: false, required: ['decision_id'], properties: { decision_id: { type: 'string', pattern: '^[a-z0-9][a-z0-9_-]{2,63}$', description: 'Current simulate_first decision identifier.' } } },
  export_quantum_evidence_report: { type: 'object', additionalProperties: false, required: ['evidence_packet_id', 'format'], properties: { evidence_packet_id: { type: 'string', pattern: '^[a-z0-9][a-z0-9_-]{2,63}$', description: 'Current QCG evidence packet identifier.' }, format: { type: 'string', enum: ['json', 'markdown'], description: 'Safe export format.' } } }
}

function bounded<T extends object>(value: T): T {
  const serialized = JSON.stringify(value)
  if (serialized.length <= 3500) return value
  return { summary: 'Result exceeds the WebMCP output budget. Use the visible QCG evidence panel.' } as T
}

function failure(error: unknown): never {
  const message = error instanceof DOMException && error.name === 'AbortError'
    ? 'Tool execution cancelled.'
    : error instanceof ZodError
      ? 'Arguments failed the QCG contract.'
      : error instanceof Error && /^(inspection_id|decision_id|evidence_packet_id|A valid|Consent|Local Q#|Bounded local)/.test(error.message)
        ? error.message
        : 'QCG request could not be completed.'
  throw new Error(message.slice(0, 260))
}

function executionSignal(options?: { signal?: AbortSignal }): AbortSignal {
  return options?.signal ?? new AbortController().signal
}

export function useQcgWebMcp(services: QcgServices, state: QcgState, onChange: () => void): { supported: boolean; toolNames: ToolName[]; registrationStatus: 'unavailable' | 'registering' | 'registered' | 'error' } {
  const supported = Boolean(document.modelContext?.registerTool)
  const [registrationStatus, setRegistrationStatus] = useState<'unavailable' | 'registering' | 'registered' | 'error'>(supported ? 'registering' : 'unavailable')
  const toolNames: ToolName[] = ['inspect_quantum_experiment', 'evaluate_quantum_call']
  if (state.evaluation?.decision === 'simulate_first' && state.consent) toolNames.push('run_bounded_qsharp_simulation')
  if (state.evidence) toolNames.push('export_quantum_evidence_report')

  useEffect(() => {
    const modelContext = document.modelContext
    if (!modelContext?.registerTool) { setRegistrationStatus('unavailable'); return }
    setRegistrationStatus('registering')
    const controller = new AbortController()
    const tools: WebMcpTool[] = [
      {
        name: 'inspect_quantum_experiment', title: 'Inspect quantum experiment', description: 'Inspect one selected QCG artifact and return a compact manifest and provenance.', inputSchema: schemas.inspect_quantum_experiment,
        annotations: { readOnlyHint: true, untrustedContentHint: true },
        execute: async (input, options) => { try { const output = await services.inspect(inspectInput.parse(input), 'webmcp'); onChange(); return bounded(inspectionOutput.parse(output)) } catch (error) { return failure(executionSignal(options).aborted ? new DOMException('', 'AbortError') : error) } }
      },
      {
        name: 'evaluate_quantum_call', title: 'Evaluate quantum call', description: 'Evaluate the inspected artifact, scientific intent, and bounded limits without executing a provider.', inputSchema: schemas.evaluate_quantum_call,
        annotations: { readOnlyHint: true },
        execute: async (input, options) => { try { const output = await services.evaluate(evaluateInput.parse(input), 'webmcp'); onChange(); return bounded(evaluationOutput.parse(output)) } catch (error) { return failure(executionSignal(options).aborted ? new DOMException('', 'AbortError') : error) } }
      }
    ]
    if (state.evaluation?.decision === 'simulate_first' && state.consent) tools.push({
      name: 'run_bounded_qsharp_simulation', title: 'Run bounded Q# simulation', description: 'Run the fixed Bell-pair local simulation after the visible one-time consent gate. No network or provider call occurs.', inputSchema: schemas.run_bounded_qsharp_simulation,
      annotations: { readOnlyHint: false },
      execute: async (input, options) => { try {
        const evidence = await services.simulate(simulationInput.parse(input), executionSignal(options), 'webmcp')
        onChange()
        return bounded(simulationOutput.parse({
          evidence_packet_id: evidence.evidence_packet_id,
          run_id: evidence.run_id,
          bell_invariant: evidence.bell_invariant,
          shots_requested: evidence.shots_requested,
          shots_returned: evidence.shots_returned,
          outcome_counts: evidence.outcome_counts,
          counters: evidence.counters,
          digest: evidence.digest,
          summary: 'Bounded local Bell simulation completed.'
        }))
      } catch (error) { return failure(error) } }
    })
    if (state.evidence) tools.push({
      name: 'export_quantum_evidence_report', title: 'Export quantum evidence report', description: 'Prepare a compact JSON or Markdown evidence export for the current QCG packet.', inputSchema: schemas.export_quantum_evidence_report,
      annotations: { readOnlyHint: true },
      execute: async (input, options) => { try { const output = await services.exportPacket(exportInput.parse(input), 'webmcp'); onChange(); return bounded(exportOutput.parse(output)) } catch (error) { return failure(executionSignal(options).aborted ? new DOMException('', 'AbortError') : error) } }
    })
    void Promise.all(tools.map((tool) => modelContext.registerTool(tool, { signal: controller.signal })))
      .then(() => { if (!controller.signal.aborted) setRegistrationStatus('registered') })
      .catch(() => {
        if (!controller.signal.aborted) {
          controller.abort()
          setRegistrationStatus('error')
        }
      })
    return () => controller.abort()
  }, [services, state.evaluation?.decision, state.consent, state.evidence?.evidence_packet_id, onChange])

  return { supported, toolNames, registrationStatus }
}
