export const decisions = [
  'reuse_result',
  'reject',
  'recompile',
  'simulate_first',
  'ready_for_external_execution'
] as const

export const humanChoices = ['accepted', 'overridden', 'deferred'] as const

export type Decision = (typeof decisions)[number]
export type HumanChoice = (typeof humanChoices)[number]
export type AppPhase = 'empty' | 'partial' | 'active' | 'cancelled' | 'error' | 'recovery'
export type AuthorityState = 'ready' | 'consent_required' | 'authorized' | 'expired' | 'revoked' | 'consumed'
export type EvidenceState = 'known' | 'unknown' | 'stale'
export type ToolName =
  | 'inspect_quantum_experiment'
  | 'evaluate_quantum_call'
  | 'run_bounded_local_simulation'
  | 'export_quantum_evidence_report'

export type QuantumProfileId =
  | 'qsharp-qdk' | 'openqasm3-qdk' | 'qiskit-python' | 'cirq-tfq-python'
  | 'torchquantum-python' | 'pennylane-python' | 'cudaq-python' | 'cudaq-cpp'
  | 'braket-python' | 'qir-text'

export type ArtifactFormat =
  | 'qsharp' | 'openqasm3' | 'qiskit-python' | 'cirq-tfq-python'
  | 'torchquantum-python' | 'pennylane-python' | 'cudaq-python' | 'cudaq-cpp'
  | 'braket-python' | 'qir-text'

export interface ProfileCapabilities {
  inspect: boolean
  compile: boolean
  simulate: boolean
  static_only: boolean
}

export interface QuantumProfileSummary {
  id: QuantumProfileId
  label: string
  format: ArtifactFormat
  capabilities: ProfileCapabilities
}

export interface RequestedLimits {
  shots: number
  timeout_ms: number
  max_qubits: number
  target: 'local_simulator' | 'external_reference'
}

export interface CompilerEvidence {
  name: 'qsharp-lang' | 'qcg-static-inspector'
  version: '1.31.0' | '1.0.0'
  status: 'compiled' | 'invalid' | 'unverified'
  diagnostic_count: number
  diagnostics: string[]
  profile_digest: string
  bounded_entrypoint: boolean
  estimated_qubits: number | null
}

export interface ArtifactManifest {
  schema_version: 'webmcp-qcg.artifact-manifest.v2'
  manifest_id: string
  artifact_id: string
  file_name: string
  artifact_digest: string
  byte_size: number
  format: ArtifactFormat
  artifact_profile: QuantumProfileId
  capabilities: ProfileCapabilities
  provenance: 'human_import' | 'demo_fixture'
  compiler: CompilerEvidence
  created_at: string
}

export interface TargetProfileSnapshot {
  schema_version: 'webmcp-qcg.target-profile.v2'
  profile_id: string
  label: string
  source: string
  source_digest: string
  captured_at: string
  expires_at: string
  evidence_state: EvidenceState
  execution_surface: 'local_wasm' | 'external_reference'
  max_qubits: number
  compiler_profile_digest: string
  submission_enabled: false
}

export interface AgentRecommendation {
  schema_version: 'webmcp-qcg.recommendation.v2'
  recommendation_id: string
  manifest_id: string
  target_profile_id: string
  decision: Decision
  reason_codes: string[]
  unknowns: string[]
  confidence: 'high' | 'medium' | 'low'
  safer_alternative: string
  scientific_intent: string
  observable: string
  parameters_digest: string
  requested_limits: RequestedLimits
  reuse_key: string
  expires_at: string
  valid: boolean
}

export interface HumanDecision {
  schema_version: 'webmcp-qcg.human-decision.v2'
  human_decision_id: string
  recommendation_id: string
  choice: HumanChoice
  justification: string
  override: boolean
  decided_at: string
}

export interface ConsentToken {
  consent_id: string
  recommendation_id: string
  created_at: string
  expires_at: string
  used: boolean
  revoked_at?: string
}

export interface EffectCounters {
  inspections: number
  evaluations: number
  local_simulations: number
  metadata_validations: number
  qpu_submissions: 0
  evidence_exports: number
}

export interface SimulationEvidence {
  run_id: string
  bell_invariant: boolean
  shots_requested: number
  shots_returned: number
  outcome_counts: Record<string, number>
  completed_at: string
}

export interface EvidenceReceipt {
  schema_version: 'webmcp-qcg.evidence-receipt.v3'
  receipt_id: string
  manifest: ArtifactManifest
  target_profile: TargetProfileSnapshot
  recommendation: AgentRecommendation
  human_decision: HumanDecision | null
  simulation: SimulationEvidence | null
  effects: EffectCounters
  format: ArtifactFormat
  artifact_profile: QuantumProfileSummary
  compiler_facts: CompilerEvidence
  digest: string
  created_at: string
  updated_at: string
  migration?: { from: 'webmcp.qcg.evidence.v1' | 'webmcp-qcg.evidence-receipt.v2'; source_digest: string }
}

export interface Invocation {
  id: string
  tool: ToolName | 'human' | 'system'
  status: 'completed' | 'cancelled' | 'error'
  timestamp: string
  summary: string
  source: 'human' | 'webmcp' | 'system'
}

export interface QcgState {
  phase: AppPhase
  authority_state: AuthorityState
  activeArtifactId?: string
  manifest?: ArtifactManifest
  targetProfile?: TargetProfileSnapshot
  recommendation?: AgentRecommendation
  humanDecision?: HumanDecision
  consent?: ConsentToken
  receipt?: EvidenceReceipt
  effects: EffectCounters
  invocations: Invocation[]
  error?: string
}

export const zeroEffects = (): EffectCounters => ({
  inspections: 0,
  evaluations: 0,
  local_simulations: 0,
  metadata_validations: 0,
  qpu_submissions: 0,
  evidence_exports: 0
})

export const initialState = (): QcgState => ({ phase: 'empty', authority_state: 'ready', effects: zeroEffects(), invocations: [] })
