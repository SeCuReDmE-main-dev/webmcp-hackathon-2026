// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { convertV1Receipt } from './migrations'
import { QcgServices, type ArtifactAnalyzer, type Simulator } from './services'

class FakeAnalyzer implements ArtifactAnalyzer {
  calls = 0
  async analyze(source: string) {
    this.calls += 1
    const valid = source.includes('ResetAll')
    return {
      valid,
      diagnosticCount: valid ? 0 : 1,
      diagnostics: valid ? [] : ['Q# compiler reported 1 bounded diagnostic.']
    }
  }
}

class FakeSimulator implements Simulator {
  calls = 0
  async run(signal: AbortSignal, limits: { shots: number }, source: string) {
    this.calls += 1
    if (signal.aborted) throw new DOMException('cancelled', 'AbortError')
    expect(source).toContain('operation Main')
    return {
      bellInvariant: true,
      shotsRequested: limits.shots,
      shotsReturned: limits.shots,
      outcomeCounts: { '[Zero, Zero]': limits.shots }
    }
  }
}

async function evaluated(
  services: QcgServices,
  cardId = 'simulate-first'
) {
  const { manifest, card } = await services.loadDemoArtifact(cardId)
  const inspected = await services.inspect({ artifact_id: manifest.artifact_id })
  const recommendation = await services.evaluate({
    manifest_id: inspected.manifest_id,
    target_profile_id: card.profileId,
    scientific_intent: card.scientificIntent,
    observable: card.observable,
    parameters: {},
    requested_limits: card.requestedLimits
  })
  return { manifest, card, recommendation }
}

function services(now: () => number = Date.now) {
  return new QcgServices(new FakeSimulator(), now, new FakeAnalyzer())
}

