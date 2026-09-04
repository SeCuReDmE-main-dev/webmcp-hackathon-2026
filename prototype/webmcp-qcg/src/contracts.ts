import { z } from 'zod'
import { decisions, humanChoices } from './types'
import { quantumProfileIds } from './quantumAdapters'

const identifier = z.string().regex(/^[a-z0-9][a-z0-9_-]{2,63}$/)
const sha256 = z.string().regex(/^[a-f0-9]{64}$/)
const isoDate = z.string().datetime({ offset: true })
const parameterKey = z.string().regex(/^[a-z][a-z0-9_]{0,47}$/)
const parameterValue = z.union([
  z.string().max(120),
  z.number().min(-1_000_000_000_000).max(1_000_000_000_000),
  z.boolean()
])

export const inspectInput = z.object({ artifact_id: identifier }).strict()
export const limits = z.object({
  shots: z.number().int().min(1).max(256),
  timeout_ms: z.number().int().min(500).max(15_000),
  max_qubits: z.number().int().min(1).max(8),
  target: z.enum(['local_simulator', 'external_reference'])
}).strict()
export const evaluateInput = z.object({
  manifest_id: identifier,
  target_profile_id: identifier,
  scientific_intent: z.string().trim().min(12).max(320),
  observable: z.string().trim().min(3).max(80),
  parameters: z.record(parameterKey, parameterValue)
    .refine((value) => Object.keys(value).length <= 12, 'At most 12 parameters are allowed.'),
  requested_limits: limits
}).strict()
export const humanDecisionInput = z.object({
  recommendation_id: identifier,
  choice: z.enum(humanChoices),
  justification: z.string().trim().max(500)
}).strict()
export const simulationInput = z.object({
  recommendation_id: identifier
}).strict()
export const exportInput = z.object({
  receipt_id: identifier,
  format: z.enum(['json', 'markdown'])
}).strict()

const compilerEvidenceFields = {
  status: z.enum(['compiled', 'invalid', 'unverified']),
  diagnostic_count: z.number().int().nonnegative().max(1000),
  diagnostics: z.array(z.string().max(160)).max(4),
  profile_digest: z.string().max(80),
  bounded_entrypoint: z.boolean(),
  // 9 is the bounded public sentinel for "nine or more", which lets the
  // manifest remain inspectable before policy rejects work above the MVP cap.
  estimated_qubits: z.number().int().min(0).max(9).nullable()
}

const compilerEvidence = z.discriminatedUnion('name', [
  z.object({
    name: z.literal('qsharp-lang'),
    version: z.literal('1.31.0'),
    ...compilerEvidenceFields
  }).strict(),
  z.object({
    name: z.literal('qcg-static-inspector'),
    version: z.literal('1.0.0'),
    ...compilerEvidenceFields
  }).strict()
])

const profileCapabilities = z.object({
  inspect: z.literal(true),
  compile: z.boolean(),
  simulate: z.boolean(),
  static_only: z.boolean()
}).strict()

export const manifestOutput = z.object({
  schema_version: z.literal('webmcp-qcg.artifact-manifest.v2'),
  manifest_id: identifier,
  artifact_id: identifier,
  file_name: z.string().max(128),
  artifact_digest: sha256,
  byte_size: z.number().int().min(1).max(131_072),
  format: z.enum(['qsharp', 'openqasm3', 'qiskit-python', 'cirq-tfq-python', 'torchquantum-python', 'pennylane-python', 'cudaq-python', 'cudaq-cpp', 'braket-python', 'qir-text']),
  artifact_profile: z.enum(quantumProfileIds as [string, ...string[]]),
  capabilities: profileCapabilities,
  provenance: z.enum(['human_import', 'demo_fixture']),
  compiler: compilerEvidence,
  created_at: isoDate
}).strict()

const effectCounters = z.object({
  inspections: z.number().int().nonnegative(),
  evaluations: z.number().int().nonnegative(),
  local_simulations: z.number().int().nonnegative(),
  metadata_validations: z.number().int().nonnegative(),
  qpu_submissions: z.literal(0),
  evidence_exports: z.number().int().nonnegative()
}).strict()

export const recommendationOutput = z.object({
  schema_version: z.literal('webmcp-qcg.recommendation.v2'),
  recommendation_id: identifier,
  manifest_id: identifier,
  target_profile_id: identifier,
  decision: z.enum(decisions),
  reason_codes: z.array(z.string().max(64)).max(8),
  unknowns: z.array(z.string().max(160)).max(6),
  confidence: z.enum(['high', 'medium', 'low']),
  safer_alternative: z.string().max(220),
  scientific_intent: z.string().max(320),
  observable: z.string().max(80),
  parameters_digest: sha256,
  requested_limits: limits,
  reuse_key: sha256,
  expires_at: isoDate,
  valid: z.boolean()
}).strict()

export const simulationOutput = z.object({
  receipt_id: identifier,
  run_id: identifier,
  bell_invariant: z.boolean(),
  shots_requested: z.number().int().min(1).max(256),
  shots_returned: z.number().int().nonnegative().max(256),
  outcome_counts: z.record(z.string().max(80), z.number().int().nonnegative()),
  effects: effectCounters,
  digest: sha256,
  summary: z.string().max(300)
}).strict()

export const exportOutput = z.object({
  export_id: identifier,
  receipt_id: identifier,
  format: z.enum(['json', 'markdown']),
  digest: sha256,
  summary: z.string().max(220),
  content: z.string().max(12000)
}).strict()

export type InspectInput = z.infer<typeof inspectInput>
export type EvaluateInput = z.infer<typeof evaluateInput>
export type HumanDecisionInput = z.infer<typeof humanDecisionInput>
export type SimulationInput = z.infer<typeof simulationInput>
export type ExportInput = z.infer<typeof exportInput>
