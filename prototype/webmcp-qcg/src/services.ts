import { evaluateInput, exportInput, humanDecisionInput, inspectInput, simulationInput } from './contracts'
import { bellProgram, findDemoCard, type DemoCard } from './catalog'
import { digest, digestBytes, id } from './crypto'
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
  type TargetProfileSnapshot
} from './types'

export type { ArtifactAnalyzer, Simulator, SimulatorResult } from './workerClient'

const MAX_ARTIFACT_BYTES = 131_072
const CONSENT_TTL_MS = 2 * 60_000
const RECOMMENDATION_TTL_MS = 5 * 60_000

interface ArtifactRecord {
  manifest: ArtifactManifest
  source: string
  bellFixture: boolean
}

interface RegisterOptions {
  provenance: ArtifactManifest['provenance']
  artifactPrefix?: string
  compiledProfileDigest?: string
}

function clone<T>(value: T): T {
  return structuredClone(value)
}

function cleanFileName(name: string): string {
  const leaf = name.replace(/\\/g, '/').split('/').pop()?.trim() || 'experiment.qs'
  return leaf.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 128)
}

function estimateQubits(source: string): number | null {
  const matches = source.match(/\bQubit\s*\(\s*\)/g)
  if (!matches) return null
  return Math.min(matches.length, 9)
}

function isBoundedEntrypoint(source: string, qubits: number | null): boolean {
  return /@EntryPoint\s*\(\s*\)/.test(source) &&
    /operation\s+Main\s*\([^)]*\)\s*:\s*Result\s*\[\s*\]/.test(source) &&
    qubits !== null && qubits >= 1 && qubits <= 8
}

