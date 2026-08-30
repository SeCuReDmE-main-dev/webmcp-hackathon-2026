import type { QcgState } from './types'
import { DebugLedger } from './debugLedger'
import { createGeminiManualHandoff, debugMessageDraft, geminiManualReply, safeDebugText, type CollaborationIntent, type GeminiManualHandoff, type HumanMemoryDisposition, type HumanReviewDisposition, type QcgDebugMessage } from './debugContracts'
import { safeConsoleCommand, sanitizedConsoleSnapshot, type ConsoleCommandResultV1, type ConsoleTransport, type SanitizedConsoleSnapshotV2 } from './console/contracts'

export interface QcgDevtoolsCommandStatus {
  command_id: string
  status: 'queued' | 'completed' | 'failed'
  message: string
}

export interface QcgDevtoolsQueueResult {
  accepted: boolean
  command_id?: string
  error?: string
}

export interface QcgDevtoolsSnapshot {
  schema_version: 'qcg-devtools-context.v1'
  phase: QcgState['phase']
  authority_state: QcgState['authority_state']
  artifact?: { id: string; digest: string; compiler: string }
  recommendation?: { id: string; decision: string; confidence: string; reason_codes: string[]; expires_at: string }
  effects: QcgState['effects']
  receipt?: { id: string; digest: string }
  storage_mode: 'indexeddb' | 'memory'
}

export interface QcgDevtoolsPanelSnapshot extends QcgDevtoolsSnapshot {
  session_id: string
  messages: QcgDebugMessage[]
  participants: Array<{ actor: QcgDebugMessage['actor']; role: string }>
  human_review_requests: QcgDebugMessage[]
  memories: Array<{ memory_id: string; disposition: 'remembered' | 'forgotten'; provenance_event_id: string; digest: string; created_at: string }>
  last_command?: QcgDevtoolsCommandStatus
}

export interface QcgDevtoolsBridge {
  getSanitizedSnapshot(): QcgDevtoolsSnapshot
  getPanelSnapshot(): Promise<QcgDevtoolsPanelSnapshot>
  getCachedPanelSnapshot(): QcgDevtoolsPanelSnapshot
  appendHumanMessage(input: { summary: string; evidence_refs?: string[]; confidence?: 'high' | 'medium' | 'low' }): Promise<QcgDebugMessage>
  acknowledgeHumanReview(eventId: string): Promise<QcgDebugMessage>
  queueHumanMessage(input: { summary: string }): QcgDevtoolsQueueResult
  queueHumanReviewAcknowledgement(eventId: string): QcgDevtoolsQueueResult
  queueHumanReviewDisposition(eventId: string, disposition: HumanReviewDisposition): QcgDevtoolsQueueResult
  queueHumanMemory(eventId: string, disposition: HumanMemoryDisposition, content?: string): QcgDevtoolsQueueResult
  createGeminiManualHandoff(input: { intent: CollaborationIntent; prompt: string; evidence_refs?: string[] }): GeminiManualHandoff
  previewGeminiManualReply(raw: string): { accepted: boolean; summary?: string; error?: string }
  queueGeminiManualReply(raw: string): QcgDevtoolsQueueResult
}

export interface QcgConsoleBridgeV2 extends ConsoleTransport {
  getSnapshot(): SanitizedConsoleSnapshotV2
  executeConsoleCommand(command: unknown): Promise<ConsoleCommandResultV1>
}

export interface QcgConsoleDecisionExecutor {
  (input: { recommendation_id: string; choice: 'accepted' | 'deferred' | 'overridden'; justification?: string }): Promise<void>
}

declare global { interface Window { __QCG_DEVTOOLS_V1__?: QcgDevtoolsBridge; __QCG_CONSOLE_V2__?: QcgConsoleBridgeV2 } }

export function makeSanitizedSnapshot(state: QcgState, storageMode: 'indexeddb' | 'memory' = 'memory'): QcgDevtoolsSnapshot {
  return {
    schema_version: 'qcg-devtools-context.v1', phase: state.phase, authority_state: state.authority_state,
    artifact: state.manifest ? { id: state.manifest.artifact_id, digest: state.manifest.artifact_digest, compiler: state.manifest.compiler.status } : undefined,
    recommendation: state.recommendation ? { id: state.recommendation.recommendation_id, decision: state.recommendation.decision, confidence: state.recommendation.confidence, reason_codes: [...state.recommendation.reason_codes], expires_at: state.recommendation.expires_at } : undefined,
    effects: { ...state.effects }, receipt: state.receipt ? { id: state.receipt.receipt_id, digest: state.receipt.digest } : undefined, storage_mode: storageMode
  }
}

