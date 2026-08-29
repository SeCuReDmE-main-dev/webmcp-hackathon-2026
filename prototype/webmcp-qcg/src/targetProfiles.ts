import { digest } from './crypto'
import type { TargetProfileSnapshot } from './types'
import localProfile from './target-profiles/qsharp-local-wasm-1.31.0.json'
import externalProfile from './target-profiles/external-qir-reference-v1.json'

export const LOCAL_PROFILE_ID = 'qsharp-local-wasm-1310'
export const EXTERNAL_PROFILE_ID = 'external-qir-reference-v1'

interface ProfileDefinition {
  profile_id: string
  label: string
  source: string
  captured_at: string
  expires_at: string
  execution_surface: TargetProfileSnapshot['execution_surface']
  max_qubits: number
  compiler_profile_digest: string
}

const definitions: Record<string, ProfileDefinition> = {
  [LOCAL_PROFILE_ID]: localProfile as ProfileDefinition,
  [EXTERNAL_PROFILE_ID]: externalProfile as ProfileDefinition
}

export const targetProfileIds = Object.keys(definitions)

export async function snapshotTargetProfile(profileId: string, now: number): Promise<TargetProfileSnapshot> {
  const definition = definitions[profileId]
  if (!definition) {
    const captured = new Date(now).toISOString()
    return {
      schema_version: 'webmcp-qcg.target-profile.v2',
      profile_id: profileId.slice(0, 64),
      label: 'Unknown target profile',
      source: 'unavailable',
      source_digest: await digest({ profileId, unavailable: true }),
      captured_at: captured,
      expires_at: captured,
      evidence_state: 'unknown',
      execution_surface: 'external_reference',
      max_qubits: 0,
      compiler_profile_digest: 'unknown',
      submission_enabled: false
    }
  }
  const source_digest = await digest(definition)
  return {
    schema_version: 'webmcp-qcg.target-profile.v2',
    ...definition,
    source_digest,
    evidence_state: new Date(definition.expires_at).getTime() > now ? 'known' : 'stale',
    submission_enabled: false
  }
}
