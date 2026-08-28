import { describe, expect, it } from 'vitest'
import { QcgServices, type Simulator } from './services'

class FakeSimulator implements Simulator {
  calls = 0
  async run(signal: AbortSignal, limits: { shots: number }): Promise<{ bellInvariant: boolean; shotsRequested: number; shotsReturned: number; outcomeCounts: Record<string, number> }> {
    this.calls += 1
    if (signal.aborted) throw new DOMException('cancelled', 'AbortError')
    return { bellInvariant: true, shotsRequested: limits.shots, shotsReturned: limits.shots, outcomeCounts: { '[Zero, Zero]': limits.shots } }
  }
}

async function evaluated(services: QcgServices, artifact = 'simulate-first', target: 'local_simulator' | 'external_unspecified' = 'local_simulator') {
  const inspection = await services.inspect({ artifact_id: artifact })
  return services.evaluate({
    inspection_id: inspection.inspection_id,
    scientific_intent: 'Verify the safest deterministic next action.',
    requested_limits: { shots: 16, timeout_ms: 2_000, max_qubits: 2, target }
  })
}

describe('QCG service contract', () => {
  it('rejects invalid and additional input fields', async () => {
    const services = new QcgServices(new FakeSimulator())
    await expect(services.inspect({ artifact_id: 'simulate-first', ignored: true })).rejects.toThrow()
    await expect(services.inspect({ artifact_id: 'x' })).rejects.toThrow()
    const inspection = await services.inspect({ artifact_id: 'simulate-first' })
    await expect(services.evaluate({ inspection_id: inspection.inspection_id, scientific_intent: 'A valid scientific question.', requested_limits: { shots: 16, timeout_ms: 2000, max_qubits: 2, target: 'local_simulator', ignored: true } })).rejects.toThrow()
  })

  it('never invokes the simulator for non-simulate branches', async () => {
    const simulator = new FakeSimulator()
    const services = new QcgServices(simulator)
    const evaluation = await evaluated(services, 'reject-incompatible')
    await expect(services.simulate({ decision_id: evaluation.decision_id }, new AbortController().signal)).rejects.toThrow('simulate_first')
    expect(simulator.calls).toBe(0)
  })

  it('requires visible consent and records a Bell invariant only after simulation', async () => {
    const simulator = new FakeSimulator()
    const services = new QcgServices(simulator)
    const evaluation = await evaluated(services)
    await expect(services.simulate({ decision_id: evaluation.decision_id }, new AbortController().signal)).rejects.toThrow('consent')
    services.grantConsent()
    const evidence = await services.simulate({ decision_id: evaluation.decision_id }, new AbortController().signal)
    expect(evidence.bell_invariant).toBe(true)
    expect(simulator.calls).toBe(1)
    expect(services.snapshot().consent).toBe(false)
  })

  it('enforces decision expiry without a simulator call', async () => {
    let now = 1000
    const simulator = new FakeSimulator()
    const services = new QcgServices(simulator, () => now)
    const evaluation = await evaluated(services)
    services.grantConsent()
    now += 5 * 60_001
    await expect(services.simulate({ decision_id: evaluation.decision_id }, new AbortController().signal)).rejects.toThrow('expired')
    expect(simulator.calls).toBe(0)
  })

  it('records cancellation and does not create a run', async () => {
    const simulator: Simulator = { run: async () => { throw new DOMException('cancelled', 'AbortError') } }
    const services = new QcgServices(simulator)
    const evaluation = await evaluated(services)
    services.grantConsent()
    await expect(services.simulate({ decision_id: evaluation.decision_id }, new AbortController().signal)).rejects.toThrow('cancelled')
    expect(services.snapshot().phase).toBe('cancelled')
    expect(services.snapshot().evidence?.run_id).toBeUndefined()
  })

  it('exports bounded JSON and Markdown packets without raw code', async () => {
    const services = new QcgServices(new FakeSimulator())
    await evaluated(services, 'reuse-evidence')
    const evidencePacketId = services.snapshot().evidence!.evidence_packet_id
    const result = await services.exportPacket({ evidence_packet_id: evidencePacketId, format: 'markdown' })
    expect(result.content).toContain('WebMCP-QCG evidence')
    expect(result.content).not.toContain('operation Main')
  })

  it('returns all five deterministic decisions with zero external calls', async () => {
    const scenarios = [
      ['reuse-evidence', 'reuse_result'],
      ['reject-incompatible', 'reject'],
      ['recompile-required', 'recompile'],
      ['simulate-first', 'simulate_first'],
      ['external-ready', 'ready_for_external_execution']
    ] as const
    for (const [artifact, expected] of scenarios) {
      const services = new QcgServices(new FakeSimulator())
      const evaluation = await evaluated(services, artifact, artifact === 'external-ready' ? 'external_unspecified' : 'local_simulator')
      expect(evaluation.decision).toBe(expected)
      expect(evaluation.counters.external_provider_calls).toBe(0)
      expect(evaluation.counters.local_simulations).toBe(0)
    }
  })

  it('lets declared bounds falsify a card hypothesis', async () => {
    const services = new QcgServices(new FakeSimulator())
    const inspection = await services.inspect({ artifact_id: 'simulate-first' })
    const evaluation = await services.evaluate({
      inspection_id: inspection.inspection_id,
      scientific_intent: 'Test a Bell-pair experiment within a one-qubit bound.',
      requested_limits: { shots: 16, timeout_ms: 2000, max_qubits: 1, target: 'local_simulator' }
    })
    expect(evaluation.decision).toBe('reject')
    expect(evaluation.reason_codes).toEqual(['QUBIT_BOUND_TOO_LOW'])
  })
})
