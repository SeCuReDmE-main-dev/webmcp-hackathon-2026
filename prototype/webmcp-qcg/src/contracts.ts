import { z } from 'zod'
import { decisions } from './types'

const identifier = z.string().regex(/^[a-z0-9][a-z0-9_-]{2,63}$/)

export const inspectInput = z.object({ artifact_id: identifier }).strict()
export const limits = z.object({
  shots: z.number().int().min(1).max(256),
  timeout_ms: z.number().int().min(500).max(15_000),
  max_qubits: z.number().int().min(1).max(8),
  target: z.enum(['local_simulator', 'external_unspecified'])
}).strict()
export const evaluateInput = z.object({
  inspection_id: identifier,
  scientific_intent: z.string().trim().min(12).max(320),
  requested_limits: limits
}).strict()
export const simulationInput = z.object({ decision_id: identifier }).strict()
export const exportInput = z.object({ evidence_packet_id: identifier, format: z.enum(['json', 'markdown']) }).strict()

export const inspectionOutput = z.object({
  inspection_id: identifier,
  artifact_id: identifier,
  artifact_digest: z.string().length(64),
  artifact_kind: z.enum(['qsharp_bell', 'openqasm', 'unknown']),
  provenance: z.string().max(160),
  reason_codes: z.array(z.string().max(48)).max(6),
  created_at: z.string()
}).strict()

export const evaluationOutput = z.object({
  decision_id: identifier,
  inspection_id: identifier,
  decision: z.enum(decisions),
  reason_codes: z.array(z.string().max(48)).max(6),
  next_action: z.string().max(160),
  scientific_intent: z.string().max(320),
  requested_limits: limits,
  counters: z.object({
    inspections: z.number().int().nonnegative(),
    evaluations: z.number().int().nonnegative(),
    local_simulations: z.number().int().nonnegative(),
    evidence_exports: z.number().int().nonnegative(),
    external_provider_calls: z.literal(0)
  }).strict(),
  expires_at: z.string(),
  valid: z.boolean()
}).strict()

export const simulationOutput = z.object({
  evidence_packet_id: identifier,
  run_id: identifier,
  bell_invariant: z.boolean(),
  shots_requested: z.number().int().min(1).max(256),
  shots_returned: z.number().int().nonnegative().max(256),
  outcome_counts: z.record(z.string().max(80), z.number().int().nonnegative()),
  counters: evaluationOutput.shape.counters,
  digest: z.string().length(64),
  summary: z.string().max(300)
}).strict()

export const exportOutput = z.object({
  export_id: identifier,
  evidence_packet_id: identifier,
  format: z.enum(['json', 'markdown']),
  digest: z.string().length(64),
  summary: z.string().max(220),
  content: z.string().max(3000)
}).strict()

export type InspectInput = z.infer<typeof inspectInput>
export type EvaluateInput = z.infer<typeof evaluateInput>
export type SimulationInput = z.infer<typeof simulationInput>
export type ExportInput = z.infer<typeof exportInput>