export class QcgServices {
  private state: QcgState = initialState()
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
  reset(): QcgState { this.state = initialState(); return this.snapshot() }

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
  }

  private async registerArtifact(
    fileName: string,
    bytes: Uint8Array,
    options: RegisterOptions
  ): Promise<ArtifactManifest> {
    if (bytes.byteLength < 1) throw new Error('The Q# artifact is empty.')
    if (bytes.byteLength > MAX_ARTIFACT_BYTES) throw new Error('The Q# artifact exceeds the 128 KiB local limit.')
    const safeName = cleanFileName(fileName)
    if (!safeName.toLowerCase().endsWith('.qs')) throw new Error('Only .qs Q# artifacts enter this preflight.')

    let source: string
    try {
      source = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    } catch {
      throw new Error('The Q# artifact must use valid UTF-8 encoding.')
    }
    if (source.includes('\0')) throw new Error('The Q# artifact contains an unsupported null byte.')

    const artifactDigest = await digestBytes(bytes)
    let analysis
    try {
      analysis = await this.analyzer.analyze(source)
    } catch {
      analysis = { valid: false, diagnosticCount: 1, diagnostics: ['Q# compiler analysis could not complete within the local boundary.'] }
    }
    const profile = await snapshotTargetProfile(LOCAL_PROFILE_ID, this.now())
    const qubits = estimateQubits(source)
    const artifactId = id(options.artifactPrefix ?? 'artifact', artifactDigest)
    const manifest: ArtifactManifest = {
      schema_version: 'webmcp-qcg.artifact-manifest.v2',
      manifest_id: id('manifest', artifactDigest),
      artifact_id: artifactId,
      file_name: safeName,
      artifact_digest: artifactDigest,
      byte_size: bytes.byteLength,
      format: 'qsharp',
      provenance: options.provenance,
      compiler: {
        name: 'qsharp-lang',
        version: '1.31.0',
        status: analysis.valid ? 'compiled' : 'invalid',
        diagnostic_count: analysis.diagnosticCount,
        diagnostics: analysis.diagnostics.slice(0, 4),
        profile_digest: options.compiledProfileDigest ?? profile.compiler_profile_digest,
        bounded_entrypoint: analysis.valid && isBoundedEntrypoint(source, qubits),
        estimated_qubits: qubits
      },
      created_at: new Date(this.now()).toISOString()
    }
    this.artifacts.set(artifactId, {
      manifest,
      source,
      bellFixture: source.trim() === bellProgram.trim()
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
        summary: `Q# artifact loaded locally; byte digest ${artifactDigest.slice(0, 12)}…`,
        source: 'human'
      }
    )
    return clone(manifest)
  }

  async importQsharpFile(fileName: string, bytes: Uint8Array): Promise<ArtifactManifest> {
    return this.registerArtifact(fileName, bytes, { provenance: 'human_import' })
  }

  async loadDemoArtifact(cardId: string): Promise<{ manifest: ArtifactManifest; card: DemoCard }> {
    const card = findDemoCard(cardId)
    if (!card) throw new Error('The selected demonstration artifact is unavailable.')
    const profile = await snapshotTargetProfile(card.profileId, this.now())
    const manifest = await this.registerArtifact(
      `${card.id}.qs`,
      new TextEncoder().encode(card.source),
      {
        provenance: 'demo_fixture',
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
    if (!record) throw new Error('artifact_id is unknown. The human must load the Q# artifact first.')
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
      compiler: `${manifest.compiler.name}@${manifest.compiler.version}`,
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
    if (manifest.compiler.status !== 'compiled') return {
      decision: 'reject',
      reason_codes: ['QSHARP_COMPILATION_INVALID'],
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
    const input = evaluateInput.parse(raw)
    const manifest = this.state.manifest
    if (!manifest || input.manifest_id !== manifest.manifest_id) throw new Error('manifest_id is unknown or stale.')
    const record = this.artifacts.get(manifest.artifact_id)
    if (!record) throw new Error('The artifact source is unavailable in this session.')
    const targetProfile = await snapshotTargetProfile(input.target_profile_id, this.now())
    const parametersDigest = await digest(input.parameters)
    const reuseKey = await this.reuseKey(manifest, targetProfile, input.observable, parametersDigest, input.requested_limits)
    const policy = this.resolveRecommendation(manifest, targetProfile, reuseKey, input.requested_limits)
    if (policy.decision === 'simulate_first' && !record.bellFixture) {
      policy.decision = 'recompile'
      policy.reason_codes = ['BOUNDED_BELL_FIXTURE_REQUIRED']
      policy.unknowns = ['The imported program is valid Q#, but the MVP executes only its auditable Bell fixture.']
      policy.safer_alternative = 'Adapt the program to the published bounded Bell fixture or retain inspection-only evidence.'
    }
    const recommendation: AgentRecommendation = {
      schema_version: 'webmcp-qcg.recommendation.v2',
      recommendation_id: id('recommendation', `${manifest.artifact_digest}-${this.now()}`),
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
  }

  private recommendationValid(): boolean {
    return Boolean(
      this.state.recommendation?.valid &&
      new Date(this.state.recommendation.expires_at).getTime() > this.now()
    )
  }

  async decide(raw: unknown): Promise<HumanDecision> {
    const input = humanDecisionInput.parse(raw)
    const recommendation = this.state.recommendation
    if (!recommendation || input.recommendation_id !== recommendation.recommendation_id || !this.recommendationValid()) {
      throw new Error('The recommendation is unknown or expired.')
    }
    if (input.choice === 'overridden' && input.justification.trim().length < 12) {
      throw new Error('A human override requires a factual justification of at least 12 characters.')
    }
    const decidedAt = new Date(this.now()).toISOString()
    const humanDecision: HumanDecision = {
      schema_version: 'webmcp-qcg.human-decision.v2',
      human_decision_id: id('human-decision', `${recommendation.recommendation_id}-${this.now()}`),
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
      this.state.manifest!,
      this.state.targetProfile!,
      recommendation,
      humanDecision,
      this.state.receipt?.simulation ?? null,
      this.state.effects,
      this.state.receipt
    )
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
    const recommendation = this.state.recommendation
    const record = this.state.manifest ? this.artifacts.get(this.state.manifest.artifact_id) : undefined
    if (!recommendation || input.recommendation_id !== recommendation.recommendation_id || !this.recommendationValid()) {
      throw new Error('recommendation_id is unknown or expired.')
    }
    if (
      recommendation.decision !== 'simulate_first' ||
      this.state.humanDecision?.choice !== 'accepted' ||
      !this.consentValid(input)
    ) {
      throw new Error('A valid simulate_first recommendation and unused human consent are required.')
    }
    if (!record?.bellFixture) throw new Error('The bounded Bell fixture is unavailable.')

    const effects = { ...this.state.effects, local_simulations: this.state.effects.local_simulations + 1 }
    this.state = { ...this.state, effects, consent: { ...this.state.consent!, used: true } }
    try {
      const result = await this.simulator.run(signal, recommendation.requested_limits, record.source)
      const simulation: SimulationEvidence = {
        run_id: id('run', `${recommendation.recommendation_id}-${this.now()}`),
        bell_invariant: result.bellInvariant,
        shots_requested: result.shotsRequested,
        shots_returned: result.shotsReturned,
        outcome_counts: result.outcomeCounts,
        completed_at: new Date(this.now()).toISOString()
      }
      this.localValidationDigests.add(record.manifest.artifact_digest)
      this.reusableKeys.add(recommendation.reuse_key)
      const receipt = await this.makeReceipt(
        record.manifest,
        this.state.targetProfile!,
        recommendation,
        this.state.humanDecision!,
        simulation,
        effects,
        this.state.receipt
      )
      this.commit(
        { phase: 'active', receipt, effects, error: undefined },
        {
          tool: 'run_bounded_qsharp_simulation',
          status: 'completed',
          summary: `Bounded local Bell simulation completed; invariant=${result.bellInvariant}.`,
          source
        }
      )
      return clone(receipt)
    } catch (error) {
      const cancelled = error instanceof DOMException && error.name === 'AbortError'
      this.commit(
        {
          phase: cancelled ? 'cancelled' : 'error',
          effects,
          error: cancelled
            ? 'Local simulation was cancelled. Consent was consumed.'
            : 'Local Q# simulation failed safely. Consent was consumed and no provider call occurred.'
        },
        {
          tool: 'run_bounded_qsharp_simulation',
          status: cancelled ? 'cancelled' : 'error',
          summary: cancelled ? 'Bounded simulation cancelled.' : 'Bounded simulation failed safely.',
          source
        }
      )
      throw error
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
    const input = exportInput.parse(raw)
    const receipt = this.state.receipt
    if (!receipt || input.receipt_id !== receipt.receipt_id) throw new Error('receipt_id is unknown.')
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
      export_id: id('export', `${receipt.receipt_id}-${input.format}-${this.now()}`),
      receipt_id: receipt.receipt_id,
      format: input.format,
      digest: await digest(content),
      summary: `Evidence ${input.format.toUpperCase()} prepared without raw Q#, credentials or provider data.`,
      content
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
      schema_version: 'webmcp-qcg.evidence-receipt.v2',
      receipt_id: previous?.receipt_id ?? id('receipt', recommendation.recommendation_id),
      ...content,
      digest: await digest(content),
      created_at: previous?.created_at ?? timestamp,
      updated_at: timestamp
    }
  }

  private markdownReceipt(receipt: EvidenceReceipt): string {
    return `# WebMCP-QCG evidence receipt

- Schema: ${receipt.schema_version}
- Artifact digest: ${receipt.manifest.artifact_digest}
- Target profile: ${receipt.target_profile.profile_id} (${receipt.target_profile.evidence_state})
- Agent recommendation: ${receipt.recommendation.decision}
- Reason codes: ${receipt.recommendation.reason_codes.join(', ') || 'none'}
- Human choice: ${receipt.human_decision?.choice ?? 'pending'}
- Local simulations: ${receipt.effects.local_simulations}
- Metadata validations: ${receipt.effects.metadata_validations}
- QPU submissions: ${receipt.effects.qpu_submissions}
- Bell invariant: ${receipt.simulation?.bell_invariant ?? 'not run'}
- Receipt digest: ${receipt.digest}
`
  }
}
