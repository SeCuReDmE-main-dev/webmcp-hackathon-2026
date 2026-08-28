export const decisions = [
  'reuse_result',
  'reject',
  'recompile',
  'simulate_first',
  'ready_for_external_execution'
] as const

export type Decision = (typeof decisions)[number]
export type AppPhase = 'empty' | 'partial' | 'active' | 'cancelled' | 'error' | 'recovery'
export type ToolName =
  | 'inspect_quantum_experiment'
  | 'evaluate_quantum_call'
  | 'run_bounded_qsharp_simulation'
  | 'export_quantum_evidence_report'

export interface RequestedLimits {
  shots: number
  timeout_ms: number
  max_qubits: number
  target: 'local_simulator' | 'external_unspecified'
}

export interface ExecutionCounters {
  inspections: number
  evaluations: number
  local_simulations: number
  evidence_exports: number
  external_provider_calls: number
}

export interface Inspection {
  inspection_id: string
  artifact_id: string
  artifact_digest: string
  artifact_kind: 'qsharp_bell' | 'openqasm' | 'unknown'
  provenance: string
  reason_codes: string[]
  created_at: string
}

export interface Evaluation {
  decision_id: string
  inspection_id: string
  decision: Decision
  reason_codes: string[]
  next_action: string
  scientific_intent: string
  requested_limits: RequestedLimits
  counters: ExecutionCounters
  expires_at: string
  valid: boolean
}

export interface EvidencePacket {
  evidence_packet_id: string
  inspection_id: string
  decision_id: string
  run_id?: string
  bell_invariant?: boolean
  shots_requested?: number
  shots_returned?: number
  outcome_counts?: Record<string, number>
  counters: ExecutionCounters
  digest: string
  created_at: string
}

export interface Invocation {
  id: string
  tool: ToolName | 'human'
  status: 'completed' | 'cancelled' | 'error'
  timestamp: string
  summary: string
  source: 'human' | 'webmcp'
}

export interface QcgState {
  phase: AppPhase
  artifactId?: string
  inspection?: Inspection
  evaluation?: Evaluation
  consent: boolean
  evidence?: EvidencePacket
  counters: ExecutionCounters
  invocations: Invocation[]
  error?: string
}

export const zeroCounters = (): ExecutionCounters => ({
  inspections: 0,
  evaluations: 0,
  local_simulations: 0,
  evidence_exports: 0,
  external_provider_calls: 0
})

export const initialState = (): QcgState => ({ phase: 'empty', consent: false, counters: zeroCounters(), invocations: [] })
