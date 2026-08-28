import { exportInput, evaluateInput, inspectInput, simulationInput } from './contracts'
import { demoCards } from './catalog'
import type { DemoCard } from './catalog'
import { digest, id } from './crypto'
import { initialState, type EvidencePacket, type Evaluation, type Inspection, type Invocation, type QcgState, type RequestedLimits } from './types'

export interface Simulator {
  run(signal: AbortSignal, limits: RequestedLimits): Promise<{ bellInvariant: boolean; shotsRequested: number; shotsReturned: number; outcomeCounts: Record<string, number> }>
}

export class WorkerSimulator implements Simulator {
  run(signal: AbortSignal, limits: RequestedLimits): Promise<{ bellInvariant: boolean; shotsRequested: number; shotsReturned: number; outcomeCounts: Record<string, number> }> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(new URL('./qsharp.worker.ts', import.meta.url), { type: 'module' })
      const requestId = crypto.randomUUID()
      let settled = false
      const finish = (callback: () => void) => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        signal.removeEventListener('abort', cancel)
        worker.terminate()
        callback()
      }
      const cancel = () => {
        finish(() => reject(new DOMException('Simulation cancelled', 'AbortError')))
      }
      const timer = setTimeout(() => finish(() => reject(new Error('Bounded local simulation timed out'))), limits.timeout_ms)
      signal.addEventListener('abort', cancel, { once: true })
      worker.onmessage = (event: MessageEvent<{ type: string; requestId?: string; bellInvariant?: boolean; shotsRequested?: number; shotsReturned?: number; outcomeCounts?: Record<string, number>; message?: string }>) => {
        if (event.data.requestId !== requestId) return
        if (event.data.type === 'complete') finish(() => resolve({
          bellInvariant: Boolean(event.data.bellInvariant),
          shotsRequested: event.data.shotsRequested ?? limits.shots,
          shotsReturned: event.data.shotsReturned ?? 0,
          outcomeCounts: event.data.outcomeCounts ?? {}
        }))
        else finish(() => reject(new Error(event.data.message ?? 'Local Q# simulation failed')))
      }
      worker.onerror = () => {
        finish(() => reject(new Error('Local Q# simulation failed')))
      }
      if (signal.aborted) cancel()
      else worker.postMessage({ type: 'run', requestId, shots: limits.shots })
    })
  }
}

export class QcgServices {
  private state: QcgState = initialState()
  private readonly now: () => number

  constructor(private readonly simulator: Simulator = new WorkerSimulator(), clock: () => number = Date.now) {
    this.now = clock
  }

  snapshot(): QcgState { return structuredClone(this.state) }
  reset(): QcgState { this.state = initialState(); return this.snapshot() }

  private record(tool: Invocation['tool'], status: Invocation['status'], summary: string, source: Invocation['source'] = 'human'): void {
    this.state = {
      ...this.state,
      invocations: [{ id: crypto.randomUUID(), tool, status, summary, source, timestamp: new Date(this.now()).toISOString() }, ...this.state.invocations].slice(0, 20)
    }
  }

  async inspect(raw: unknown, source: Invocation['source'] = 'human'): Promise<Inspection> {
    const input = inspectInput.parse(raw)
    const card = demoCards.find((candidate) => candidate.id === input.artifact_id)
    const artifactKind = card?.artifactKind ?? 'unknown'
    const inspection: Inspection = {
      inspection_id: id('inspect', input.artifact_id), artifact_id: input.artifact_id,
      artifact_digest: await digest({ artifact: input.artifact_id, kind: artifactKind }), artifact_kind: artifactKind,
      provenance: 'Selected demo artifact; digest observed by QCG.',
      reason_codes: card ? [] : ['ARTIFACT_NOT_FOUND'], created_at: new Date(this.now()).toISOString()
    }
    this.state = {
      ...this.state,
      phase: card ? 'partial' : 'error',
      artifactId: input.artifact_id,
      inspection,
      evaluation: undefined,
      consent: false,
      evidence: undefined,
      counters: { ...this.state.counters, inspections: this.state.counters.inspections + 1 },
      error: card ? undefined : 'Selected artifact is unavailable.'
    }
    this.record('inspect_quantum_experiment', 'completed', `Inspection ${inspection.inspection_id} created.`, source)
    return inspection
  }

