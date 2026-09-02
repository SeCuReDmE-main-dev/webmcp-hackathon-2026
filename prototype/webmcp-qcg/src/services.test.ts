// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { bellOpenQasmProgram, findDemoCard } from './catalog'
import { manifestOutput } from './contracts'
import { convertV1Receipt, convertV2Receipt } from './migrations'
import { QcgServices, type ArtifactAnalyzer, type Simulator } from './services'
import { EXTERNAL_PROFILE_ID, LOCAL_PROFILE_ID, snapshotTargetProfile } from './targetProfiles'

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
  it('keeps both frozen target profiles current through the announced judging window', async () => {
    const afterJudging = Date.parse('2026-09-23T22:00:00Z')
    await expect(snapshotTargetProfile(LOCAL_PROFILE_ID, afterJudging)).resolves.toMatchObject({ evidence_state: 'known', submission_enabled: false })
    await expect(snapshotTargetProfile(EXTERNAL_PROFILE_ID, afterJudging)).resolves.toMatchObject({ evidence_state: 'known', submission_enabled: false })
  })

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

  it('returns static inspection evidence through the strict WebMCP manifest output contract', async () => {
    const qcg = services()
    const manifest = await qcg.importQuantumFile(
      'circuit.py',
      new TextEncoder().encode('from qiskit import QuantumCircuit\ncircuit = QuantumCircuit(2)'),
      'qiskit-python'
    )
    const inspected = await qcg.inspect({ artifact_id: manifest.artifact_id }, 'webmcp')
    expect(manifestOutput.parse(inspected)).toMatchObject({
      artifact_profile: 'qiskit-python',
      compiler: { name: 'qcg-static-inspector', version: '1.0.0', status: 'unverified' }
    })
    expect(() => manifestOutput.parse({
      ...inspected,
      compiler: { ...inspected.compiler, version: '1.31.0' }
    })).toThrow()
  })

  it('keeps a nine-or-more-qubit artifact inspectable before deterministic rejection', async () => {
    const qcg = services()
    const allocations = Array.from({ length: 9 }, (_, index) => `    use q${index} = Qubit();`).join('\n')
    const qubits = Array.from({ length: 9 }, (_, index) => `q${index}`).join(', ')
    const source = `namespace Qcg.Bounds {\n  open Microsoft.Quantum.Intrinsic;\n  @EntryPoint()\n  operation Main() : Result[] {\n${allocations}\n    ResetAll([${qubits}]);\n    return [];\n  }\n}`
    const manifest = await qcg.importQuantumFile('over-bound.qs', new TextEncoder().encode(source), 'qsharp-qdk')
    const inspected = await qcg.inspect({ artifact_id: manifest.artifact_id }, 'webmcp')
    expect(manifestOutput.parse(inspected).compiler.estimated_qubits).toBe(9)
    const recommendation = await qcg.evaluate({
      manifest_id: inspected.manifest_id,
      target_profile_id: 'qsharp-local-wasm-1310',
      scientific_intent: 'Inspect an intentionally over-bound Q# artifact without executing it.',
      observable: 'resource_bound',
      parameters: {},
      requested_limits: { shots: 16, timeout_ms: 2000, max_qubits: 8, target: 'local_simulator' }
    })
    expect(recommendation).toMatchObject({ decision: 'reject', reason_codes: ['QUBIT_BOUND_EXCEEDED'] })
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

  it('recognizes the public OpenQASM fixture when blank lines and line endings differ', async () => {
    const simulator = new FakeSimulator()
    const qcg = new QcgServices(simulator, Date.now, new FakeAnalyzer())
    const publicFixture = bellOpenQasmProgram
      .replace(/\n/g, '\r\n')
      .replace('include "stdgates.inc";\r\n', 'include "stdgates.inc";\r\n\r\n')
    const manifest = await qcg.importOpenQasmFile(
      'qcg-bell-sample.qasm',
      new TextEncoder().encode(publicFixture)
    )
    await qcg.inspect({ artifact_id: manifest.artifact_id })
    const recommendation = await qcg.evaluate({
      manifest_id: manifest.manifest_id,
      target_profile_id: 'qsharp-local-wasm-1310',
      scientific_intent: 'Measure the public OpenQASM Bell fixture with bounded local evidence.',
      observable: 'bell_correlation',
      parameters: {},
      requested_limits: { shots: 16, timeout_ms: 2000, max_qubits: 2, target: 'local_simulator' }
    })
    expect(recommendation.decision).toBe('simulate_first')
  })

  it('does not infer fixture provenance from a modified OpenQASM Bell-looking program', async () => {
    const qcg = new QcgServices(new FakeSimulator(), Date.now, new FakeAnalyzer())
    const modified = `${bellOpenQasmProgram}\nx q[0];`
    const manifest = await qcg.importOpenQasmFile('modified-bell.qasm', new TextEncoder().encode(modified))
    await qcg.inspect({ artifact_id: manifest.artifact_id })
    const recommendation = await qcg.evaluate({
      manifest_id: manifest.manifest_id, target_profile_id: 'qsharp-local-wasm-1310',
      scientific_intent: 'Verify that a modified Bell-looking program remains inspection-only.', observable: 'bell_correlation', parameters: {},
      requested_limits: { shots: 16, timeout_ms: 2000, max_qubits: 2, target: 'local_simulator' }
    })
    expect(recommendation).toMatchObject({ decision: 'recompile', reason_codes: ['BOUNDED_BELL_FIXTURE_REQUIRED'] })
    expect(findDemoCard('simulate-first-untrusted-suffix')).toBeUndefined()
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

  it('generates distinct recommendation identifiers for repeated evaluations in the same millisecond', async () => {
    const fixedNow = () => Date.parse('2026-08-29T12:00:00-04:00')
    const qcg = services(fixedNow)
    const first = await evaluated(qcg)
    const second = await qcg.evaluate({
      manifest_id: first.manifest.manifest_id,
      target_profile_id: first.card.profileId,
      scientific_intent: first.card.scientificIntent,
      observable: first.card.observable,
      parameters: {},
      requested_limits: first.card.requestedLimits
    })
    expect(first.recommendation.recommendation_id).not.toBe(second.recommendation_id)
    expect(first.recommendation.recommendation_id).toMatch(/^recommendation-[a-z0-9]{3,49}$/)
    expect(second.recommendation_id).toMatch(/^recommendation-[a-z0-9]{3,49}$/)
  })

  it('rejects a requested target that disagrees with the frozen profile execution surface', async () => {
    const local = services()
    const localCard = await local.loadDemoArtifact('simulate-first')
    await local.inspect({ artifact_id: localCard.manifest.artifact_id })
    const localMismatch = await local.evaluate({
      manifest_id: localCard.manifest.manifest_id,
      target_profile_id: localCard.card.profileId,
      scientific_intent: localCard.card.scientificIntent,
      observable: localCard.card.observable,
      parameters: {},
      requested_limits: { ...localCard.card.requestedLimits, target: 'external_reference' }
    })
    expect(localMismatch).toMatchObject({
      decision: 'reject',
      reason_codes: ['TARGET_EXECUTION_SURFACE_MISMATCH'],
      unknowns: []
    })

    const external = services()
    const externalCard = await external.loadDemoArtifact('external-ready')
    await external.inspect({ artifact_id: externalCard.manifest.artifact_id })
    const externalMismatch = await external.evaluate({
      manifest_id: externalCard.manifest.manifest_id,
      target_profile_id: externalCard.card.profileId,
      scientific_intent: externalCard.card.scientificIntent,
      observable: externalCard.card.observable,
      parameters: {},
      requested_limits: { ...externalCard.card.requestedLimits, target: 'local_simulator' }
    })
    expect(externalMismatch).toMatchObject({
      decision: 'reject',
      reason_codes: ['TARGET_EXECUTION_SURFACE_MISMATCH'],
      unknowns: []
    })
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

    const stale = services(() => Date.parse('2026-10-01T20:00:00Z'))
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

  it('commits exactly one decision when two surfaces decide concurrently', async () => {
    const qcg = services()
    const { recommendation } = await evaluated(qcg)
    const input = {
      recommendation_id: recommendation.recommendation_id,
      choice: 'accepted' as const,
      justification: 'I approve one bounded local simulation.'
    }
    const outcomes = await Promise.allSettled([qcg.decide(input), qcg.decide(input)])
    expect(outcomes.filter((outcome) => outcome.status === 'fulfilled')).toHaveLength(1)
    expect(outcomes.filter((outcome) => outcome.status === 'rejected')).toHaveLength(1)
    expect(qcg.snapshot().humanDecision?.recommendation_id).toBe(recommendation.recommendation_id)
    expect(qcg.snapshot().consent).toMatchObject({
      recommendation_id: recommendation.recommendation_id,
      used: false
    })
    expect(qcg.snapshot().invocations.filter((event) => event.summary.startsWith('Human choice recorded:'))).toHaveLength(1)
  })

  it('does not attach an old decision or consent when state changes during receipt generation', async () => {
    const qcg = services()
    const { recommendation } = await evaluated(qcg)
    const originalDigest = crypto.subtle.digest.bind(crypto.subtle)
    let releaseDigest: () => void = () => {}
    let markStarted: () => void = () => {}
    const digestBlocked = new Promise<void>((resolve) => { releaseDigest = resolve })
    const digestStarted = new Promise<void>((resolve) => { markStarted = resolve })
    const digestSpy = vi.spyOn(crypto.subtle, 'digest').mockImplementationOnce(async (algorithm, data) => {
      markStarted()
      await digestBlocked
      return originalDigest(algorithm, data)
    })
    try {
      const pending = qcg.decide({
        recommendation_id: recommendation.recommendation_id,
        choice: 'accepted',
        justification: 'I approve one bounded local simulation.'
      })
      await digestStarted
      qcg.reset()
      releaseDigest()
      await expect(pending).rejects.toThrow('changed before the human decision')
      expect(qcg.snapshot()).toMatchObject({ phase: 'empty', authority_state: 'ready' })
      expect(qcg.snapshot().humanDecision).toBeUndefined()
      expect(qcg.snapshot().consent).toBeUndefined()
      expect(qcg.snapshot().receipt).toBeUndefined()
    } finally {
      releaseDigest()
      digestSpy.mockRestore()
    }
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
    await expect(qcg.decide({
      recommendation_id: recommendation.recommendation_id,
      choice: 'accepted',
      justification: 'I am attempting to create a second consent.'
    })).rejects.toThrow('already has a human decision')
    expect(simulator.calls).toBe(1)
    expect(qcg.snapshot().authority_state).toBe('consumed')
  })

  it('consumes consent synchronously when simulate calls race without serializing the Worker runtime', async () => {
    let releaseRun: (() => void) | undefined
    const workerStarted = new Promise<void>((resolve) => { releaseRun = resolve })
    let completeWorker: (() => void) | undefined
    const workerCompletes = new Promise<void>((resolve) => { completeWorker = resolve })
    const simulator: Simulator = {
      run: async (_signal, limits) => {
        releaseRun!()
        await workerCompletes
        return { bellInvariant: true, shotsRequested: limits.shots, shotsReturned: limits.shots, outcomeCounts: { '[Zero, Zero]': limits.shots } }
      }
    }
    const qcg = new QcgServices(simulator, Date.now, new FakeAnalyzer())
    const { recommendation } = await evaluated(qcg)
    await qcg.decide({ recommendation_id: recommendation.recommendation_id, choice: 'accepted', justification: 'I approve one bounded local simulation.' })
    const first = qcg.simulate({ recommendation_id: recommendation.recommendation_id }, new AbortController().signal)
    await workerStarted
    const second = qcg.simulate({ recommendation_id: recommendation.recommendation_id }, new AbortController().signal)
    await expect(second).rejects.toThrow('unused human consent')
    completeWorker!()
    await expect(first).resolves.toMatchObject({ simulation: { bell_invariant: true } })
    expect(qcg.snapshot().effects.local_simulations).toBe(1)
  })

  it.each([
    ['a false Bell invariant', { bellInvariant: false, shotsRequested: 64, shotsReturned: 64, outcomeCounts: { '[Zero, Zero]': 64 } }],
    ['an incomplete shot set', { bellInvariant: true, shotsRequested: 64, shotsReturned: 63, outcomeCounts: { '[Zero, Zero]': 63 } }],
    ['inconsistent outcome counts', { bellInvariant: true, shotsRequested: 64, shotsReturned: 64, outcomeCounts: { '[Zero, Zero]': 63 } }]
  ])('rejects %s without recording simulation or reusable evidence', async (_label, malformedResult) => {
    const simulator: Simulator = { run: async () => malformedResult }
    const qcg = new QcgServices(simulator, Date.now, new FakeAnalyzer())
    const { manifest, card, recommendation } = await evaluated(qcg)
    await qcg.decide({
      recommendation_id: recommendation.recommendation_id,
      choice: 'accepted',
      justification: 'I approve one bounded local simulation.'
    })
    await expect(qcg.simulate({
      recommendation_id: recommendation.recommendation_id
    }, new AbortController().signal)).rejects.toThrow('simulation evidence rejected')
    expect(qcg.snapshot()).toMatchObject({
      phase: 'error',
      authority_state: 'consumed',
      receipt: { simulation: null },
      effects: { local_simulations: 1 }
    })
    expect(qcg.snapshot().invocations[0]).toMatchObject({
      tool: 'run_bounded_local_simulation', status: 'error'
    })

    const followUp = await qcg.evaluate({
      manifest_id: manifest.manifest_id,
      target_profile_id: card.profileId,
      scientific_intent: card.scientificIntent,
      observable: card.observable,
      parameters: {},
      requested_limits: card.requestedLimits
    })
    expect(followUp.decision).toBe('simulate_first')
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

  it.each([
    ['accepted', 'Accepted after visible review.'],
    ['deferred', 'Deferred after visible review.'],
    ['overridden', 'I override after reviewing the bounded evidence.']
  ] as const)('exports complete Markdown human-decision provenance for %s choices', async (choice, justification) => {
    const qcg = services()
    const { recommendation } = await evaluated(qcg)
    const decision = await qcg.decide({ recommendation_id: recommendation.recommendation_id, choice, justification })
    const markdown = await qcg.exportPacket({ receipt_id: qcg.snapshot().receipt!.receipt_id, format: 'markdown' })
    expect(markdown.content).toContain(`Human choice: ${choice}`)
    expect(markdown.content).toContain(`Human decision ID: ${decision.human_decision_id}`)
    expect(markdown.content).toContain(`Human justification: ${decision.justification}`)
    expect(markdown.content).toContain(`Human decision timestamp: ${decision.decided_at}`)
  })

  it('serializes concurrent exports without losing effect-counter increments', async () => {
    const qcg = services()
    await evaluated(qcg, 'reuse-evidence')
    const receiptId = qcg.snapshot().receipt!.receipt_id
    const [json, markdown] = await Promise.all([
      qcg.exportPacket({ receipt_id: receiptId, format: 'json' }),
      qcg.exportPacket({ receipt_id: receiptId, format: 'markdown' })
    ])
    expect(json.export_id).not.toBe(markdown.export_id)
    expect(qcg.snapshot().effects.evidence_exports).toBe(2)
    expect(qcg.snapshot().invocations.filter((event) => event.tool === 'export_quantum_evidence_report')).toHaveLength(2)
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
