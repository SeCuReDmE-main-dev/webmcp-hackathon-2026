// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createInMemoryDebugLedger } from './debugLedger'
import { registerQcgDevtoolsTools } from './devtoolsTools'

const sessionId = '11111111-1111-4111-8111-111111111111'
const originalWindow = globalThis.window

afterEach(() => Object.defineProperty(globalThis, 'window', { configurable: true, value: originalWindow }))

describe('third-party DevTools discovery lifecycle', () => {
  it('registers only the four narrow collaboration tools', async () => {
    const events = new EventTarget()
    Object.defineProperty(globalThis, 'window', { configurable: true, value: { addEventListener: events.addEventListener.bind(events), removeEventListener: events.removeEventListener.bind(events), dispatchEvent: events.dispatchEvent.bind(events) } })
    const ledger = createInMemoryDebugLedger()
    await ledger.openSession(sessionId)
    const bridge = {
      getSanitizedSnapshot: () => ({ schema_version: 'qcg-devtools-context.v1' as const, phase: 'empty' as const, authority_state: 'ready' as const, storage_mode: 'memory' as const, effects: { inspections: 0, evaluations: 0, local_simulations: 0, metadata_validations: 0, qpu_submissions: 0 as const, evidence_exports: 0 } }),
      getPanelSnapshot: async () => ({ schema_version: 'qcg-devtools-context.v1' as const, phase: 'empty' as const, authority_state: 'ready' as const, storage_mode: 'memory' as const, session_id: sessionId, effects: { inspections: 0, evaluations: 0, local_simulations: 0, metadata_validations: 0, qpu_submissions: 0 as const, evidence_exports: 0 }, messages: [], participants: [], human_review_requests: [], memories: [] }),
      getCachedPanelSnapshot: () => ({ schema_version: 'qcg-devtools-context.v1' as const, phase: 'empty' as const, authority_state: 'ready' as const, storage_mode: 'memory' as const, session_id: sessionId, effects: { inspections: 0, evaluations: 0, local_simulations: 0, metadata_validations: 0, qpu_submissions: 0 as const, evidence_exports: 0 }, messages: [], participants: [], human_review_requests: [], memories: [] }),
      appendHumanMessage: vi.fn(),
      acknowledgeHumanReview: vi.fn(),
      queueHumanMessage: vi.fn(),
      queueHumanReviewAcknowledgement: vi.fn(), queueHumanReviewDisposition: vi.fn(), queueHumanMemory: vi.fn(), createGeminiManualHandoff: vi.fn(), previewGeminiManualReply: vi.fn(), queueGeminiManualReply: vi.fn()
    }
    const cleanup = registerQcgDevtoolsTools(bridge, ledger)
    const discovery = Object.assign(new Event('devtoolstooldiscovery'), { respondWith: vi.fn() })
    events.dispatchEvent(discovery)
    const group = discovery.respondWith.mock.calls[0][0]
    expect(group.tools.map((tool: { name: string }) => tool.name)).toEqual(['read_debug_context', 'post_debug_message', 'request_human_review', 'export_debug_handoff'])
    const read = group.tools[0]
    expect(await read.execute({})).not.toHaveProperty('consent')
    const post = group.tools[1]
    await post.execute({ schema_version: 'qcg-debug-message.v2', session_id: sessionId, page_id: `qcg-page:${sessionId}`, transport: 'mcp_direct', intent: 'debug', actor: 'codex', role: 'reviewer', kind: 'observation', summary: 'The visible state remains bounded.', evidence_refs: [], confidence: 'high', status: 'open', identity_assurance: 'declared' })
    expect((await ledger.messages(sessionId))).toHaveLength(1)
    await expect(post.execute({ schema_version: 'qcg-debug-message.v2', session_id: sessionId, page_id: `qcg-page:${sessionId}`, transport: 'mcp_direct', intent: 'debug', actor: 'codex', role: 'reviewer', kind: 'observation', summary: 'Caller-owned metadata must be rejected.', evidence_refs: [], confidence: 'high', status: 'open', identity_assurance: 'declared', event_id: crypto.randomUUID(), issued_at: '2099-01-01T00:00:00.000Z' })).rejects.toThrow()
    await expect(post.execute({ schema_version: 'qcg-debug-message.v2', session_id: crypto.randomUUID(), page_id: 'qcg-page:test', transport: 'mcp_direct', intent: 'debug', actor: 'codex', role: 'reviewer', kind: 'observation', summary: 'A cross-session write attempt.', evidence_refs: [], confidence: 'high', status: 'open', identity_assurance: 'declared' })).rejects.toThrow('active QCG page session')
    const exported = await group.tools[3].execute({})
    expect(JSON.parse(exported).session_id).toBe(sessionId)
    await expect(read.execute({ unexpected: true })).rejects.toThrow('empty object')
    cleanup()
  })

  it('records a declared Codex to Gemini to human exchange without changing quantum authority', async () => {
    const events = new EventTarget()
    Object.defineProperty(globalThis, 'window', { configurable: true, value: { addEventListener: events.addEventListener.bind(events), removeEventListener: events.removeEventListener.bind(events), dispatchEvent: events.dispatchEvent.bind(events) } })
    const ledger = createInMemoryDebugLedger()
    await ledger.openSession(sessionId)
    const authority = { phase: 'empty' as const, authority_state: 'ready' as const, effects: { inspections: 0, evaluations: 0, local_simulations: 0, metadata_validations: 0, qpu_submissions: 0 as const, evidence_exports: 0 } }
    const panel = async () => ({ schema_version: 'qcg-devtools-context.v1' as const, ...authority, storage_mode: 'memory' as const, session_id: sessionId, messages: await ledger.messages(sessionId), participants: [], human_review_requests: [], memories: [] })
    const bridge = {
      getSanitizedSnapshot: () => ({ schema_version: 'qcg-devtools-context.v1' as const, ...authority, storage_mode: 'memory' as const }),
      getPanelSnapshot: panel,
      getCachedPanelSnapshot: () => ({ schema_version: 'qcg-devtools-context.v1' as const, ...authority, storage_mode: 'memory' as const, session_id: sessionId, messages: [], participants: [], human_review_requests: [], memories: [] }),
      appendHumanMessage: vi.fn(),
      acknowledgeHumanReview: (eventId: string) => ledger.acknowledge(sessionId, eventId),
      queueHumanMessage: vi.fn(),
      queueHumanReviewAcknowledgement: vi.fn(), queueHumanReviewDisposition: vi.fn(), queueHumanMemory: vi.fn(), createGeminiManualHandoff: vi.fn(), previewGeminiManualReply: vi.fn(), queueGeminiManualReply: vi.fn()
    }
    const cleanup = registerQcgDevtoolsTools(bridge, ledger)
    const discovery = Object.assign(new Event('devtoolstooldiscovery'), { respondWith: vi.fn() })
    events.dispatchEvent(discovery)
    const tools = Object.fromEntries(discovery.respondWith.mock.calls[0][0].tools.map((tool: { name: string }) => [tool.name, tool]))
    const base = { schema_version: 'qcg-debug-message.v2', session_id: sessionId, page_id: `qcg-page:${sessionId}`, transport: 'mcp_direct', intent: 'debug', evidence_refs: ['receipt:seasonal-runtime'], confidence: 'high', status: 'open', identity_assurance: 'declared' }
    await tools.post_debug_message.execute({ ...base, actor: 'codex', role: 'code-reviewer', kind: 'observation', summary: 'The authority boundary remains intact.' })
    await tools.post_debug_message.execute({ ...base, actor: 'gemini', role: 'browser-reviewer', kind: 'observation', summary: 'Counter-analysis confirms that no consent control crosses the bridge.' })
    const request = await tools.request_human_review.execute({ ...base, actor: 'gemini', role: 'browser-reviewer', kind: 'decision_request', summary: 'Please acknowledge the collaboration receipt only.', requested_action: 'Acknowledge this debug request.' })
    await bridge.acknowledgeHumanReview(request.event_id)
    const messages = await ledger.messages(sessionId)
    expect(messages.map((message) => message.actor)).toEqual(['codex', 'gemini', 'gemini', 'human'])
    expect(messages.map((message) => message.sequence)).toEqual([1, 2, 3, 4])
    expect(bridge.getSanitizedSnapshot().authority_state).toBe('ready')
    expect(bridge.getSanitizedSnapshot().effects.qpu_submissions).toBe(0)
    cleanup()
  })
})
