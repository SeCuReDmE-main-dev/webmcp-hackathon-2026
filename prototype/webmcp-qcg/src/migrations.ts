import { digest, id } from './crypto'
import { getQuantumAdapter, profileSummary } from './quantumAdapters'
import type { EvidenceReceipt } from './types'

interface LegacyPacket {
  schema_version?: string
  inspection?: {
    inspection_id?: string
    artifact_id?: string
    artifact_digest?: string
    artifact_kind?: string
    provenance?: string
    created_at?: string
  }
  evaluation?: {
    decision_id?: string
    decision?: EvidenceReceipt['recommendation']['decision']
    reason_codes?: string[]
    next_action?: string
    scientific_intent?: string
    expires_at?: string
  }
  evidence?: {
    evidence_packet_id?: string
    digest?: string
    created_at?: string
  }
}

export async function convertV1Receipt(value: unknown): Promise<EvidenceReceipt | null> {
  const legacy = value as LegacyPacket
  if (legacy?.schema_version !== 'webmcp.qcg.evidence.v1' || !legacy.inspection || !legacy.evaluation) return null
  const sourceDigest = await digest(legacy)
  const created = legacy.evidence?.created_at ?? legacy.inspection.created_at ?? new Date(0).toISOString()
  const artifactDigest = /^[a-f0-9]{64}$/.test(legacy.inspection.artifact_digest ?? '')
    ? legacy.inspection.artifact_digest!
    : await digest({ legacy_artifact: legacy.inspection.artifact_id ?? 'unknown' })
  const parametersDigest = await digest({})
  const manifest = {
    schema_version: 'webmcp-qcg.artifact-manifest.v2' as const,
    manifest_id: id('manifest', artifactDigest),
    artifact_id: id('legacy-artifact', legacy.inspection.artifact_id ?? sourceDigest),
    file_name: 'legacy-evidence.qs',
    artifact_digest: artifactDigest,
    byte_size: 1,
    format: 'qsharp' as const,
    artifact_profile: 'qsharp-qdk' as const,
    capabilities: { inspect: true, compile: true, simulate: true, static_only: false },
    provenance: 'demo_fixture' as const,
    compiler: {
      name: 'qsharp-lang' as const,
      version: '1.31.0' as const,
      status: 'unverified' as const,
      diagnostic_count: 0,
      diagnostics: ['Converted evidence preserves history but cannot reconstruct compiler facts.'],
      profile_digest: 'legacy-unverified',
      bounded_entrypoint: false,
      estimated_qubits: null
    },
    created_at: created
  }
  const recommendation = {
    schema_version: 'webmcp-qcg.recommendation.v2' as const,
    recommendation_id: id('recommendation', legacy.evaluation.decision_id ?? sourceDigest),
    manifest_id: manifest.manifest_id,
    target_profile_id: 'legacy-target-unverified',
    decision: legacy.evaluation.decision ?? 'reject',
    reason_codes: [...(legacy.evaluation.reason_codes ?? []), 'MIGRATED_V1_UNVERIFIED'].slice(0, 8),
    unknowns: ['The v1 packet did not preserve a sourced target-profile snapshot.'],
    confidence: 'low' as const,
    safer_alternative: legacy.evaluation.next_action ?? 'Re-inspect the original artifact under the v2 contract.',
    scientific_intent: legacy.evaluation.scientific_intent ?? 'Preserve a historical v1 preflight decision.',
    observable: 'legacy_unverified',
    parameters_digest: parametersDigest,
    requested_limits: { shots: 1, timeout_ms: 500, max_qubits: 1, target: 'local_simulator' as const },
    reuse_key: await digest({ legacy: sourceDigest }),
    expires_at: legacy.evaluation.expires_at ?? created,
    valid: false
  }
  const targetProfile = {
    schema_version: 'webmcp-qcg.target-profile.v2' as const,
    profile_id: 'legacy-target-unverified',
    label: 'Legacy target evidence',
    source: 'migrated://webmcp.qcg.evidence.v1',
    source_digest: sourceDigest,
    captured_at: created,
    expires_at: created,
    evidence_state: 'unknown' as const,
    execution_surface: 'local_wasm' as const,
    max_qubits: 0,
    compiler_profile_digest: 'legacy-unverified',
    submission_enabled: false as const
  }
  const effects = {
    inspections: 0,
    evaluations: 0,
    local_simulations: 0,
    metadata_validations: 0,
    qpu_submissions: 0 as const,
    evidence_exports: 0
  }
  const body = { manifest, target_profile: targetProfile, recommendation, human_decision: null, simulation: null, effects }
  return {
    schema_version: 'webmcp-qcg.evidence-receipt.v3',
    receipt_id: id('receipt', legacy.evidence?.evidence_packet_id ?? sourceDigest),
    ...body,
    format: manifest.format,
    artifact_profile: profileSummary(getQuantumAdapter('qsharp-qdk')!),
    compiler_facts: manifest.compiler,
    digest: await digest(body),
    created_at: created,
    updated_at: created,
    migration: { from: 'webmcp.qcg.evidence.v1', source_digest: sourceDigest }
  }
}

interface V2Receipt {
  schema_version?: string
  receipt_id?: string
  manifest?: Record<string, unknown>
  target_profile?: EvidenceReceipt['target_profile']
  recommendation?: EvidenceReceipt['recommendation']
  human_decision?: EvidenceReceipt['human_decision']
  simulation?: EvidenceReceipt['simulation']
  effects?: EvidenceReceipt['effects']
  digest?: string
  created_at?: string
  updated_at?: string
}

/** Reads a v2 receipt into v3 memory only; IndexedDB is never rewritten during migration. */
export async function convertV2Receipt(value: unknown): Promise<EvidenceReceipt | null> {
  const legacy = value as V2Receipt
  if (legacy?.schema_version !== 'webmcp-qcg.evidence-receipt.v2' || !legacy.manifest || !legacy.target_profile || !legacy.recommendation || !legacy.effects) return null
  const sourceDigest = await digest(legacy)
  const adapter = getQuantumAdapter(typeof legacy.manifest.artifact_profile === 'string' ? legacy.manifest.artifact_profile : 'qsharp-qdk')!
  const compiler = (legacy.manifest.compiler ?? {
    name: 'qsharp-lang', version: '1.31.0', status: 'unverified', diagnostic_count: 0,
    diagnostics: ['Converted v2 receipt lacks complete compiler facts.'], profile_digest: 'legacy-unverified', bounded_entrypoint: false, estimated_qubits: null
  }) as EvidenceReceipt['compiler_facts']
  const manifest = {
    ...legacy.manifest,
    schema_version: 'webmcp-qcg.artifact-manifest.v2' as const,
    format: adapter.format,
    artifact_profile: adapter.id,
    capabilities: adapter.capabilities,
    compiler
  } as EvidenceReceipt['manifest']
  const created = legacy.created_at ?? legacy.updated_at ?? new Date(0).toISOString()
  const body = {
    manifest, target_profile: legacy.target_profile, recommendation: legacy.recommendation,
    human_decision: legacy.human_decision ?? null, simulation: legacy.simulation ?? null, effects: legacy.effects
  }
  return {
    schema_version: 'webmcp-qcg.evidence-receipt.v3',
    receipt_id: legacy.receipt_id ?? id('receipt', sourceDigest),
    ...body,
    format: adapter.format,
    artifact_profile: profileSummary(adapter),
    compiler_facts: compiler,
    digest: await digest(body),
    created_at: created,
    updated_at: legacy.updated_at ?? created,
    migration: { from: 'webmcp-qcg.evidence-receipt.v2', source_digest: sourceDigest }
  }
}
