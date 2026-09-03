import { evaluateInput, exportInput, humanDecisionInput, inspectInput, simulationInput } from './contracts'
import { bellOpenQasmProgram, bellProgram, findDemoCard, type DemoCard } from './catalog'
import { digest, digestBytes, id } from './crypto'
import { getQuantumAdapter, profileSummary, staticCompilerEvidence, type QuantumAdapter } from './quantumAdapters'
import { LOCAL_PROFILE_ID, snapshotTargetProfile } from './targetProfiles'
import { WorkerArtifactAnalyzer, WorkerSimulator, type ArtifactAnalyzer, type Simulator, type SimulatorResult } from './workerClient'
import {
  initialState,
  type AgentRecommendation,
  type ArtifactManifest,
  type AuthorityState,
  type ConsentToken,
  type EffectCounters,
  type EvidenceReceipt,
  type HumanDecision,
  type Invocation,
  type QcgState,
  type RequestedLimits,
  type SimulationEvidence,
  type TargetProfileSnapshot,
  type QuantumProfileId
} from './types'

export type { ArtifactAnalyzer, Simulator, SimulatorResult } from './workerClient'

const MAX_ARTIFACT_BYTES = 131_072
const CONSENT_TTL_MS = 2 * 60_000
const RECOMMENDATION_TTL_MS = 5 * 60_000

interface ArtifactRecord {
  manifest: ArtifactManifest
  source: string
  bellFixture: boolean
  adapter: QuantumAdapter
}

interface RegisterOptions {
  provenance: ArtifactManifest['provenance']
  profileId: QuantumProfileId
  artifactPrefix?: string
  compiledProfileDigest?: string
}

interface SimulationLease {
  leaseId: string
  artifactId: string
  artifactDigest: string
  manifestId: string
  targetProfileId: string
  targetProfileDigest: string
  recommendationId: string
  humanDecisionId: string
  consentId: string
  receiptId: string
}

function clone<T>(value: T): T {
  return structuredClone(value)
}

function cleanFileName(name: string): string {
  const leaf = name.replace(/\\/g, '/').split('/').pop()?.trim() || 'experiment'
  return leaf.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 128)
}

function estimateQubits(source: string): number | null {
  const matches = source.match(/\bQubit\s*\(\s*\)/g)
  if (!matches) return null
  return Math.min(matches.length, 9)
}

function estimateOpenQasmQubits(source: string): number | null {
  const declaration = source.match(/qubit(?:\s*\[\s*(\d+)\s*\])?/i)
  if (!declaration) return null
  if (!declaration[1]) return 1
  const declared = Number(declaration[1])
  return Number.isSafeInteger(declared) && declared >= 0 ? Math.min(declared, 9) : 9
}

function isBoundedEntrypoint(source: string, qubits: number | null): boolean {
  return /@EntryPoint\s*\(\s*\)/.test(source) &&
    /operation\s+Main\s*\([^)]*\)\s*:\s*Result\s*\[\s*\]/.test(source) &&
    qubits !== null && qubits >= 1 && qubits <= 8
}

function isBoundedOpenQasmBell(source: string, qubits: number | null): boolean {
  return /OPENQASM\s+3(?:\.0)?\s*;/i.test(source) && /\bh\s+q\[0\]\s*;/i.test(source) &&
    /\bcx\s+q\[0\]\s*,\s*q\[1\]\s*;/i.test(source) && qubits === 2
}

function canonicalFixtureSource(source: string): string {
  return source
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0)
    .join('\n')
    .trim()
}

function simulationIntegrityError(result: SimulatorResult, requestedShots: number): string | undefined {
  if (!result.bellInvariant) return 'The bounded Bell invariant was not satisfied.'
  if (result.shotsRequested !== requestedShots) return 'The simulator changed the approved shot request.'
  if (result.shotsReturned !== requestedShots) return 'The simulator returned an incomplete shot set.'
  const counts = Object.values(result.outcomeCounts)
  if (counts.some((count) => !Number.isInteger(count) || count < 0)) {
    return 'The simulator returned invalid outcome counts.'
  }
  if (counts.reduce((total, count) => total + count, 0) !== requestedShots) {
    return 'The simulator outcome counts do not match the approved shot request.'
  }
  return undefined
}

export class QcgServices {
  private state: QcgState = initialState()
  private stateRevision = 0
  private mutationTail: Promise<void> = Promise.resolve()
  private activeSimulation?: SimulationLease
  private readonly artifacts = new Map<string, ArtifactRecord>()
  private readonly reusableKeys = new Set<string>()
  private readonly localValidationDigests = new Set<string>()