describe('QCG v2 service contract', () => {
  it('hashes exact file bytes and changes the manifest when one byte changes', async () => {
    const first = services()
    const source = new TextEncoder().encode('namespace Qcg { @EntryPoint() operation Main() : Result[] { use q = Qubit(); Reset(q); return []; } }')
    const manifestA = await first.importQsharpFile('experiment.qs', source)
    const changed = new Uint8Array([...source, 10])
    const manifestB = await first.importQsharpFile('experiment.qs', changed)
    expect(manifestA.artifact_digest).toMatch(/^[a-f0-9]{64}$/)
    expect(manifestA.artifact_digest).not.toBe(manifestB.artifact_digest)
  })

  it('rejects empty, oversized, wrongly named and invalid UTF-8 artifacts', async () => {
    const qcg = services()
    await expect(qcg.importQsharpFile('empty.qs', new Uint8Array())).rejects.toThrow('empty')
    await expect(qcg.importQsharpFile('program.txt', new Uint8Array([65]))).rejects.toThrow('.qs')
    await expect(qcg.importQsharpFile('large.qs', new Uint8Array(131_073))).rejects.toThrow('128 KiB')
    await expect(qcg.importQsharpFile('bad.qs', new Uint8Array([0xff]))).rejects.toThrow('UTF-8')
  })

  it('rejects unknown properties at every public input boundary', async () => {
    const qcg = services()
    const { manifest } = await qcg.loadDemoArtifact('simulate-first')
    await expect(qcg.inspect({ artifact_id: manifest.artifact_id, ignored: true })).rejects.toThrow()
    const inspected = await qcg.inspect({ artifact_id: manifest.artifact_id })
    await expect(qcg.evaluate({
      manifest_id: inspected.manifest_id,
      target_profile_id: 'qsharp-local-wasm-1310',
      scientific_intent: 'Verify the bounded Bell correlation locally.',
      observable: 'bell_correlation',
      parameters: {},
      requested_limits: { shots: 16, timeout_ms: 2000, max_qubits: 2, target: 'local_simulator', ignored: true }
    })).rejects.toThrow()
  })

  it('returns all five decisions from evidence relationships with zero QPU submissions', async () => {
    const scenarios = [
      ['reuse-evidence', 'reuse_result'],
      ['reject-incompatible', 'reject'],
      ['recompile-required', 'recompile'],
      ['simulate-first', 'simulate_first'],
      ['external-ready', 'ready_for_external_execution']
    ] as const
    for (const [cardId, expected] of scenarios) {
      const qcg = services()
      const { recommendation } = await evaluated(qcg, cardId)
      expect(recommendation.decision).toBe(expected)
      expect(qcg.snapshot().effects.qpu_submissions).toBe(0)
      expect(qcg.snapshot().effects.local_simulations).toBe(0)
    }
  })

  it('reuses only an exact evidence key and simulates a near match first', async () => {
    const qcg = services()
    const { manifest, card, recommendation } = await evaluated(qcg, 'reuse-evidence')
    expect(recommendation.decision).toBe('reuse_result')
    const nearMatch = await qcg.evaluate({
      manifest_id: manifest.manifest_id,
      target_profile_id: card.profileId,
      scientific_intent: card.scientificIntent,
      observable: 'bell_correlation_with_changed_scope',
      parameters: {},
      requested_limits: card.requestedLimits
    })
    expect(nearMatch.decision).toBe('simulate_first')
    expect(nearMatch.reuse_key).not.toBe(recommendation.reuse_key)
  })

  it('never reports ready when the target evidence is unknown or stale', async () => {
    const unknown = services()
    const { manifest, card } = await unknown.loadDemoArtifact('external-ready')
    await unknown.inspect({ artifact_id: manifest.artifact_id })
    const unknownTarget = await unknown.evaluate({
      manifest_id: manifest.manifest_id,
      target_profile_id: 'missing-target-profile',
      scientific_intent: card.scientificIntent,
      observable: card.observable,
      parameters: {},
      requested_limits: card.requestedLimits
    })
    expect(unknownTarget.decision).toBe('reject')
    expect(unknownTarget.reason_codes).toContain('TARGET_PROFILE_UNKNOWN')

    const stale = services(() => Date.parse('2026-09-04T20:00:00Z'))
    const staleResult = await evaluated(stale, 'external-ready')
    expect(staleResult.recommendation.decision).toBe('reject')
    expect(staleResult.recommendation.reason_codes).toContain('TARGET_PROFILE_STALE')
  })

  it('never invokes the simulator for a non-simulate recommendation', async () => {
    const simulator = new FakeSimulator()
    const qcg = new QcgServices(simulator, Date.now, new FakeAnalyzer())
    const { recommendation } = await evaluated(qcg, 'reject-incompatible')
    await qcg.decide({ recommendation_id: recommendation.recommendation_id, choice: 'accepted', justification: '' })
    await expect(qcg.simulate({
      recommendation_id: recommendation.recommendation_id
    }, new AbortController().signal)).rejects.toThrow('simulate_first')
    expect(simulator.calls).toBe(0)
  })

  it('records accepted, deferred and justified overridden human choices', async () => {
    const accepted = services()
    const first = await evaluated(accepted)
    const decision = await accepted.decide({
      recommendation_id: first.recommendation.recommendation_id,
      choice: 'accepted',
      justification: 'I reviewed the local-only boundary.'
    })
    expect(decision.choice).toBe('accepted')
    expect(accepted.snapshot().consent?.used).toBe(false)

    const deferred = services()
    const second = await evaluated(deferred)
    expect((await deferred.decide({
      recommendation_id: second.recommendation.recommendation_id,
      choice: 'deferred',
      justification: 'I want to inspect the target profile again.'
    })).choice).toBe('deferred')

    const overridden = services()
    const third = await evaluated(overridden)
    await expect(overridden.decide({
      recommendation_id: third.recommendation.recommendation_id,
      choice: 'overridden',
      justification: 'short'
    })).rejects.toThrow('12 characters')
    expect((await overridden.decide({
      recommendation_id: third.recommendation.recommendation_id,
      choice: 'overridden',
      justification: 'I accept the documented risk and keep execution disabled.'
    })).override).toBe(true)
  })

  it('consumes one-time consent and refuses replay', async () => {
    const simulator = new FakeSimulator()
    const qcg = new QcgServices(simulator, Date.now, new FakeAnalyzer())
    const { recommendation } = await evaluated(qcg)
    await qcg.decide({
      recommendation_id: recommendation.recommendation_id,
      choice: 'accepted',
      justification: 'I approve one bounded local simulation.'
    })
    const receipt = await qcg.simulate({
      recommendation_id: recommendation.recommendation_id
    }, new AbortController().signal)
    expect(receipt.simulation?.bell_invariant).toBe(true)
    expect(receipt.effects.qpu_submissions).toBe(0)
    await expect(qcg.simulate({
      recommendation_id: recommendation.recommendation_id
    }, new AbortController().signal)).rejects.toThrow('unused human consent')
    expect(simulator.calls).toBe(1)
    expect(qcg.snapshot().authority_state).toBe('consumed')
  })

  it('models consent-required, authorized and revoked as separate authority states', async () => {
    const simulator = new FakeSimulator()
    const qcg = new QcgServices(simulator, Date.now, new FakeAnalyzer())
    const { recommendation } = await evaluated(qcg)
    expect(qcg.snapshot().authority_state).toBe('consent_required')
    await qcg.decide({
      recommendation_id: recommendation.recommendation_id,
      choice: 'accepted',
      justification: 'I approve one bounded local simulation.'
    })
    expect(qcg.snapshot().authority_state).toBe('authorized')
    qcg.revokeConsent()
    expect(qcg.snapshot().authority_state).toBe('revoked')
    await expect(qcg.simulate({
      recommendation_id: recommendation.recommendation_id
    }, new AbortController().signal)).rejects.toThrow('unused human consent')
    expect(simulator.calls).toBe(0)
  })

  it('refuses expired recommendations and consent without a simulator call', async () => {
    let now = Date.parse('2026-08-29T12:00:00-04:00')
    const simulator = new FakeSimulator()
    const qcg = new QcgServices(simulator, () => now, new FakeAnalyzer())
    const { recommendation } = await evaluated(qcg)
    await qcg.decide({
      recommendation_id: recommendation.recommendation_id,
      choice: 'accepted',
      justification: 'I approve one bounded local simulation.'
    })
    now += 5 * 60_001
    expect(qcg.snapshot().authority_state).toBe('expired')
    await expect(qcg.simulate({
      recommendation_id: recommendation.recommendation_id
    }, new AbortController().signal)).rejects.toThrow('expired')
    expect(simulator.calls).toBe(0)
  })

  it('records cancellation, consumes consent and creates no simulation evidence', async () => {
    const simulator: Simulator = {
      run: async () => { throw new DOMException('cancelled', 'AbortError') }
    }
    const qcg = new QcgServices(simulator, Date.now, new FakeAnalyzer())
    const { recommendation } = await evaluated(qcg)
    await qcg.decide({
      recommendation_id: recommendation.recommendation_id,
      choice: 'accepted',
      justification: 'I approve one bounded local simulation.'
    })
    await expect(qcg.simulate({
      recommendation_id: recommendation.recommendation_id
    }, new AbortController().signal)).rejects.toThrow('cancelled')
    expect(qcg.snapshot().phase).toBe('cancelled')
    expect(qcg.snapshot().receipt?.simulation).toBeNull()
    expect(qcg.snapshot().consent?.used).toBe(true)
  })

  it('exports v2 JSON and Markdown without raw Q# or private paths', async () => {
    const qcg = services()
    await evaluated(qcg, 'reuse-evidence')
    const receiptId = qcg.snapshot().receipt!.receipt_id
    const markdown = await qcg.exportPacket({ receipt_id: receiptId, format: 'markdown' })
    const json = await qcg.exportPacket({ receipt_id: receiptId, format: 'json' })
    expect(markdown.content).toContain('WebMCP-QCG evidence receipt')
    expect(json.content).toContain('webmcp-qcg.evidence-receipt.v2')
    expect(json.content).not.toContain('operation Main')
    expect(json.content).not.toMatch(/[A-Z]:\\/)
  })

  it('converts v1 evidence without modifying or overstating historical facts', async () => {
    const legacy = {
      schema_version: 'webmcp.qcg.evidence.v1',
      inspection: { artifact_id: 'legacy-bell', artifact_digest: 'a'.repeat(64), created_at: '2026-08-28T12:00:00.000Z' },
      evaluation: { decision_id: 'decision-legacy', decision: 'simulate_first', reason_codes: ['LOCAL_SIMULATION_REQUIRED'], scientific_intent: 'Preserve the historical decision.', expires_at: '2026-08-28T12:05:00.000Z' },
      evidence: { evidence_packet_id: 'evidence-legacy', created_at: '2026-08-28T12:00:00.000Z' }
    }
    const converted = await convertV1Receipt(legacy)
    expect(converted?.schema_version).toBe('webmcp-qcg.evidence-receipt.v2')
    expect(converted?.recommendation.valid).toBe(false)
    expect(converted?.migration?.from).toBe('webmcp.qcg.evidence.v1')
    expect(legacy).not.toHaveProperty('migration')
  })
})
