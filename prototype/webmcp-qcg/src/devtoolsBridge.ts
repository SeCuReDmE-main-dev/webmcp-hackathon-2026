import type { QcgState } from './types'
import { DebugLedger } from './debugLedger'
import { debugMessageDraft, type QcgDebugMessage } from './debugContracts'

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
}

declare global { interface Window { __QCG_DEVTOOLS_V1__?: QcgDevtoolsBridge } }

export function makeSanitizedSnapshot(state: QcgState, storageMode: 'indexeddb' | 'memory' = 'memory'): QcgDevtoolsSnapshot {
  return {
    schema_version: 'qcg-devtools-context.v1', phase: state.phase, authority_state: state.authority_state,
    artifact: state.manifest ? { id: state.manifest.artifact_id, digest: state.manifest.artifact_digest, compiler: state.manifest.compiler.status } : undefined,
    recommendation: state.recommendation ? { id: state.recommendation.recommendation_id, decision: state.recommendation.decision, confidence: state.recommendation.confidence, reason_codes: [...state.recommendation.reason_codes], expires_at: state.recommendation.expires_at } : undefined,
    effects: { ...state.effects }, receipt: state.receipt ? { id: state.receipt.receipt_id, digest: state.receipt.digest } : undefined, storage_mode: storageMode
  }
}

export function installQcgDevtoolsBridge(getState: () => QcgState, ledger: DebugLedger, sessionId: string): () => void {
  let lastCommand: QcgDevtoolsCommandStatus | undefined
  const queuedReviewIds = new Set<string>()
  let cached: QcgDevtoolsPanelSnapshot = {
    ...makeSanitizedSnapshot(getState(), ledger.storageMode),
    session_id: sessionId,
    messages: [],
    participants: [],
    human_review_requests: [],
    last_command: undefined
  }
  const refreshCache = async (): Promise<QcgDevtoolsPanelSnapshot> => {
    const messages = await ledger.messages(sessionId)
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
  return () => {
    unsubscribe()
    if (window.__QCG_DEVTOOLS_V1__ === bridge) delete window.__QCG_DEVTOOLS_V1__
  }
}