  constructor(
    private readonly simulator: Simulator = new WorkerSimulator(),
    private readonly now: () => number = Date.now,
    private readonly analyzer: ArtifactAnalyzer = new WorkerArtifactAnalyzer()
  ) {}

  authorityState(): AuthorityState {
    const consent = this.state.consent
    if (consent?.revoked_at) return 'revoked'
    if (consent?.used) return 'consumed'
    if (consent && new Date(consent.expires_at).getTime() <= this.now()) return 'expired'
    if (consent) return 'authorized'
    if (this.state.recommendation?.decision === 'simulate_first' && this.recommendationValid()) return 'consent_required'
    return 'ready'
  }

  snapshot(): QcgState { return clone({ ...this.state, authority_state: this.authorityState() }) }
  reset(): QcgState {
    this.state = initialState()
    this.stateRevision += 1
    return this.snapshot()
  }

  private serializeMutation<T>(operation: () => Promise<T>): Promise<T> {
    const run = this.mutationTail.then(operation)
    // Only the private queue tail is normalized so one rejection cannot deadlock
    // later mutations. The returned `run` still rejects for the original caller.
    this.mutationTail = run.then(() => undefined, () => undefined)
    return run
  }

  private simulationLeaseMatches(lease: SimulationLease): boolean {
    return Boolean(
      this.activeSimulation?.leaseId === lease.leaseId &&
      this.state.activeArtifactId === lease.artifactId &&
      this.state.manifest?.artifact_id === lease.artifactId &&
      this.state.manifest.manifest_id === lease.manifestId &&
      this.state.manifest.artifact_digest === lease.artifactDigest &&
      this.state.targetProfile?.profile_id === lease.targetProfileId &&
      this.state.targetProfile.source_digest === lease.targetProfileDigest &&
      this.state.recommendation?.recommendation_id === lease.recommendationId &&
      this.state.humanDecision?.human_decision_id === lease.humanDecisionId &&
      this.state.consent?.consent_id === lease.consentId &&
      this.state.consent.used === true &&
      this.state.receipt?.receipt_id === lease.receiptId
    )
  }

  private invocation(
    tool: Invocation['tool'],
    status: Invocation['status'],
    summary: string,
    source: Invocation['source']
  ): Invocation {
    return {
      id: crypto.randomUUID(),
      tool,
      status,
      summary,
      source,
      timestamp: new Date(this.now()).toISOString()
    }
  }

  private commit(
    patch: Partial<QcgState>,
    event: { tool: Invocation['tool']; status: Invocation['status']; summary: string; source: Invocation['source'] }
  ): void {
    this.state = {
      ...this.state,
      ...patch,
      invocations: [this.invocation(event.tool, event.status, event.summary, event.source), ...this.state.invocations].slice(0, 40)
    }
    this.stateRevision += 1
  }

