// @vitest-environment node
import { afterEach, describe, expect, it } from 'vitest'
import { installQcgDevtoolsBridge, makeSanitizedSnapshot } from './devtoolsBridge'
import { createInMemoryDebugLedger } from './debugLedger'
import { initialState } from './types'

const originalWindow = globalThis.window

afterEach(() => Object.defineProperty(globalThis, 'window', { configurable: true, value: originalWindow }))

describe('QCG DevTools bridge authority boundary', () => {
  it('returns a purpose-built sanitized snapshot with no consent or simulation authority', () => {
    const state = initialState()
    state.consent = { consent_id: 'private-consent', recommendation_id: 'recommendation', created_at: '2026-08-29T12:00:00.000Z', expires_at: '2026-08-29T12:01:00.000Z', used: false }
    const snapshot = makeSanitizedSnapshot(state)
    expect(snapshot).not.toHaveProperty('consent')
    expect(snapshot).not.toHaveProperty('simulate')
    expect(JSON.stringify(snapshot)).not.toContain('private-consent')
  })

  it('validates panel commands synchronously and reports asynchronous completion', async () => {
    Object.defineProperty(globalThis, 'window', { configurable: true, value: {} })
    const sessionId = '11111111-1111-4111-8111-111111111111'
    const ledger = createInMemoryDebugLedger()
    await ledger.openSession(sessionId)
    const cleanup = installQcgDevtoolsBridge(initialState, ledger, sessionId)
    const bridge = globalThis.window.__QCG_DEVTOOLS_V1__!
    expect(bridge.queueHumanMessage({ summary: 'C:\\Users\\private\\artifact.qs' }).accepted).toBe(false)
    const queued = bridge.queueHumanMessage({ summary: 'I reviewed the visible bounded recommendation.' })
    expect(queued.accepted).toBe(true)
    await new Promise((resolve) => setTimeout(resolve, 0))
    const snapshot = await bridge.getPanelSnapshot()
    expect(snapshot.messages).toHaveLength(1)
    expect(snapshot.last_command?.status).toBe('completed')
    cleanup()
  })

  it('accepts one acknowledgement command per active review request', async () => {
    Object.defineProperty(globalThis, 'window', { configurable: true, value: {} })
    const sessionId = '11111111-1111-4111-8111-111111111111'
    const ledger = createInMemoryDebugLedger()
    await ledger.openSession(sessionId)
    const request = await ledger.append({
      schema_version: 'qcg-debug-message.v1', session_id: sessionId, actor: 'gemini', role: 'browser-reviewer', kind: 'decision_request',
      summary: 'Review this bounded observation.', evidence_refs: ['test:review-request'], confidence: 'medium', status: 'open', identity_assurance: 'declared'
    })
    const cleanup = installQcgDevtoolsBridge(initialState, ledger, sessionId)
    const bridge = globalThis.window.__QCG_DEVTOOLS_V1__!
    await bridge.getPanelSnapshot()
    expect(bridge.queueHumanReviewAcknowledgement(request.event_id).accepted).toBe(true)
    expect(bridge.queueHumanReviewAcknowledgement(request.event_id).accepted).toBe(false)
    await new Promise((resolve) => setTimeout(resolve, 0))
    const snapshot = await bridge.getPanelSnapshot()
    expect(snapshot.last_command?.status).toBe('completed')
    expect(snapshot.messages.filter((message) => message.actor === 'human' && message.kind === 'receipt')).toHaveLength(1)
    cleanup()
  })
})
