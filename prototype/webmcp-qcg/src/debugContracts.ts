import { z } from 'zod'

export const debugActors = ['human', 'codex', 'gemini', 'antigravity', 'system'] as const
export const debugKinds = ['observation', 'hypothesis', 'proposal', 'challenge', 'decision_request', 'receipt'] as const
export const debugConfidence = ['high', 'medium', 'low'] as const
export const debugStatuses = ['open', 'acknowledged', 'resolved'] as const

const safeText = (max: number) => z.string().transform((value) => value.normalize('NFC')).pipe(z.string().trim().min(1).max(max)).superRefine((value, context) => {
  // The debug plane rejects recognized high-risk code, credential, path, stack, and transport-body patterns.
  const prohibited = [
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/,
    /(?:api[_-]?key|authorization|bearer\s+|password|secret|token\s*[:=])/i,
    /\b(?:sk-[A-Za-z0-9_-]{12,}|github_pat_[A-Za-z0-9_]{20,}|gh[pousr]_[A-Za-z0-9]{20,}|AIza[A-Za-z0-9_-]{20,}|sk_(?:live|test)_[A-Za-z0-9]{12,}|xox[baprs]-[A-Za-z0-9-]{10,}|npm_[A-Za-z0-9]{20,})\b/i,
    /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b|-----BEGIN [A-Z ]*PRIVATE KEY-----|\bssh-(?:rsa|ed25519)\s+/i,
    /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/,
    /(?:[a-z]:\\|\\\\|(?:^|\s)\/(?:[A-Za-z0-9._-]+\/)+[A-Za-z0-9._-]+|\.aws\/credentials|\.qs\b|namespace\s+|operation\s+[A-Za-z_][\w]*\s*\()/i,
    /(?:\b(?:use|borrow)\s+[A-Za-z_]\w*\s*=\s*Qubit(?:\[\])?\s*\(|\bQubit(?:\[\])?\s*\(|\b(?:CNOT|Reset|Measure)\s*\()/i,
    /\b(?:let|mutable|set)\s+[A-Za-z_]\w*\s*(?:=|w\/=)\s*[^;\r\n]{1,200};/i,
    /\b[A-Za-z_]\w*\s*\([^()\r\n]{0,120}\)\s*;/,
    /(?:\bat\s+[^\s()]+(?:\([^)]*\))?(?::\d+){1,2}|stack\s*trace|traceback)/i,
    /(?:request\s*body|response\s*body|multipart\/form-data|\{\s*"(?:headers|body|payload)"\s*:)/i
  ]
  if (prohibited.some((rule) => rule.test(value))) context.addIssue({ code: z.ZodIssueCode.custom, message: 'Debug content contains a prohibited control, bidi, credential, path, raw-Q#, stack, or network-body pattern.' })
})

const safeRole = z.string().trim().min(1).max(64).regex(/^[\p{L}][\p{L}\p{N} _-]*$/u, 'Role must be a short human-readable label.')
const safeEvidenceRef = z.string().trim().min(1).max(220).regex(/^(?:artifact|browser-proof|debug-event|decision|manifest|qa|receipt|source|test):[A-Za-z0-9._:-]+$/, 'Evidence references must use an approved structured prefix.')

export const qcgDebugMessage = z.object({
  schema_version: z.literal('qcg-debug-message.v1'),
  event_id: z.string().uuid(),
  session_id: z.string().uuid(),
  sequence: z.number().int().min(1).max(200),
  actor: z.enum(debugActors),
  role: safeRole,
  kind: z.enum(debugKinds),
  summary: safeText(1200),
  evidence_refs: z.array(safeEvidenceRef).max(12),
  confidence: z.enum(debugConfidence),
  status: z.enum(debugStatuses),
  identity_assurance: z.literal('declared'),
  requested_action: safeText(180).optional(),
  issued_at: z.string().datetime({ offset: true })
}).strict()

export type QcgDebugMessage = z.infer<typeof qcgDebugMessage>

export const debugMessageDraft = qcgDebugMessage.omit({ event_id: true, issued_at: true, sequence: true }).extend({
  event_id: z.string().uuid().optional(),
  issued_at: z.string().datetime({ offset: true }).optional()
}).strict()
export type DebugMessageDraft = z.infer<typeof debugMessageDraft>

export function createDebugMessage(draft: DebugMessageDraft, sequence: number, now = new Date()): QcgDebugMessage {
  return qcgDebugMessage.parse({
    ...draft,
    schema_version: 'qcg-debug-message.v1',
    event_id: draft.event_id ?? crypto.randomUUID(),
    sequence,
    issued_at: draft.issued_at ?? now.toISOString()
  })
}
