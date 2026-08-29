// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createDebugMessage, qcgDebugMessage } from './debugContracts'
import { committedIdbRequest, createInMemoryDebugLedger, ResilientBackend, type DebugLedgerBackend } from './debugLedger'

const sessionId = '11111111-1111-4111-8111-111111111111'
const eventId = '22222222-2222-4222-8222-222222222222'
const draft = () => ({ schema_version: 'qcg-debug-message.v1' as const, session_id: sessionId, actor: 'human' as const, role: 'operator', kind: 'observation' as const, summary: 'The browser-visible recommendation needs a human review.', evidence_refs: ['receipt:bounded'], confidence: 'medium' as const, status: 'open' as const, identity_assurance: 'declared' as const, event_id: eventId })

describe('qcg-debug-message.v1', () => {
  it('requires the declared identity contract and rejects unknown fields', () => {
    const message = createDebugMessage(draft(), 1, new Date('2026-08-29T12:00:00.000Z'))
    expect(message.summary).toContain('human review')
    expect(() => qcgDebugMessage.parse({ ...message, extra: true })).toThrow()
    expect(() => qcgDebugMessage.parse({ ...message, identity_assurance: 'verified' })).toThrow()
  })

  it('rejects secrets, paths, raw Q#, stacks and network bodies', () => {
    const credentialFixtures = [
      ['gh', 'p_', '12345678901234567890'].join(''),
      ['github', '_pat_', '123456789012345678901234567890'].join(''),
      ['sk', '_live_', '12345678901234567890'].join(''),
      ['xox', 'b-', '1234567890-1234567890'].join(''),
      ['npm', '_', '123456789012345678901234'].join(''),
      ['AK', 'IA', '1234567890ABCDEF'].join(''),
      ['eyJabcdefgh', 'eyJabcdefgh', 'eyJabcdefgh'].join('.'),
      ['-----BEGIN ', 'PRIVATE KEY-----'].join('')
    ]
    for (const summary of ['api_key=abc', ...credentialFixtures, 'C:\\Users\\me\\artifact.qs', '/etc/passwd', '/root/.ssh/id_rsa', '/opt/app/private/config.json', 'operation Main() : Result[] {}', 'use q = Qubit(); H(q);', 'let shots = 64;', 'H(q);', 'Error: boom at page.ts:1:1', 'response body: {"payload":"x"}']) {
      expect(() => createDebugMessage({ ...draft(), event_id: crypto.randomUUID(), summary }, 1)).toThrow()
    }
    expect(() => createDebugMessage({ ...draft(), event_id: crypto.randomUUID(), evidence_refs: ['C:\\private\\proof'] }, 1)).toThrow()
  })

  it('normalizes Unicode and rejects invisible control or bidi manipulation', () => {
    const normalized = createDebugMessage({ ...draft(), event_id: crypto.randomUUID(), summary: 'Cafe\u0301 review' }, 1)
    expect(normalized.summary).toBe('Café review')
    for (const summary of ['safe\u0000hidden', 'safe\u001b[31mred', 'left\u202Etxt', 'agent\u2066spoof\u2069']) {
      expect(() => createDebugMessage({ ...draft(), event_id: crypto.randomUUID(), summary }, 1)).toThrow()
    }
  })

  it('rejects duplicate IDs and stale sessions while retaining a bounded isolated ledger', async () => {
    let now = Date.parse('2026-08-29T12:00:00.000Z')
    const ledger = createInMemoryDebugLedger(() => now)
    await ledger.openSession(sessionId)
    expect((await ledger.append(draft())).sequence).toBe(1)
    await expect(ledger.append(draft())).rejects.toThrow('Duplicate')
    now += 8 * 60 * 60 * 1000 + 1
    await expect(ledger.append({ ...draft(), event_id: crypto.randomUUID() })).rejects.toThrow('stale')
  })

  it('records human acknowledgement as an append-only receipt without granting authority', async () => {
    const ledger = createInMemoryDebugLedger(() => Date.parse('2026-08-29T12:00:00.000Z'))
    await ledger.openSession(sessionId)
    const request = await ledger.append({ ...draft(), event_id: crypto.randomUUID(), actor: 'gemini', role: 'browser-reviewer', kind: 'decision_request' })
    const acknowledgement = await ledger.acknowledge(sessionId, request.event_id)
    expect(acknowledgement.actor).toBe('human')
    expect(acknowledgement.kind).toBe('receipt')
    expect(acknowledgement.status).toBe('acknowledged')
    expect(acknowledgement.evidence_refs).toContain(`debug-event:${request.event_id}`)
  })

  it('serializes concurrent acknowledgements so one request produces one human receipt', async () => {
    const ledger = createInMemoryDebugLedger(() => Date.parse('2026-08-29T12:00:00.000Z'))
    await ledger.openSession(sessionId)
    const request = await ledger.append({ ...draft(), event_id: crypto.randomUUID(), actor: 'gemini', role: 'browser-reviewer', kind: 'decision_request' })
    const results = await Promise.allSettled([
      ledger.acknowledge(sessionId, request.event_id),
      ledger.acknowledge(sessionId, request.event_id)
    ])
    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1)
    expect(results.filter((result) => result.status === 'rejected')).toHaveLength(1)
    const receipts = (await ledger.messages(sessionId)).filter((message) => message.actor === 'human' && message.kind === 'receipt')
    expect(receipts).toHaveLength(1)
  })

  it('routes every already-in-flight primary failure to the memory fallback', async () => {
    const failingPrimary: DebugLedgerBackend = {
      storageMode: 'indexeddb',
      get: async () => { await Promise.resolve(); throw new Error('IndexedDB unavailable') },
      put: async () => { throw new Error('IndexedDB unavailable') },
      all: async () => { throw new Error('IndexedDB unavailable') },
      delete: async () => { throw new Error('IndexedDB unavailable') }
    }
    const resilient = new ResilientBackend(failingPrimary)
    const reads = await Promise.allSettled([resilient.get('first'), resilient.get('second')])
    expect(reads.map((result) => result.status)).toEqual(['fulfilled', 'fulfilled'])
    expect(resilient.storageMode).toBe('memory')
  })

  it('reports an IndexedDB write only after its transaction commits', async () => {
    const transaction = {} as IDBTransaction
    const request = { result: 'stored', error: null } as unknown as IDBRequest<string>
    let settled = false
    const committed = committedIdbRequest(transaction, request).then((value) => { settled = true; return value })
    request.onsuccess?.(new Event('success') as Event & { target: IDBRequest<string> })
    await Promise.resolve()
    expect(settled).toBe(false)
    transaction.oncomplete?.(new Event('complete') as Event & { target: IDBTransaction })
    await expect(committed).resolves.toBe('stored')
  })
})
