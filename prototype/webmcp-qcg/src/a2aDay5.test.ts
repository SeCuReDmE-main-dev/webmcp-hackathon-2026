// @vitest-environment node
import { afterEach, describe, expect, it } from 'vitest'
import { createInMemoryDebugLedger } from './debugLedger'
import { installQcgDevtoolsBridge } from './devtoolsBridge'
import { HandoffCoordinator } from './handoffCoordinator'
import { initialState } from './types'

const originalWindow = globalThis.window
const sessionId = '11111111-1111-4111-8111-111111111111'

afterEach(() => Object.defineProperty(globalThis, 'window', { configurable: true, value: originalWindow }))

describe('Day 5 A2A boundary', () => {
  it('routes solely from declared capabilities and always routes decisions to the human', () => {
    const coordinator = new HandoffCoordinator()
    const participants = [
      { actor: 'gemini' as const, role: 'zeta', capabilities: ['debug'] as const, transports: ['mcp_direct'] as const },
      { actor: 'codex' as const, role: 'alpha', capabilities: ['debug', 'find'] as const, transports: ['mcp_direct', 'native_gemini_manual'] as const }
    ]
    expect(coordinator.route('debug', 'mcp_direct', participants).next_actor).toBe('codex')
    expect(coordinator.route('decision', 'native_gemini_manual', participants)).toMatchObject({ next_actor: 'human', reason: 'human_decision_required' })
  })

  it('keeps at most fifty human memories and forget replaces content with a tombstone', async () => {
    const ledger = createInMemoryDebugLedger()
    await ledger.openSession(sessionId)
    const first = await ledger.append({ schema_version: 'qcg-debug-message.v1', session_id: sessionId, actor: 'human', role: 'operator', kind: 'observation', summary: 'Bounded memory candidate number zero.', evidence_refs: [], confidence: 'high', status: 'open', identity_assurance: 'declared' })
    const remembered = await ledger.applyHumanMemory(sessionId, first.event_id, 'remember', 'I confirmed the safe UI boundary.')
    expect(remembered.content).toContain('safe UI')
    const forgotten = await ledger.applyHumanMemory(sessionId, first.event_id, 'forget')
    expect(forgotten).not.toHaveProperty('content')
    for (let index = 1; index <= 50; index += 1) {
      const message = await ledger.append({ schema_version: 'qcg-debug-message.v1', session_id: sessionId, actor: 'human', role: 'operator', kind: 'observation', summary: `Bounded memory candidate number ${index}.`, evidence_refs: [], confidence: 'high', status: 'open', identity_assurance: 'declared' })
      await ledger.applyHumanMemory(sessionId, message.event_id, 'remember', `Human retained item ${index}.`)
    }
    const overflow = await ledger.append({ schema_version: 'qcg-debug-message.v1', session_id: sessionId, actor: 'human', role: 'operator', kind: 'observation', summary: 'Bounded memory candidate overflow.', evidence_refs: [], confidence: 'high', status: 'open', identity_assurance: 'declared' })
    await expect(ledger.applyHumanMemory(sessionId, overflow.event_id, 'remember', 'This item exceeds the bounded memory capacity.')).rejects.toThrow('limit')
    expect(JSON.stringify(await ledger.messages(sessionId))).not.toContain('I confirmed the safe UI boundary.')
  })

  it('previews then imports a native Gemini reply only as an untrusted ledger observation', async () => {
    Object.defineProperty(globalThis, 'window', { configurable: true, value: {} })
    const ledger = createInMemoryDebugLedger()
    await ledger.openSession(sessionId)
    const cleanup = installQcgDevtoolsBridge(initialState, ledger, sessionId)
    const bridge = globalThis.window.__QCG_DEVTOOLS_V1__!
    const packet = bridge.createGeminiManualHandoff({ intent: 'find', prompt: 'Find a bounded public reference.', evidence_refs: ['source:challenge-email'] })
    expect(packet.transport).toBe('native_gemini_manual')
    const raw = JSON.stringify({ schema_version: 'qcg-gemini-manual-reply.v1', handoff_id: packet.handoff_id, intent: 'find', summary: 'A public reference was identified.', evidence_refs: ['source:challenge-email'], confidence: 'medium' })
    expect(bridge.previewGeminiManualReply(raw).accepted).toBe(true)
    expect(bridge.queueGeminiManualReply(raw).accepted).toBe(true)
    await new Promise((resolve) => setTimeout(resolve, 0))
    const snapshot = await bridge.getPanelSnapshot()
    expect(snapshot.messages[0]).toMatchObject({ actor: 'gemini', transport: 'native_gemini_manual', intent: 'find' })
    expect(snapshot).not.toHaveProperty('consent')
    cleanup()
  })
})
