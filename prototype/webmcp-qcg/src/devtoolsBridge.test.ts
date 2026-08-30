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

  it('exposes a v2 snapshot without source or consent and rejects simulation-shaped commands', async () => {
    Object.defineProperty(globalThis, 'window', { configurable: true, value: {} })
    const sessionId = '11111111-1111-4111-8111-111111111111'
    const state = initialState()
    state.consent = { consent_id: 'private-consent', recommendation_id: '22222222-2222-4222-8222-222222222222', created_at: '2026-08-29T12:00:00.000Z', expires_at: '2026-08-29T12:01:00.000Z', used: false }
    const cleanup = installQcgDevtoolsBridge(() => state, createInMemoryDebugLedger(), sessionId)
    const bridge = globalThis.window.__QCG_CONSOLE_V2__!
    const snapshot = bridge.getSnapshot()
    expect(snapshot.schema_version).toBe('qcg-console-snapshot.v2')
    expect(JSON.stringify(snapshot)).not.toContain('private-consent')
    expect(JSON.stringify(snapshot)).not.toContain('source')
    const result = await bridge.executeConsoleCommand({ schema_version: 'qcg-console-command.v1', session_id: sessionId, kind: 'run_bounded_local_simulation' })
    expect(result.status).toBe('rejected')
    cleanup()
  })

  it('requires an active matching recommendation and a justified v2 override', async () => {
    Object.defineProperty(globalThis, 'window', { configurable: true, value: {} })
    const sessionId = '11111111-1111-4111-8111-111111111111'
    const recommendationId = '22222222-2222-4222-8222-222222222222'
    const state = initialState()
    state.recommendation = {
      schema_version: 'webmcp-qcg.recommendation.v2', recommendation_id: recommendationId, manifest_id: 'manifest', target_profile_id: 'qsharp-local-wasm', decision: 'recompile', reason_codes: [], unknowns: [], confidence: 'medium', safer_alternative: 'inspect', scientific_intent: 'test', observable: 'validity', parameters_digest: 'digest', requested_limits: { shots: 1, timeout_ms: 500, max_qubits: 1, target: 'local_simulator' }, reuse_key: 'key', expires_at: '2026-08-30T12:00:00.000Z', valid: true
    }
    const applied: string[] = []
    const cleanup = installQcgDevtoolsBridge(() => state, createInMemoryDebugLedger(), sessionId, { executeHumanDecision: async (input) => { applied.push(`${input.choice}:${input.justification}`) } })
    const bridge = globalThis.window.__QCG_CONSOLE_V2__!
    const shortOverride = await bridge.executeConsoleCommand({ schema_version: 'qcg-console-command.v1', session_id: sessionId, kind: 'human_decision', recommendation_id: recommendationId, choice: 'overridden', justification: 'too short' })
    expect(shortOverride.status).toBe('rejected')
    const accepted = await bridge.executeConsoleCommand({ schema_version: 'qcg-console-command.v1', session_id: sessionId, kind: 'human_decision', recommendation_id: recommendationId, choice: 'overridden', justification: 'Evidence contradicts this recommendation.' })
    expect(accepted.status).toBe('completed')
    expect(applied).toEqual(['overridden:Evidence contradicts this recommendation.'])
    cleanup()
  })
})
