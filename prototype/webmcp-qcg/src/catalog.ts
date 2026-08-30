import { EXTERNAL_PROFILE_ID, LOCAL_PROFILE_ID } from './targetProfiles'
import type { Decision, RequestedLimits } from './types'

export const bellProgram = `namespace Qcg {
  @EntryPoint()
  operation Main() : Result[] {
    use (left, right) = (Qubit(), Qubit());
    H(left);
    CNOT(left, right);
    let result = [M(left), M(right)];
    ResetAll([left, right]);
    return result;
  }
}`

export const bellOpenQasmProgram = `OPENQASM 3.0;
include "stdgates.inc";
qubit[2] q;
bit[2] c;
h q[0];
cx q[0], q[1];
c[0] = measure q[0];
c[1] = measure q[1];`

const invalidProgram = `namespace Qcg {
  @EntryPoint()
  operation Main() : Result[] {
    use q = Qubit()
    return [M(q)];
  }
}`

export interface DemoCard {
  id: string
  title: string
  expectedDecision: Decision
  detail: string
  scientificIntent: string
  observable: string
  profileId: string
  requestedLimits: RequestedLimits
  source: string
  evidenceSeed: 'reusable_result' | 'local_validation' | 'none'
  compiledProfile: 'current' | 'legacy'
}

const localLimits: RequestedLimits = { shots: 64, timeout_ms: 10_000, max_qubits: 2, target: 'local_simulator' }

export const demoCards: DemoCard[] = [
  {
    id: 'reuse-evidence', title: 'Reuse the Fresh Result', expectedDecision: 'reuse_result',
    detail: 'A byte-identical artifact and matching observable already have fresh evidence.',
    scientificIntent: 'Verify the Bell correlation without repeating an identical computation.', observable: 'bell_correlation',
    profileId: LOCAL_PROFILE_ID, requestedLimits: localLimits, source: bellProgram,
    evidenceSeed: 'reusable_result', compiledProfile: 'current'
  },
  {
    id: 'reject-incompatible', title: 'Reject the Unsupported Call', expectedDecision: 'reject',
    detail: 'The imported Q# artifact fails the bounded compiler gate.',
    scientificIntent: 'Evaluate whether the malformed Q# artifact can enter the bounded execution path.', observable: 'compile_validity',
    profileId: LOCAL_PROFILE_ID, requestedLimits: localLimits, source: invalidProgram,
    evidenceSeed: 'none', compiledProfile: 'current'
  },
  {
    id: 'recompile-required', title: 'Recompile for the Target', expectedDecision: 'recompile',
    detail: 'The artifact evidence was produced for an older target-profile digest.',
    scientificIntent: 'Refresh the compiler evidence against the selected target profile.', observable: 'target_compatibility',
    profileId: LOCAL_PROFILE_ID, requestedLimits: localLimits, source: bellProgram,
    evidenceSeed: 'none', compiledProfile: 'legacy'
  },
  {
    id: 'simulate-first', title: 'Simulate Before Spending', expectedDecision: 'simulate_first',
    detail: 'The valid Bell artifact has no matching local evidence yet.',
    scientificIntent: 'Measure the Bell correlation through one bounded local Q# simulation.', observable: 'bell_correlation',
    profileId: LOCAL_PROFILE_ID, requestedLimits: localLimits, source: bellProgram,
    evidenceSeed: 'none', compiledProfile: 'current'
  },
  {
    id: 'external-ready', title: 'Ready, but Not Authorized', expectedDecision: 'ready_for_external_execution',
    detail: 'Local evidence exists and the frozen external contract matches, while submission remains disabled.',
    scientificIntent: 'Review whether the validated artifact is ready to leave the local preflight boundary.', observable: 'bell_correlation',
    profileId: EXTERNAL_PROFILE_ID,
    requestedLimits: { ...localLimits, target: 'external_reference' }, source: bellProgram,
    evidenceSeed: 'local_validation', compiledProfile: 'current'
  }
]

export const findDemoCard = (artifactId: string): DemoCard | undefined =>
  demoCards.find((card) => artifactId.startsWith(`${card.id}-`) || artifactId === card.id)