  async evaluate(raw: unknown, source: Invocation['source'] = 'human'): Promise<Evaluation> {
    const input = evaluateInput.parse(raw)
    if (!this.state.inspection || input.inspection_id !== this.state.inspection.inspection_id) throw new Error('inspection_id is unknown or stale.')
    const card = demoCards.find((candidate) => candidate.id === this.state.artifactId)
    if (!card) throw new Error('No compatible experiment is selected.')
    const counters = { ...this.state.counters, evaluations: this.state.counters.evaluations + 1 }
    const policy = this.resolveDecision(card, input.requested_limits)
    const nextActions: Record<Evaluation['decision'], string> = {
      reuse_result: 'Reuse the current evidence packet and avoid another computation.',
      reject: 'Revise the unsupported artifact or choose a compatible local pathway.',
      recompile: 'Compile for the declared target, then inspect the new artifact digest.',
      simulate_first: 'Request visible consent, then run the bounded local Q# simulation.',
      ready_for_external_execution: 'Request separate human authorization outside this prototype.'
    }
    const evaluation: Evaluation = {
      decision_id: id('decision', `${card.id}-${this.now()}`), inspection_id: input.inspection_id, decision: policy.decision,
      reason_codes: [policy.reasonCode], next_action: nextActions[policy.decision], scientific_intent: input.scientific_intent,
      requested_limits: input.requested_limits, counters,
      expires_at: new Date(this.now() + 5 * 60_000).toISOString(), valid: true
    }
    const evidence = await this.makeEvidence(evaluation)
    this.state = { ...this.state, phase: 'active', evaluation, consent: false, evidence, counters, error: undefined }
    this.record('evaluate_quantum_call', 'completed', `Decision: ${evaluation.decision}.`, source)
    return evaluation
  }

  grantConsent(): QcgState {
    if (this.state.evaluation?.decision !== 'simulate_first' || !this.isDecisionValid()) throw new Error('Consent is only available for a valid local simulation decision.')
    this.state = { ...this.state, consent: true }
    this.record('human', 'completed', 'Visible one-time consent recorded for bounded local simulation.')
    return this.snapshot()
  }

