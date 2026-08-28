import type { Decision } from './types'

export interface DemoCard {
  id: string
  title: string
  expectedDecision: Decision
  detail: string
  reasonCode: string
  artifactKind: 'qsharp_bell' | 'openqasm' | 'unknown'
  requiredQubits: number
  supported: boolean
  freshEvidence: boolean
  compiledForTarget: boolean
  localEvidence: boolean
}

export const demoCards: DemoCard[] = [
  { id: 'reuse-evidence', title: 'Reuse the Fresh Result', expectedDecision: 'reuse_result', detail: 'Hypothesis: a current evidence packet already answers the selected question.', reasonCode: 'EVIDENCE_REUSABLE', artifactKind: 'qsharp_bell', requiredQubits: 2, supported: true, freshEvidence: true, compiledForTarget: true, localEvidence: true },
  { id: 'reject-incompatible', title: 'Reject the Unsupported Call', expectedDecision: 'reject', detail: 'Hypothesis: the selected artifact falls outside the bounded Q# pathway.', reasonCode: 'ARTIFACT_INCOMPATIBLE', artifactKind: 'unknown', requiredQubits: 2, supported: false, freshEvidence: false, compiledForTarget: false, localEvidence: false },
  { id: 'recompile-required', title: 'Recompile for the Target', expectedDecision: 'recompile', detail: 'Hypothesis: a deterministic compile step is required before execution.', reasonCode: 'RECOMPILE_REQUIRED', artifactKind: 'openqasm', requiredQubits: 2, supported: true, freshEvidence: false, compiledForTarget: false, localEvidence: false },
  { id: 'simulate-first', title: 'Simulate Before Spending', expectedDecision: 'simulate_first', detail: 'Hypothesis: a bounded local Bell simulation is the minimum next evidence step.', reasonCode: 'LOCAL_SIMULATION_REQUIRED', artifactKind: 'qsharp_bell', requiredQubits: 2, supported: true, freshEvidence: false, compiledForTarget: true, localEvidence: false },
  { id: 'external-ready', title: 'Ready, but Not Authorized', expectedDecision: 'ready_for_external_execution', detail: 'Hypothesis: the artifact is ready while external authorization remains absent.', reasonCode: 'EXTERNAL_EXECUTION_NOT_AUTHORIZED', artifactKind: 'qsharp_bell', requiredQubits: 2, supported: true, freshEvidence: false, compiledForTarget: true, localEvidence: true }
]
