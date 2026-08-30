import { z } from 'zod'
import type { QcgState } from '../types'

export const qcgSurfaces = ['web', 'devtools', 'sidepanel'] as const
export type QcgSurface = typeof qcgSurfaces[number]

export const qcgThemes = ['dark', 'light'] as const
export type QcgTheme = typeof qcgThemes[number]
export const QCG_THEME_STORAGE_KEY = 'qcg-theme-v1'

export const consoleViews = ['inspector', 'console', 'webmcp', 'decisions', 'sources', 'receipts', 'activity'] as const
export type ConsoleView = typeof consoleViews[number]

export interface SanitizedConsoleSnapshotV2 {
  schema_version: 'qcg-console-snapshot.v2'
  surface: QcgSurface
  session_id: string
  phase: QcgState['phase']
  authority_state: QcgState['authority_state']
  artifact?: { id: string; digest: string; format: string; profile: string; compiler_status: string }
  recommendation?: { id: string; decision: string; confidence: string; reason_codes: string[]; expires_at: string }
  effects: QcgState['effects']
  receipt?: { id: string; digest: string; schema_version: string }
  storage_mode: 'indexeddb' | 'memory'
  available_commands: SafeConsoleCommandKind[]
}

export const safeConsoleCommandKinds = [
  'human_decision',
  'human_review_disposition',
  'human_memory_disposition',
  'human_message',
  'human_override_note',
  'gemini_manual_handoff_create',
  'gemini_manual_reply_preview',
  'gemini_manual_reply_import',
  'export_debug_handoff'
] as const
export type SafeConsoleCommandKind = typeof safeConsoleCommandKinds[number]

const base = z.object({ schema_version: z.literal('qcg-console-command.v1'), session_id: z.string().uuid() }).strict()
export const safeConsoleCommand = z.discriminatedUnion('kind', [
  base.extend({ kind: z.literal('human_decision'), recommendation_id: z.string().uuid(), choice: z.enum(['accepted', 'deferred', 'overridden']), justification: z.string().max(500).optional() }).strict(),
  base.extend({ kind: z.literal('human_review_disposition'), event_id: z.string().uuid(), disposition: z.enum(['approve', 'deny', 'reject', 'defer']) }).strict(),
  base.extend({ kind: z.literal('human_memory_disposition'), event_id: z.string().uuid(), disposition: z.enum(['remember', 'forget']), content: z.string().max(400).optional() }).strict(),
  base.extend({ kind: z.literal('human_message'), summary: z.string().min(1).max(500) }).strict(),
  base.extend({ kind: z.literal('human_override_note'), justification: z.string().min(12).max(500) }).strict(),
  base.extend({ kind: z.literal('gemini_manual_handoff_create'), intent: z.enum(['debug', 'search', 'find', 'brainstorm', 'decision']), prompt: z.string().min(1).max(500) }).strict(),
  base.extend({ kind: z.literal('gemini_manual_reply_preview'), raw: z.string().min(1).max(8_192) }).strict(),
  base.extend({ kind: z.literal('gemini_manual_reply_import'), raw: z.string().min(1).max(8_192) }).strict(),
  base.extend({ kind: z.literal('export_debug_handoff') }).strict()
])
export type SafeConsoleCommandV1 = z.infer<typeof safeConsoleCommand>

export interface ConsoleCommandResultV1 {
  schema_version: 'qcg-console-command-result.v1'
  accepted: boolean
  status: 'completed' | 'queued' | 'rejected'
  message: string
  command_id?: string
  preview?: string
  handoff?: string
}

export interface ConsoleTransport {
  surface: QcgSurface
  getSnapshot(): SanitizedConsoleSnapshotV2
  executeConsoleCommand(command: unknown): Promise<ConsoleCommandResultV1>
}

export function sanitizedConsoleSnapshot(state: QcgState, sessionId: string, storageMode: 'indexeddb' | 'memory', surface: QcgSurface = 'web'): SanitizedConsoleSnapshotV2 {
  return {
    schema_version: 'qcg-console-snapshot.v2',
    surface,
    session_id: sessionId,
    phase: state.phase,
    authority_state: state.authority_state,
    artifact: state.manifest ? {
      id: state.manifest.artifact_id,
      digest: state.manifest.artifact_digest,
      format: state.manifest.format,
      profile: state.manifest.artifact_profile,
      compiler_status: state.manifest.compiler.status
    } : undefined,
    recommendation: state.recommendation ? {
      id: state.recommendation.recommendation_id,
      decision: state.recommendation.decision,
      confidence: state.recommendation.confidence,
      reason_codes: [...state.recommendation.reason_codes],
      expires_at: state.recommendation.expires_at
    } : undefined,
    effects: { ...state.effects },
    receipt: state.receipt ? { id: state.receipt.receipt_id, digest: state.receipt.digest, schema_version: state.receipt.schema_version } : undefined,
    storage_mode: storageMode,
    available_commands: [...safeConsoleCommandKinds]
  }
}
