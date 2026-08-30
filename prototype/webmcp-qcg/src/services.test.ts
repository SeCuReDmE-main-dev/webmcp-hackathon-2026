// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { convertV1Receipt, convertV2Receipt } from './migrations'
import { QcgServices, type ArtifactAnalyzer, type Simulator } from './services'

class FakeAnalyzer implements ArtifactAnalyzer {
  calls = 0
  async analyze(source: string) {
    this.calls += 1
    const valid = source.includes('ResetAll') || source.includes('OPENQASM 3.0')
    return {
      valid,
      diagnosticCount: valid ? 0 : 1,
      diagnostics: valid ? [] : ['Q# compiler reported 1 bounded diagnostic.']
    }
  }
}

class FakeSimulator implements Simulator {
  calls = 0
  formats: string[] = []
  async run(signal: AbortSignal, limits: { shots: number }, source: string, format: 'qsharp' | 'openqasm3') {
    this.calls += 1
    this.formats.push(format)
    if (signal.aborted) throw new DOMException('cancelled', 'AbortError')
    expect(source).toMatch(/operation Main|OPENQASM 3.0/)
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

  it('requires an explicit supported profile and rejects URLs, notebooks and foreign extensions', async () => {
    const qcg = services()
    const content = new TextEncoder().encode('OPENQASM 3.0;')
    await expect(qcg.importQuantumFile('notebook.ipynb', content, 'qiskit-python')).rejects.toThrow('does not accept')
    await expect(qcg.importQuantumFile('program.qs', new TextEncoder().encode('https://example.invalid'), 'qsharp-qdk')).rejects.toThrow('URLs')
    await expect(qcg.importQuantumFile('circuit.py', content, 'qiskit-python')).resolves.toMatchObject({
      artifact_profile: 'qiskit-python', capabilities: { static_only: true, simulate: false }
    })
  })

  it('keeps static Python, C++ and QIR profiles inspection-only', async () => {
    for (const [fileName, profileId] of [
      ['circuit.py', 'qiskit-python'], ['kernel.cpp', 'cudaq-cpp'], ['program.ll', 'qir-text']
    ] as const) {
      const qcg = services()
      const manifest = await qcg.importQuantumFile(fileName, new TextEncoder().encode('bounded static text'), profileId)
      await qcg.inspect({ artifact_id: manifest.artifact_id })
      const recommendation = await qcg.evaluate({
        manifest_id: manifest.manifest_id, target_profile_id: 'qsharp-local-wasm-1310',
        scientific_intent: 'Inspect a declared static profile without execution.', observable: 'static_structure', parameters: {},
        requested_limits: { shots: 8, timeout_ms: 1000, max_qubits: 2, target: 'local_simulator' }
      })
      expect(recommendation.decision).toBe('reject')
      expect(recommendation.reason_codes).toContain('STATIC_INSPECTION_ONLY')
    }
  })

  it('routes the published OpenQASM Bell fixture through the bounded local simulation contract', async () => {
    const simulator = new FakeSimulator()
    const qcg = new QcgServices(simulator, Date.now, new FakeAnalyzer())
    const manifest = await qcg.loadOpenQasmBellFixture()
    await qcg.inspect({ artifact_id: manifest.artifact_id })
    const recommendation = await qcg.evaluate({
      manifest_id: manifest.manifest_id, target_profile_id: 'qsharp-local-wasm-1310',
      scientific_intent: 'Measure the OpenQASM Bell correlation with bounded local QDK evidence.', observable: 'bell_correlation', parameters: {},
      requested_limits: { shots: 16, timeout_ms: 2000, max_qubits: 2, target: 'local_simulator' }
    })
    expect(recommendation.decision).toBe('simulate_first')
    await qcg.decide({ recommendation_id: recommendation.recommendation_id, choice: 'accepted', justification: 'I approve one bounded OpenQASM local simulation.' })
    await expect(qcg.simulate({ recommendation_id: recommendation.recommendation_id }, new AbortController().signal)).resolves.toMatchObject({
      schema_version: 'webmcp-qcg.evidence-receipt.v3', format: 'openqasm3'
    })
    expect(simulator.formats).toEqual(['openqasm3'])
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
    expect(json.content).toContain('webmcp-qcg.evidence-receipt.v3')
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
    expect(converted?.schema_version).toBe('webmcp-qcg.evidence-receipt.v3')
    expect(converted?.recommendation.valid).toBe(false)
    expect(converted?.migration?.from).toBe('webmcp.qcg.evidence.v1')
    expect(legacy).not.toHaveProperty('migration')
  })

  it('reads a v2 receipt as v3 in memory without changing its legacy source object', async () => {
    const v2 = {
      schema_version: 'webmcp-qcg.evidence-receipt.v2', receipt_id: 'receipt-v2',
      manifest: {
        schema_version: 'webmcp-qcg.artifact-manifest.v2', manifest_id: 'manifest-v2', artifact_id: 'artifact-v2',
        file_name: 'bell.qs', artifact_digest: 'b'.repeat(64), byte_size: 12, format: 'qsharp', provenance: 'demo_fixture',
        compiler: { name: 'qsharp-lang', version: '1.31.0', status: 'compiled', diagnostic_count: 0, diagnostics: [], profile_digest: 'qdk', bounded_entrypoint: true, estimated_qubits: 2 }, created_at: '2026-08-28T12:00:00.000Z'
      },
      target_profile: { schema_version: 'webmcp-qcg.target-profile.v2', profile_id: 'qsharp-local-wasm-1310', label: 'Local', source: 'test', source_digest: 'c'.repeat(64), captured_at: '2026-08-28T12:00:00.000Z', expires_at: '2026-09-01T12:00:00.000Z', evidence_state: 'known', execution_surface: 'local_wasm', max_qubits: 8, compiler_profile_digest: 'qdk', submission_enabled: false },
      recommendation: { schema_version: 'webmcp-qcg.recommendation.v2', recommendation_id: 'recommendation-v2', manifest_id: 'manifest-v2', target_profile_id: 'qsharp-local-wasm-1310', decision: 'simulate_first', reason_codes: [], unknowns: [], confidence: 'high', safer_alternative: 'Review.', scientific_intent: 'Preserve v2 receipt readability.', observable: 'bell', parameters_digest: 'd'.repeat(64), requested_limits: { shots: 1, timeout_ms: 500, max_qubits: 1, target: 'local_simulator' }, reuse_key: 'e'.repeat(64), expires_at: '2026-08-28T12:05:00.000Z', valid: false },
      human_decision: null, simulation: null,
      effects: { inspections: 1, evaluations: 1, local_simulations: 0, metadata_validations: 1, qpu_submissions: 0, evidence_exports: 0 },
      digest: 'f'.repeat(64), created_at: '2026-08-28T12:00:00.000Z', updated_at: '2026-08-28T12:00:00.000Z'
    }
    const converted = await convertV2Receipt(v2)
    expect(converted).toMatchObject({ schema_version: 'webmcp-qcg.evidence-receipt.v3', artifact_profile: { id: 'qsharp-qdk' } })
    expect(v2.schema_version).toBe('webmcp-qcg.evidence-receipt.v2')
    expect(v2.manifest).not.toHaveProperty('artifact_profile')
  })
})