  private async registerArtifact(
    fileName: string,
    bytes: Uint8Array,
    options: RegisterOptions
  ): Promise<ArtifactManifest> {
    if (bytes.byteLength < 1) throw new Error('The quantum artifact is empty.')
    if (bytes.byteLength > MAX_ARTIFACT_BYTES) throw new Error('The quantum artifact exceeds the 128 KiB local limit.')
    const safeName = cleanFileName(fileName)
    const adapter = getQuantumAdapter(options.profileId)
    if (!adapter) throw new Error('A supported quantum profile must be selected by the human.')
    if (!adapter.extensions.some((extension) => safeName.toLowerCase().endsWith(extension))) {
      throw new Error(`The selected ${adapter.id} profile does not accept this file extension (${adapter.extensions.join(', ')} required).`)
    }

    let source: string
    try {
      source = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    } catch {
      throw new Error('The quantum artifact must use valid UTF-8 encoding.')
    }
    if (source.includes('\0')) throw new Error('The quantum artifact contains an unsupported null byte.')
    if (/\b(?:https?|file|ftp):\/\//i.test(source)) throw new Error('URLs are not accepted in quantum artifacts.')

    const artifactDigest = await digestBytes(bytes)
    const profile = await snapshotTargetProfile(LOCAL_PROFILE_ID, this.now())
    let compiler = staticCompilerEvidence(adapter)
    if (adapter.executable) {
      let analysis
      try {
        analysis = await this.analyzer.analyze(source, adapter.format)
      } catch {
        analysis = { valid: false, diagnosticCount: 1, diagnostics: ['QDK compiler analysis could not complete within the local boundary.'] }
      }
      const qubits = adapter.format === 'openqasm3' ? estimateOpenQasmQubits(source) : estimateQubits(source)
      compiler = {
        name: 'qsharp-lang', version: '1.31.0', status: analysis.valid ? 'compiled' : 'invalid',
        diagnostic_count: analysis.diagnosticCount, diagnostics: analysis.diagnostics.slice(0, 4),
        profile_digest: options.compiledProfileDigest ?? profile.compiler_profile_digest,
        bounded_entrypoint: analysis.valid && (adapter.format === 'qsharp' ? isBoundedEntrypoint(source, qubits) : isBoundedOpenQasmBell(source, qubits)),
        estimated_qubits: qubits
      }
    }
    const artifactId = id(options.artifactPrefix ?? 'artifact', artifactDigest)
    const manifest: ArtifactManifest = {
      schema_version: 'webmcp-qcg.artifact-manifest.v2',
      manifest_id: id('manifest', artifactDigest),
      artifact_id: artifactId,
      file_name: safeName,
      artifact_digest: artifactDigest,
      byte_size: bytes.byteLength,
      format: adapter.format,
      artifact_profile: adapter.id,
      capabilities: adapter.capabilities,
      provenance: options.provenance,
      compiler: { ...compiler, profile_digest: options.compiledProfileDigest ?? compiler.profile_digest },
      created_at: new Date(this.now()).toISOString()
    }
    this.artifacts.set(artifactId, {
      manifest,
      source,
      bellFixture: canonicalFixtureSource(source) === canonicalFixtureSource(
        adapter.format === 'openqasm3' ? bellOpenQasmProgram : bellProgram
      ),
      adapter
    })
    this.commit(
      {
        phase: 'partial',
        activeArtifactId: artifactId,
        manifest,
        targetProfile: undefined,
        recommendation: undefined,
        humanDecision: undefined,
        consent: undefined,
        receipt: undefined,
        error: undefined
      },
      {
        tool: 'human',
        status: 'completed',
        summary: `${adapter.label} artifact inspected locally; byte digest ${artifactDigest.slice(0, 12)}…`,
        source: 'human'
      }
    )
    return clone(manifest)
  }

  async importQsharpFile(fileName: string, bytes: Uint8Array): Promise<ArtifactManifest> {
    return this.registerArtifact(fileName, bytes, { provenance: 'human_import', profileId: 'qsharp-qdk' })
  }

  async importQuantumFile(fileName: string, bytes: Uint8Array, profileId: QuantumProfileId): Promise<ArtifactManifest> {
    return this.registerArtifact(fileName, bytes, { provenance: 'human_import', profileId })
  }

  async importOpenQasmFile(fileName: string, bytes: Uint8Array): Promise<ArtifactManifest> {
    return this.importQuantumFile(fileName, bytes, 'openqasm3-qdk')
  }

  async loadOpenQasmBellFixture(): Promise<ArtifactManifest> {
    return this.registerArtifact('qcg-bell-sample.qasm', new TextEncoder().encode(bellOpenQasmProgram), {
      provenance: 'demo_fixture', profileId: 'openqasm3-qdk', artifactPrefix: 'openqasm-bell'
    })
  }

  async loadDemoArtifact(cardId: string): Promise<{ manifest: ArtifactManifest; card: DemoCard }> {
    const card = findDemoCard(cardId)
    if (!card) throw new Error('The selected demonstration artifact is unavailable.')
    const profile = await snapshotTargetProfile(card.profileId, this.now())
    const manifest = await this.registerArtifact(
      `${card.id}.qs`,
      new TextEncoder().encode(card.source),
      {
        provenance: 'demo_fixture', profileId: 'qsharp-qdk',
        artifactPrefix: card.id,
        compiledProfileDigest: card.compiledProfile === 'legacy'
          ? 'qsharp-lang-legacy-profile'
          : profile.compiler_profile_digest
      }
    )
    if (card.evidenceSeed === 'local_validation') this.localValidationDigests.add(manifest.artifact_digest)
    if (card.evidenceSeed === 'reusable_result') {
      const parametersDigest = await digest({})
      const key = await this.reuseKey(
        manifest,
        profile,
        card.observable,
        parametersDigest,
        card.requestedLimits
      )
      this.reusableKeys.add(key)
    }
    return { manifest, card }
  }

  async inspect(raw: unknown, source: Invocation['source'] = 'human'): Promise<ArtifactManifest> {
    const input = inspectInput.parse(raw)
    const record = this.artifacts.get(input.artifact_id)
    if (!record) throw new Error('artifact_id is unknown. The human must load the quantum artifact first.')
    const effects = { ...this.state.effects, inspections: this.state.effects.inspections + 1 }
    this.commit(
      {
        phase: record.manifest.compiler.status === 'invalid' ? 'recovery' : 'partial',
        activeArtifactId: record.manifest.artifact_id,
        manifest: record.manifest,
        targetProfile: undefined,
        recommendation: undefined,
        humanDecision: undefined,
        consent: undefined,
        receipt: undefined,
        effects,
        error: record.manifest.compiler.status === 'invalid'
          ? 'Compiler evidence is invalid. The safe next action is review or correction.'
          : undefined
      },
      {
        tool: 'inspect_quantum_experiment',
        status: 'completed',
        summary: `Manifest ${record.manifest.manifest_id} verified from stored bytes.`,
        source
      }
    )
    return clone(record.manifest)
  }

  private async reuseKey(
    manifest: ArtifactManifest,
    profile: TargetProfileSnapshot,
    observable: string,
    parametersDigest: string,
    limits: RequestedLimits
  ): Promise<string> {
    return digest({
      artifact_digest: manifest.artifact_digest,
      observable,
      shots: limits.shots,
      parameters_digest: parametersDigest,
      compiler: `${manifest.compiler.name}@${manifest.compiler.version}:${manifest.compiler.profile_digest}:${manifest.artifact_profile}`,
      target_profile_digest: profile.source_digest
    })
  }

  private resolveRecommendation(
    manifest: ArtifactManifest,
    profile: TargetProfileSnapshot,
    reuseKey: string,
    limits: RequestedLimits
  ): Pick<AgentRecommendation, 'decision' | 'reason_codes' | 'unknowns' | 'confidence' | 'safer_alternative'> {
    if (profile.evidence_state !== 'known') return {
      decision: 'reject',
      reason_codes: [profile.evidence_state === 'stale' ? 'TARGET_PROFILE_STALE' : 'TARGET_PROFILE_UNKNOWN'],
      unknowns: ['Current target capabilities are unavailable.'],
      confidence: 'high',
      safer_alternative: 'Refresh a sourced target-profile snapshot before any execution decision.'
    }
    const requiredTarget = profile.execution_surface === 'local_wasm' ? 'local_simulator' : 'external_reference'
    if (limits.target !== requiredTarget) return {
      decision: 'reject',
      reason_codes: ['TARGET_EXECUTION_SURFACE_MISMATCH'],
      unknowns: [],
      confidence: 'high',
      safer_alternative: `Use requested_limits.target=${requiredTarget} for this frozen target profile.`
    }
    if (manifest.capabilities.static_only) return {
      decision: 'reject',
      reason_codes: ['STATIC_INSPECTION_ONLY'],
      unknowns: ['This selected profile is inspected structurally only; QCG never compiles, simulates or externally executes it.'],
      confidence: 'high',
      safer_alternative: 'Review the static manifest or import an explicit Q# or OpenQASM 3 artifact for bounded local QDK evidence.'
    }
    if (manifest.compiler.status !== 'compiled') return {
      decision: 'reject',
      reason_codes: ['LOCAL_COMPILATION_INVALID'],
      unknowns: [],
      confidence: 'high',
      safer_alternative: 'Correct the local compiler diagnostics and import a new byte-identical artifact.'
    }
    if ((manifest.compiler.estimated_qubits ?? 9) > limits.max_qubits || limits.max_qubits > profile.max_qubits) return {
      decision: 'reject',
      reason_codes: ['QUBIT_BOUND_EXCEEDED'],
      unknowns: [],
      confidence: 'high',
      safer_alternative: 'Reduce the experiment or choose a profile whose documented bound fits the request.'
    }
    if (!manifest.compiler.bounded_entrypoint) return {
      decision: 'recompile',
      reason_codes: ['BOUNDED_ENTRYPOINT_REQUIRED'],
      unknowns: ['QCG only executes the bounded Result[] entrypoint contract in this MVP.'],
      confidence: 'high',
      safer_alternative: 'Compile a bounded Q# entrypoint and inspect its new digest.'
    }
    if (manifest.compiler.profile_digest !== profile.compiler_profile_digest) return {
      decision: 'recompile',
      reason_codes: ['TARGET_PROFILE_DIGEST_CHANGED'],
      unknowns: [],
      confidence: 'high',
      safer_alternative: 'Recompile against the current target-profile digest, then inspect again.'
    }
    if (this.reusableKeys.has(reuseKey)) return {
      decision: 'reuse_result',
      reason_codes: ['STRICT_REUSE_KEY_MATCH'],
      unknowns: [],
      confidence: 'high',
      safer_alternative: 'Reuse the fresh matching receipt and avoid another computation.'
    }
    if (profile.execution_surface === 'external_reference') {
      if (this.localValidationDigests.has(manifest.artifact_digest)) return {
        decision: 'ready_for_external_execution',
        reason_codes: ['LOCAL_EVIDENCE_VALID', 'EXTERNAL_AUTHORITY_REQUIRED'],
        unknowns: ['Live provider availability, credentials, queue state and price remain outside QCG.'],
        confidence: 'medium',
        safer_alternative: 'Keep the receipt and request separate human authorization in the provider system.'
      }
      return {
        decision: 'simulate_first',
        reason_codes: ['LOCAL_EVIDENCE_REQUIRED'],
        unknowns: ['The external reference has no matching local validation evidence.'],
        confidence: 'high',
        safer_alternative: 'Run the bounded local Bell simulation before considering an external system.'
      }
    }
    return {
      decision: 'simulate_first',
      reason_codes: ['BOUNDED_LOCAL_EVIDENCE_REQUIRED'],
      unknowns: [],
      confidence: 'high',
      safer_alternative: 'Request one-time human consent for a bounded local Q# simulation.'
    }
  }

  async evaluate(raw: unknown, source: Invocation['source'] = 'human'): Promise<AgentRecommendation> {
    return this.serializeMutation(async () => {
      const input = evaluateInput.parse(raw)
      const manifest = this.state.manifest
      if (!manifest || input.manifest_id !== manifest.manifest_id) throw new Error('manifest_id is unknown or stale.')
      const record = this.artifacts.get(manifest.artifact_id)
      if (!record) throw new Error('The artifact source is unavailable in this session.')
      const revision = this.stateRevision
      const targetProfile = await snapshotTargetProfile(input.target_profile_id, this.now())
      const parametersDigest = await digest(input.parameters)
      const reuseKey = await this.reuseKey(manifest, targetProfile, input.observable, parametersDigest, input.requested_limits)
      const policy = this.resolveRecommendation(manifest, targetProfile, reuseKey, input.requested_limits)
      if (policy.decision === 'simulate_first' && !record.bellFixture) {
        policy.decision = 'recompile'
        policy.reason_codes = ['BOUNDED_BELL_FIXTURE_REQUIRED']
        policy.unknowns = ['The imported program is valid, but the MVP executes only its auditable Bell fixtures.']
        policy.safer_alternative = 'Adapt the program to the published bounded Q# or OpenQASM Bell fixture, or retain inspection-only evidence.'
      }
      const recommendation: AgentRecommendation = {
        schema_version: 'webmcp-qcg.recommendation.v2',
        recommendation_id: id('recommendation', `${manifest.artifact_digest}-${this.now()}-${crypto.randomUUID()}`),
        manifest_id: manifest.manifest_id,
        target_profile_id: targetProfile.profile_id,
        scientific_intent: input.scientific_intent,
        observable: input.observable,
        parameters_digest: parametersDigest,
        requested_limits: input.requested_limits,
        reuse_key: reuseKey,
        expires_at: new Date(this.now() + RECOMMENDATION_TTL_MS).toISOString(),
        valid: true,
        ...policy
      }
      const effects: EffectCounters = {
        ...this.state.effects,
        evaluations: this.state.effects.evaluations + 1,
        metadata_validations: this.state.effects.metadata_validations + 1
      }
      const receipt = await this.makeReceipt(manifest, targetProfile, recommendation, null, null, effects)
      if (
        this.stateRevision !== revision ||
        this.state.manifest?.manifest_id !== manifest.manifest_id ||
        this.state.manifest.artifact_id !== manifest.artifact_id
      ) {
        throw new Error('The recommendation context changed before evaluation could be committed.')
      }
      this.commit(
        {
          phase: 'active',
          targetProfile,
          recommendation,
          humanDecision: undefined,
          consent: undefined,
          receipt,
          effects,
          error: undefined
        },
        {
          tool: 'evaluate_quantum_call',
          status: 'completed',
          summary: `Agent recommendation: ${recommendation.decision}.`,
          source
        }
      )
      return clone(recommendation)
    })
  }

  private recommendationValid(): boolean {
    return Boolean(
      this.state.recommendation?.valid &&
      new Date(this.state.recommendation.expires_at).getTime() > this.now()
    )
  }

  async decide(raw: unknown): Promise<HumanDecision> {
    return this.serializeMutation(async () => {
      const input = humanDecisionInput.parse(raw)
      const recommendation = this.state.recommendation
      if (!recommendation || input.recommendation_id !== recommendation.recommendation_id || !this.recommendationValid()) {
        throw new Error('The recommendation is unknown or expired.')
      }
      if (this.state.humanDecision?.recommendation_id === recommendation.recommendation_id) {
        throw new Error('The active recommendation already has a human decision. Re-evaluate before recording another decision.')
      }
      if (input.choice === 'overridden' && input.justification.trim().length < 12) {
        throw new Error('A human override requires a factual justification of at least 12 characters.')
      }
      const revision = this.stateRevision
      const manifest = this.state.manifest
      const targetProfile = this.state.targetProfile
      const previousReceipt = this.state.receipt
      if (!manifest || !targetProfile) throw new Error('The recommendation evidence is unavailable.')
      const decidedAt = new Date(this.now()).toISOString()
      const humanDecision: HumanDecision = {
        schema_version: 'webmcp-qcg.human-decision.v2',
        human_decision_id: id('human-decision', `${recommendation.recommendation_id}-${this.now()}-${crypto.randomUUID()}`),
        recommendation_id: recommendation.recommendation_id,
        choice: input.choice,
        justification: input.justification.trim() || (input.choice === 'accepted' ? 'Accepted after visible review.' : 'Deferred after visible review.'),
        override: input.choice === 'overridden',
        decided_at: decidedAt
      }
      const consent: ConsentToken | undefined =
        input.choice === 'accepted' && recommendation.decision === 'simulate_first'
          ? {
              consent_id: id('consent', crypto.randomUUID()),
              recommendation_id: recommendation.recommendation_id,
              created_at: decidedAt,
              expires_at: new Date(this.now() + CONSENT_TTL_MS).toISOString(),
              used: false
            }
          : undefined
      const receipt = await this.makeReceipt(
        manifest,
        targetProfile,
        recommendation,
        humanDecision,
        previousReceipt?.simulation ?? null,
        this.state.effects,
        previousReceipt
      )
      if (
        this.stateRevision !== revision ||
        this.state.recommendation?.recommendation_id !== recommendation.recommendation_id ||
        this.state.humanDecision
      ) {
        throw new Error('The recommendation changed before the human decision could be recorded.')
      }
      this.commit(
        { humanDecision, consent, receipt, phase: input.choice === 'deferred' ? 'partial' : 'active', error: undefined },
        {
          tool: 'human',
          status: 'completed',
          summary: `Human choice recorded: ${input.choice}.${consent ? ' One-time local consent created.' : ''}`,
          source: 'human'
        }
      )
      return clone(humanDecision)
    })
  }

  revokeConsent(): QcgState {
    const consent = this.state.consent
    if (!consent || consent.used || consent.revoked_at || new Date(consent.expires_at).getTime() <= this.now()) {
      throw new Error('Only a current unused consent can be revoked.')
    }
    const revoked = { ...consent, revoked_at: new Date(this.now()).toISOString() }
    this.commit(
      { consent: revoked, phase: 'partial', error: undefined },
      {
        tool: 'human',
        status: 'completed',
        summary: 'One-time local simulation consent revoked before use.',
        source: 'human'
      }
    )
    return this.snapshot()
  }

  private consentValid(input: { recommendation_id: string }): boolean {
    const consent = this.state.consent
    return Boolean(
      consent &&
      !consent.used &&
      !consent.revoked_at &&
      consent.recommendation_id === input.recommendation_id &&
      new Date(consent.expires_at).getTime() > this.now()
    )
  }

  async simulate(raw: unknown, signal: AbortSignal, source: Invocation['source'] = 'human'): Promise<EvidenceReceipt> {
    const input = simulationInput.parse(raw)
    if (this.activeSimulation) throw new Error('The bounded local simulation is already running.')
    const recommendation = this.state.recommendation
    const manifest = this.state.manifest
    const targetProfile = this.state.targetProfile
    const humanDecision = this.state.humanDecision
    const consent = this.state.consent
    const receipt = this.state.receipt
    const record = manifest ? this.artifacts.get(manifest.artifact_id) : undefined
    if (!recommendation || input.recommendation_id !== recommendation.recommendation_id || !this.recommendationValid()) {
      throw new Error('recommendation_id is unknown or expired.')
    }
    if (
      recommendation.decision !== 'simulate_first' ||
      humanDecision?.choice !== 'accepted' ||
      !this.consentValid(input)
    ) {
      throw new Error('A valid simulate_first recommendation and unused human consent are required.')
    }
    if (!manifest || !targetProfile || !consent || !receipt) throw new Error('The bounded simulation evidence context is unavailable.')
    if (!record?.bellFixture) throw new Error('The bounded Bell fixture is unavailable.')

    const effects = { ...this.state.effects, local_simulations: this.state.effects.local_simulations + 1 }
    const lease: SimulationLease = {
      leaseId: crypto.randomUUID(),
      artifactId: manifest.artifact_id,
      artifactDigest: manifest.artifact_digest,
      manifestId: manifest.manifest_id,
      targetProfileId: targetProfile.profile_id,
      targetProfileDigest: targetProfile.source_digest,
      recommendationId: recommendation.recommendation_id,
      humanDecisionId: humanDecision.human_decision_id,
      consentId: consent.consent_id,
      receiptId: receipt.receipt_id
    }
    this.activeSimulation = lease
    this.state = { ...this.state, effects, consent: { ...consent, used: true } }
    this.stateRevision += 1
    try {
      if (!record.adapter.executable || (record.manifest.format !== 'qsharp' && record.manifest.format !== 'openqasm3')) {
        throw new Error('Only Q# and OpenQASM 3 QDK artifacts can enter bounded local simulation.')
      }
      const result = await this.simulator.run(signal, recommendation.requested_limits, record.source, record.manifest.format)
      const integrityError = simulationIntegrityError(result, recommendation.requested_limits.shots)
      if (integrityError) throw new Error(`Local QDK simulation evidence rejected: ${integrityError}`)
      return await this.serializeMutation(async () => {
        if (!this.simulationLeaseMatches(lease)) {
          throw new Error('The bounded simulation context changed before completion. The stale result was discarded.')
        }
        const simulation: SimulationEvidence = {
          run_id: id('run', `${recommendation.recommendation_id}-${this.now()}-${crypto.randomUUID()}`),
          bell_invariant: result.bellInvariant,
          shots_requested: result.shotsRequested,
          shots_returned: result.shotsReturned,
          outcome_counts: result.outcomeCounts,
          completed_at: new Date(this.now()).toISOString()
        }
        const currentEffects = this.state.effects
        const currentReceipt = this.state.receipt
        const completedReceipt = await this.makeReceipt(
          manifest,
          targetProfile,
          recommendation,
          humanDecision,
          simulation,
          currentEffects,
          currentReceipt
        )
        if (!this.simulationLeaseMatches(lease)) {
          throw new Error('The bounded simulation context changed before completion. The stale result was discarded.')
        }
        this.localValidationDigests.add(manifest.artifact_digest)
        this.reusableKeys.add(recommendation.reuse_key)
        this.commit(
          { phase: 'active', receipt: completedReceipt, effects: currentEffects, error: undefined },
          {
            tool: 'run_bounded_local_simulation',
            status: 'completed',
            summary: `Bounded local Bell simulation completed; invariant=${result.bellInvariant}.`,
            source
          }
        )
        return clone(completedReceipt)
      })
    } catch (error) {
      if (!this.simulationLeaseMatches(lease)) {
        throw new Error('The bounded simulation context changed before completion. The stale result was discarded.')
      }
      const cancelled = error instanceof DOMException && error.name === 'AbortError'
      let failureRecorded = false
      await this.serializeMutation(async () => {
        if (!this.simulationLeaseMatches(lease)) return
        const currentEffects = this.state.effects
        this.commit(
          {
            phase: cancelled ? 'cancelled' : 'error',
            effects: currentEffects,
            error: cancelled
              ? 'Local simulation was cancelled. Consent was consumed.'
              : 'Local QDK simulation failed safely. Consent was consumed and no provider call occurred.'
          },
          {
            tool: 'run_bounded_local_simulation',
            status: cancelled ? 'cancelled' : 'error',
            summary: cancelled ? 'Bounded simulation cancelled.' : 'Bounded simulation failed safely.',
            source
          }
        )
        failureRecorded = true
      })
      if (!failureRecorded) {
        throw new Error('The bounded simulation context changed before completion. The stale result was discarded.')
      }
      throw error
    } finally {
      if (this.activeSimulation?.leaseId === lease.leaseId) this.activeSimulation = undefined
    }
  }

  async exportPacket(raw: unknown, source: Invocation['source'] = 'human'): Promise<{
    export_id: string
    receipt_id: string
    format: 'json' | 'markdown'
    digest: string
    summary: string
    content: string
  }> {
    return this.serializeMutation(async () => {
      const input = exportInput.parse(raw)
      const receipt = this.state.receipt
      if (!receipt || input.receipt_id !== receipt.receipt_id) throw new Error('receipt_id is unknown.')
      const revision = this.stateRevision
      const effects = { ...this.state.effects, evidence_exports: this.state.effects.evidence_exports + 1 }
      const refreshed = await this.makeReceipt(
        receipt.manifest,
        receipt.target_profile,
        receipt.recommendation,
        receipt.human_decision,
        receipt.simulation,
        effects,
        receipt
      )
      const content = input.format === 'json' ? JSON.stringify(refreshed, null, 2) : this.markdownReceipt(refreshed)
      const result = {
        export_id: id('export', `${receipt.receipt_id}-${input.format}-${this.now()}-${crypto.randomUUID()}`),
        receipt_id: receipt.receipt_id,
        format: input.format,
        digest: await digest(content),
        summary: `Evidence ${input.format.toUpperCase()} prepared without raw Q#, credentials or provider data.`,
        content
      }
      if (this.stateRevision !== revision || this.state.receipt?.receipt_id !== receipt.receipt_id) {
        throw new Error('The evidence receipt changed before export could be recorded.')
      }
      this.commit(
        { receipt: refreshed, effects },
        {
          tool: 'export_quantum_evidence_report',
          status: 'completed',
          summary: `Evidence receipt exported as ${input.format}.`,
          source
        }
      )
      return result
    })
  }

  private async makeReceipt(
    manifest: ArtifactManifest,
    targetProfile: TargetProfileSnapshot,
    recommendation: AgentRecommendation,
    humanDecision: HumanDecision | null,
    simulation: SimulationEvidence | null,
    effects: EffectCounters,
    previous?: EvidenceReceipt
  ): Promise<EvidenceReceipt> {
    const timestamp = new Date(this.now()).toISOString()
    const content = {
      manifest,
      target_profile: targetProfile,
      recommendation,
      human_decision: humanDecision,
      simulation,
      effects
    }
    return {
      schema_version: 'webmcp-qcg.evidence-receipt.v3',
      receipt_id: previous?.receipt_id ?? id('receipt', recommendation.recommendation_id),
      ...content,
      format: manifest.format,
      artifact_profile: profileSummary(getQuantumAdapter(manifest.artifact_profile)!),
      compiler_facts: manifest.compiler,
      digest: await digest(content),
      created_at: previous?.created_at ?? timestamp,
      updated_at: timestamp
    }
  }

  private markdownReceipt(receipt: EvidenceReceipt): string {
    return `# WebMCP-QCG evidence receipt

- Schema: ${receipt.schema_version}
- Artifact profile: ${receipt.artifact_profile.id} (${receipt.format})
- Artifact digest: ${receipt.manifest.artifact_digest}
- Target profile: ${receipt.target_profile.profile_id} (${receipt.target_profile.evidence_state})
- Agent recommendation: ${receipt.recommendation.decision}
- Reason codes: ${receipt.recommendation.reason_codes.join(', ') || 'none'}
- Human choice: ${receipt.human_decision?.choice ?? 'pending'}
- Human decision ID: ${receipt.human_decision?.human_decision_id ?? 'pending'}
- Human justification: ${receipt.human_decision?.justification ?? 'pending'}
- Human decision timestamp: ${receipt.human_decision?.decided_at ?? 'pending'}
- Local simulations: ${receipt.effects.local_simulations}
- Metadata validations: ${receipt.effects.metadata_validations}
- QPU submissions: ${receipt.effects.qpu_submissions}
- Bell invariant: ${receipt.simulation?.bell_invariant ?? 'not run'}
- Receipt digest: ${receipt.digest}
`
  }
}