  async simulate(raw: unknown, signal: AbortSignal, source: Invocation['source'] = 'human'): Promise<EvidencePacket> {
    const input = simulationInput.parse(raw)
    const evaluation = this.state.evaluation
    if (!evaluation || input.decision_id !== evaluation.decision_id || !this.isDecisionValid()) throw new Error('decision_id is unknown or expired.')
    if (evaluation.decision !== 'simulate_first' || !this.state.consent) throw new Error('A valid simulate_first decision and visible one-time consent are required.')
    try {
      const counters = { ...this.state.counters, local_simulations: this.state.counters.local_simulations + 1 }
      this.state = { ...this.state, counters }
      const result = await this.simulator.run(signal, evaluation.requested_limits)
      const evidence = await this.makeEvidence(evaluation, id('run', evaluation.decision_id), result)
      this.state = { ...this.state, phase: 'active', consent: false, evidence, counters }
      this.record('run_bounded_qsharp_simulation', 'completed', `Bounded Bell simulation completed; invariant=${result.bellInvariant}.`, source)
      return evidence
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        this.state = { ...this.state, phase: 'cancelled', consent: false }
        this.record('run_bounded_qsharp_simulation', 'cancelled', 'Bounded simulation cancelled before evidence was recorded.', source)
      } else {
        this.state = { ...this.state, phase: 'error', consent: false, error: 'Local Q# simulation failed; no external call was made.' }
        this.record('run_bounded_qsharp_simulation', 'error', 'Local Q# simulation failed safely.', source)
      }
      throw error
    }
  }

  async exportPacket(raw: unknown, source: Invocation['source'] = 'human'): Promise<{ export_id: string; evidence_packet_id: string; format: 'json' | 'markdown'; digest: string; summary: string; content: string }> {
    const input = exportInput.parse(raw)
    const evidence = this.state.evidence
    if (!evidence || input.evidence_packet_id !== evidence.evidence_packet_id) throw new Error('evidence_packet_id is unknown.')
    const content = input.format === 'json' ? JSON.stringify(this.publicPacket(), null, 2) : this.markdownPacket()
    this.state = { ...this.state, counters: { ...this.state.counters, evidence_exports: this.state.counters.evidence_exports + 1 } }
    const result = { export_id: id('export', `${evidence.evidence_packet_id}-${input.format}`), evidence_packet_id: evidence.evidence_packet_id, format: input.format, digest: await digest(content), summary: `Evidence ${input.format.toUpperCase()} prepared without provider data.`, content }
    this.record('export_quantum_evidence_report', 'completed', `Evidence packet exported as ${input.format}.`, source)
    return result
  }

  private isDecisionValid(): boolean { return Boolean(this.state.evaluation && this.state.evaluation.valid && new Date(this.state.evaluation.expires_at).getTime() > this.now()) }
  private resolveDecision(card: DemoCard, limits: RequestedLimits): { decision: Evaluation['decision']; reasonCode: string } {
    if (card.freshEvidence) return { decision: 'reuse_result', reasonCode: 'EVIDENCE_REUSABLE' }
    if (!card.supported) return { decision: 'reject', reasonCode: 'ARTIFACT_INCOMPATIBLE' }
    if (limits.max_qubits < card.requiredQubits) return { decision: 'reject', reasonCode: 'QUBIT_BOUND_TOO_LOW' }
    if (!card.compiledForTarget) return { decision: 'recompile', reasonCode: 'RECOMPILE_REQUIRED' }
    if (!card.localEvidence) return { decision: 'simulate_first', reasonCode: 'LOCAL_SIMULATION_REQUIRED' }
    if (limits.target === 'external_unspecified') return { decision: 'ready_for_external_execution', reasonCode: 'EXTERNAL_EXECUTION_NOT_AUTHORIZED' }
    return { decision: 'reuse_result', reasonCode: 'LOCAL_EVIDENCE_REUSABLE' }
  }
  private async makeEvidence(evaluation: Evaluation, runId?: string, result?: { bellInvariant: boolean; shotsRequested: number; shotsReturned: number; outcomeCounts: Record<string, number> }): Promise<EvidencePacket> {
    const input = {
      inspection_id: evaluation.inspection_id,
      decision_id: evaluation.decision_id,
      run_id: runId,
      bell_invariant: result?.bellInvariant,
      shots_requested: result?.shotsRequested,
      shots_returned: result?.shotsReturned,
      outcome_counts: result?.outcomeCounts,
      counters: result ? this.state.counters : evaluation.counters
    }
    return { evidence_packet_id: id('evidence', `${evaluation.decision_id}-${runId ?? 'preflight'}`), ...input, digest: await digest(input), created_at: new Date(this.now()).toISOString() }
  }
  private publicPacket() { return { schema_version: 'webmcp.qcg.evidence.v1', inspection: this.state.inspection, evaluation: this.state.evaluation, evidence: this.state.evidence } }
  private markdownPacket() { const p = this.publicPacket(); return `# WebMCP-QCG evidence\n\n- Decision: ${p.evaluation?.decision}\n- Reason codes: ${p.evaluation?.reason_codes.join(', ') || 'none'}\n- Evidence packet: ${p.evidence?.evidence_packet_id}\n- Digest: ${p.evidence?.digest}\n- Bell invariant: ${p.evidence?.bell_invariant ?? 'not run'}\n- Local simulations: ${p.evidence?.counters.local_simulations ?? 0}\n- External provider calls: ${p.evidence?.counters.external_provider_calls ?? 0}\n` }
}