export function installQcgDevtoolsBridge(
  getState: () => QcgState,
  ledger: DebugLedger,
  sessionId: string,
  options: { executeHumanDecision?: QcgConsoleDecisionExecutor } = {}
): () => void {
  let lastCommand: QcgDevtoolsCommandStatus | undefined
  const queuedReviewIds = new Set<string>()
  let cached: QcgDevtoolsPanelSnapshot = {
    ...makeSanitizedSnapshot(getState(), ledger.storageMode),
    session_id: sessionId,
    messages: [],
    participants: [],
    human_review_requests: [],
    memories: [],
    last_command: undefined
  }
  const refreshCache = async (): Promise<QcgDevtoolsPanelSnapshot> => {
    const session = await ledger.openSession(sessionId)
    const messages = session.messages
    const participants = [...new Map(messages.map((message) => [`${message.actor}:${message.role}`, { actor: message.actor, role: message.role }])).values()]
    const acknowledged = new Set(messages
      .filter((message) => message.actor === 'human' && message.kind === 'receipt' && (message.status === 'acknowledged' || message.status === 'resolved'))
      .flatMap((message) => message.evidence_refs.filter((reference) => reference.startsWith('debug-event:')).map((reference) => reference.slice('debug-event:'.length))))
    cached = {
      ...makeSanitizedSnapshot(getState(), ledger.storageMode),
      session_id: sessionId,
      messages,
      participants,
      human_review_requests: messages.filter((message) => message.kind === 'decision_request' && message.status !== 'resolved' && !acknowledged.has(message.event_id)),
      memories: (session.memories ?? []).map(({ content: _content, ...memory }) => memory),
      last_command: lastCommand
    }
    return structuredClone(cached)
  }
  const unsubscribe = ledger.subscribe(() => { void refreshCache() })
  void refreshCache()
  const bridge: QcgDevtoolsBridge = {
    getSanitizedSnapshot: () => makeSanitizedSnapshot(getState(), ledger.storageMode),
    getPanelSnapshot: refreshCache,
    getCachedPanelSnapshot: () => ({ ...structuredClone(cached), ...makeSanitizedSnapshot(getState(), ledger.storageMode) }),
    appendHumanMessage: async ({ summary, evidence_refs = [], confidence = 'medium' }) => {
      const message = await ledger.append({
        schema_version: 'qcg-debug-message.v1', session_id: sessionId, actor: 'human', role: 'operator', kind: 'observation', summary,
        evidence_refs, confidence, status: 'open', identity_assurance: 'declared'
      })
      await refreshCache()
      return message
    },
    acknowledgeHumanReview: async (eventId) => {
      const message = await ledger.acknowledge(sessionId, eventId)
      await refreshCache()
      return message
    },
    queueHumanMessage: ({ summary }) => {
      try {
        const draft = debugMessageDraft.parse({
          schema_version: 'qcg-debug-message.v1', session_id: sessionId, actor: 'human', role: 'operator', kind: 'observation', summary,
          evidence_refs: [], confidence: 'medium', status: 'open', identity_assurance: 'declared'
        })
        return queueCommand(() => ledger.append(draft), 'Human collaboration message')
      } catch {
        return { accepted: false, error: 'The message violates the bounded collaboration contract.' }
      }
    },
    queueHumanReviewAcknowledgement: (eventId) => {
      if (queuedReviewIds.has(eventId)) {
        return { accepted: false, error: 'The human review acknowledgement is already queued.' }
      }
      if (!cached.human_review_requests.some((message) => message.event_id === eventId)) {
        return { accepted: false, error: 'The human review request is no longer active.' }
      }
      queuedReviewIds.add(eventId)
      return queueCommand(
        () => ledger.acknowledge(sessionId, eventId),
        'Human collaboration acknowledgement',
        () => queuedReviewIds.delete(eventId)
      )
    },
    queueHumanReviewDisposition: (eventId, disposition) => {
      if (!cached.human_review_requests.some((message) => message.event_id === eventId)) return { accepted: false, error: 'The human review request is no longer active.' }
      return queueCommand(() => ledger.applyHumanReview(sessionId, eventId, disposition), `Human review disposition (${disposition})`)
    },
    queueHumanMemory: (eventId, disposition, content) => {
      try {
        if (disposition === 'remember') safeDebugText(400).parse(content)
        return queueCommand(() => ledger.applyHumanMemory(sessionId, eventId, disposition, content), `Human memory disposition (${disposition})`)
      } catch { return { accepted: false, error: 'The memory summary violates the bounded collaboration contract.' } }
    },
    createGeminiManualHandoff: ({ intent, prompt, evidence_refs = [] }) => createGeminiManualHandoff({ session_id: sessionId, page_id: pageId(sessionId), intent, prompt, evidence_refs }),
    previewGeminiManualReply: (raw) => {
      try {
        const reply = geminiManualReply.parse(JSON.parse(raw))
        return { accepted: true, summary: `Untrusted ${reply.intent} reply preview: ${reply.summary}` }
      } catch { return { accepted: false, error: 'The Gemini reply is not a valid bounded handoff response.' } }
    },
    queueGeminiManualReply: (raw) => {
      try {
        const reply = geminiManualReply.parse(JSON.parse(raw))
        return queueCommand(() => ledger.append({
          schema_version: 'qcg-debug-message.v2', session_id: sessionId, page_id: pageId(sessionId), actor: 'gemini', role: 'native-manual-relay',
          intent: reply.intent, transport: 'native_gemini_manual', kind: 'observation', summary: reply.summary,
          evidence_refs: reply.evidence_refs, confidence: reply.confidence, status: 'open', identity_assurance: 'declared'
        }), 'Untrusted Gemini manual reply')
      } catch { return { accepted: false, error: 'The Gemini reply is not a valid bounded handoff response.' } }
    }
  }

  const reject = (message: string): ConsoleCommandResultV1 => ({ schema_version: 'qcg-console-command-result.v1', accepted: false, status: 'rejected', message })
  const queued = (message: string, result: QcgDevtoolsQueueResult): ConsoleCommandResultV1 => result.accepted
    ? { schema_version: 'qcg-console-command-result.v1', accepted: true, status: 'queued', message, command_id: result.command_id }
    : reject(result.error ?? 'The bounded console command was rejected.')
  const consoleBridge: QcgConsoleBridgeV2 = {
    // This bridge is hosted by the inspected page. Extension clients identify their own render surface.
    surface: 'web',
    getSnapshot: () => sanitizedConsoleSnapshot(getState(), sessionId, ledger.storageMode, 'web'),
    executeConsoleCommand: async (input) => {
      const parsed = safeConsoleCommand.safeParse(input)
      if (!parsed.success) return reject('The console command does not match qcg-console-command.v1.')
      const command = parsed.data
      if (command.session_id !== sessionId) return reject('The console command does not match the active session.')
      try {
        switch (command.kind) {
          case 'human_decision': {
            const recommendation = getState().recommendation
            if (!recommendation || recommendation.recommendation_id !== command.recommendation_id) return reject('The recommendation is not active in this session.')
            if (command.choice === 'overridden' && (!command.justification || command.justification.trim().length < 12)) return reject('An override requires at least 12 characters of justification.')
            if (!options.executeHumanDecision) return reject('This surface cannot apply a human decision.')
            await options.executeHumanDecision({ recommendation_id: command.recommendation_id, choice: command.choice, justification: command.justification?.trim() })
            return { schema_version: 'qcg-console-command-result.v1', accepted: true, status: 'completed', message: `Human decision ${command.choice} applied.` }
          }
          case 'human_review_disposition':
            return queued('Human review disposition queued.', bridge.queueHumanReviewDisposition(command.event_id, command.disposition))
          case 'human_memory_disposition':
            return queued('Human memory disposition queued.', bridge.queueHumanMemory(command.event_id, command.disposition, command.content))
          case 'human_message':
            return queued('Human message queued.', bridge.queueHumanMessage({ summary: command.summary }))
          case 'human_override_note':
            return queued('Human override note queued.', bridge.queueHumanMessage({ summary: `Override note: ${command.justification}` }))
          case 'gemini_manual_handoff_create': {
            const handoff = bridge.createGeminiManualHandoff({ intent: command.intent, prompt: command.prompt })
            return { schema_version: 'qcg-console-command-result.v1', accepted: true, status: 'completed', message: 'Gemini manual handoff created.', handoff: JSON.stringify(handoff) }
          }
          case 'gemini_manual_reply_preview': {
            const result = bridge.previewGeminiManualReply(command.raw)
            return result.accepted
              ? { schema_version: 'qcg-console-command-result.v1', accepted: true, status: 'completed', message: 'Gemini manual reply previewed as untrusted data.', preview: result.summary }
              : reject(result.error ?? 'The Gemini manual reply was rejected.')
          }
          case 'gemini_manual_reply_import':
            return queued('Gemini manual reply import queued.', bridge.queueGeminiManualReply(command.raw))
          case 'export_debug_handoff': {
            const exported = await ledger.export(sessionId)
            return { schema_version: 'qcg-console-command-result.v1', accepted: true, status: 'completed', message: 'Sanitized debug handoff exported.', handoff: exported }
          }
        }
      } catch {
        return reject('The console command failed safely.')
      }
    }
  }

  function queueCommand(work: () => Promise<unknown>, label: string, afterSettled?: () => void): QcgDevtoolsQueueResult {
    const commandId = crypto.randomUUID()
    lastCommand = { command_id: commandId, status: 'queued', message: `${label} queued.` }
    cached = { ...cached, last_command: lastCommand }
    void Promise.resolve().then(work).then(
      async () => {
        lastCommand = { command_id: commandId, status: 'completed', message: `${label} recorded.` }
        try { await refreshCache() } finally { afterSettled?.() }
      },
      async () => {
        lastCommand = { command_id: commandId, status: 'failed', message: `${label} failed safely.` }
        try { await refreshCache() } finally { afterSettled?.() }
      }
    ).catch(() => undefined)
    return { accepted: true, command_id: commandId }
  }
  window.__QCG_DEVTOOLS_V1__ = Object.freeze(bridge)
  window.__QCG_CONSOLE_V2__ = Object.freeze(consoleBridge)
  return () => {
    unsubscribe()
    if (window.__QCG_DEVTOOLS_V1__ === bridge) delete window.__QCG_DEVTOOLS_V1__
    if (window.__QCG_CONSOLE_V2__ === consoleBridge) delete window.__QCG_CONSOLE_V2__
  }
}

function pageId(sessionId: string): string { return `qcg-page:${sessionId}` }
