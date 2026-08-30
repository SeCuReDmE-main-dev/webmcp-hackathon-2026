import { createDebugMessage, anyQcgDebugMessage, type AnyDebugMessageDraft, type DebugMessageDraft, type HumanMemoryDisposition, type HumanReviewDisposition, type QcgDebugMessage } from './debugContracts'

const DB_NAME = 'qcg-debug-ledger.v1'
const STORE = 'sessions'
const MAX_MESSAGES = 200
const MAX_SESSIONS = 10
const SESSION_TTL_MS = 8 * 60 * 60 * 1000
const MAX_MEMORIES = 50

export interface DebugMemory {
  memory_id: string
  disposition: 'remembered' | 'forgotten'
  provenance_event_id: string
  content?: string
  digest: string
  created_at: string
}

export interface DebugReviewDisposition {
  event_id: string
  disposition: HumanReviewDisposition
  decided_at: string
}

export interface DebugSession {
  session_id: string
  created_at: string
  touched_at: string
  messages: QcgDebugMessage[]
  memories: DebugMemory[]
  review_dispositions: DebugReviewDisposition[]
}

export interface DebugLedgerBackend {
  storageMode: 'indexeddb' | 'memory'
  get(id: string): Promise<DebugSession | undefined>
  put(value: DebugSession): Promise<void>
  all(): Promise<DebugSession[]>
  delete(id: string): Promise<void>
}

class MemoryBackend implements DebugLedgerBackend {
  storageMode: 'memory' = 'memory'
  private readonly values = new Map<string, DebugSession>()
  async get(id: string) { return this.values.get(id) }
  async put(value: DebugSession) { this.values.set(value.session_id, structuredClone(value)) }
  async all() { return [...this.values.values()].map((value) => structuredClone(value)) }
  async delete(id: string) { this.values.delete(id) }
}

class IndexedDbBackend implements DebugLedgerBackend {
  storageMode: 'indexeddb' = 'indexeddb'
  private readonly database: Promise<IDBDatabase>
  constructor() {
    this.database = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1)
      request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'session_id' })
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }
  private async transaction<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
    const db = await this.database
    const transaction = db.transaction(STORE, mode)
    const request = fn(transaction.objectStore(STORE))
    return committedIdbRequest(transaction, request)
  }
  get(id: string) { return this.transaction('readonly', (store) => store.get(id)) }
  async put(value: DebugSession): Promise<void> { await this.transaction('readwrite', (store) => store.put(value)) }
  all() { return this.transaction('readonly', (store) => store.getAll()) }
  delete(id: string) { return this.transaction('readwrite', (store) => store.delete(id)) }
}

export function committedIdbRequest<T>(transaction: IDBTransaction, request: IDBRequest<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let requestSucceeded = false
    const failure = () => reject(transaction.error ?? request.error ?? new Error('IndexedDB transaction failed.'))
    request.onsuccess = () => { requestSucceeded = true }
    request.onerror = failure
    transaction.onerror = failure
    transaction.onabort = failure
    transaction.oncomplete = () => requestSucceeded ? resolve(request.result) : failure()
  })
}

export class ResilientBackend implements DebugLedgerBackend {
  private active: DebugLedgerBackend
  constructor(primary: DebugLedgerBackend, private readonly fallback = new MemoryBackend()) { this.active = primary }
  get storageMode() { return this.active.storageMode }
  private async use<T>(operation: (store: DebugLedgerBackend) => Promise<T>): Promise<T> {
    const selected = this.active
    try { return await operation(selected) } catch {
      if (selected === this.fallback) throw new Error('Debug ledger storage is unavailable.')
      if (this.active === selected) this.active = this.fallback
      return operation(this.fallback)
    }
  }
  get(id: string) { return this.use((store) => store.get(id)) }
  put(value: DebugSession) { return this.use((store) => store.put(value)) }
  all() { return this.use((store) => store.all()) }
  delete(id: string) { return this.use((store) => store.delete(id)) }
}

function backend(): DebugLedgerBackend {
  try { return typeof indexedDB === 'undefined' ? new MemoryBackend() : new ResilientBackend(new IndexedDbBackend()) } catch { return new MemoryBackend() }
}

export class DebugLedger {
  private readonly store: DebugLedgerBackend
  private writeTail: Promise<void> = Promise.resolve()
  private readonly listeners = new Set<() => void>()
  constructor(private readonly now = () => Date.now(), store?: DebugLedgerBackend) { this.store = store ?? backend() }
  get storageMode(): 'indexeddb' | 'memory' { return this.store.storageMode }

  async openSession(sessionId: string = crypto.randomUUID()): Promise<DebugSession> {
    const existing = await this.store.get(sessionId)
    if (existing) return structuredClone(existing)
    const timestamp = new Date(this.now()).toISOString()
    const session: DebugSession = { session_id: sessionId, created_at: timestamp, touched_at: timestamp, messages: [], memories: [], review_dispositions: [] }
    await this.store.put(session)
    await this.prune()
    this.notify()
    return structuredClone(session)
  }

  async append(draft: AnyDebugMessageDraft): Promise<QcgDebugMessage> {
    return this.inWriteOrder(() => this.appendUnlocked(draft))
  }

  async acknowledge(sessionId: string, eventId: string): Promise<QcgDebugMessage> {
    return this.inWriteOrder(async () => {
      const session = await this.store.get(sessionId)
      if (!session) throw new Error('Debug session is unknown.')
      const request = session.messages.find((entry) => entry.event_id === eventId && entry.kind === 'decision_request')
      if (!request) throw new Error('Human review request is unknown.')
      const reference = `debug-event:${eventId}`
      if (session.messages.some((entry) => entry.actor === 'human' && entry.kind === 'receipt' && entry.evidence_refs.includes(reference))) {
        throw new Error('Human review request is already acknowledged.')
      }
      return this.appendUnlocked({
        schema_version: 'qcg-debug-message.v1',
        session_id: sessionId,
        actor: 'human',
        role: 'operator',
        kind: 'receipt',
        summary: 'I acknowledged this collaboration request. Quantum authority remains unchanged.',
        evidence_refs: [reference],
        confidence: 'high',
        status: 'acknowledged',
        identity_assurance: 'declared'
      })
    })
  }

  async applyHumanReview(sessionId: string, eventId: string, disposition: HumanReviewDisposition): Promise<QcgDebugMessage> {
    return this.inWriteOrder(async () => {
      const session = await this.store.get(sessionId)
      if (!session || !session.messages.some((entry) => entry.event_id === eventId && entry.kind === 'decision_request')) throw new Error('Human review request is unknown.')
      session.review_dispositions ??= []
      if (session.review_dispositions.some((entry) => entry.event_id === eventId)) throw new Error('Human review request already has a disposition.')
      const reference = `debug-event:${eventId}`
      if (session.messages.some((entry) => entry.actor === 'human' && entry.kind === 'receipt' && entry.evidence_refs.includes(reference))) throw new Error('Human review request already has a disposition.')
      const receipt = await this.appendUnlocked({
        schema_version: 'qcg-debug-message.v1', session_id: sessionId, actor: 'human', role: 'operator', kind: 'receipt',
        summary: `Human review disposition recorded: ${disposition}. Collaboration authority remains separate from quantum authority.`,
        evidence_refs: [reference], confidence: 'high', status: disposition === 'approve' ? 'acknowledged' : 'resolved', identity_assurance: 'declared'
      })
      const updated = await this.store.get(sessionId)
      if (updated) {
        updated.review_dispositions ??= []
        updated.review_dispositions.push({ event_id: eventId, disposition, decided_at: receipt.issued_at })
        await this.store.put(updated)
      }
      return receipt
    })
  }

  async applyHumanMemory(sessionId: string, eventId: string, disposition: HumanMemoryDisposition, content?: string): Promise<DebugMemory> {
    return this.inWriteOrder(async () => {
      const session = await this.store.get(sessionId)
      if (!session || !session.messages.some((entry) => entry.event_id === eventId)) throw new Error('Memory provenance event is unknown.')
      session.memories ??= []
      const existing = session.memories.find((entry) => entry.provenance_event_id === eventId)
      if (disposition === 'remember') {
        if (!content) throw new Error('A bounded memory summary is required.')
        if (existing) throw new Error('Memory provenance is already recorded.')
        if (session.memories.filter((entry) => entry.disposition === 'remembered').length >= MAX_MEMORIES) throw new Error('Human memory limit reached.')
        const memory: DebugMemory = { memory_id: crypto.randomUUID(), disposition: 'remembered', provenance_event_id: eventId, content, digest: digest(content), created_at: new Date(this.now()).toISOString() }
        session.memories.push(memory)
        session.touched_at = memory.created_at
        await this.store.put(session)
        this.notify()
        return structuredClone(memory)
      }
      if (!existing) throw new Error('Only a recorded memory can be forgotten.')
      const tombstone: DebugMemory = { memory_id: existing.memory_id, disposition: 'forgotten', provenance_event_id: eventId, digest: existing.digest, created_at: new Date(this.now()).toISOString() }
      session.memories = session.memories.map((entry) => entry.memory_id === existing.memory_id ? tombstone : entry)
      session.touched_at = tombstone.created_at
      await this.store.put(session)
      this.notify()
      return structuredClone(tombstone)
    })
  }

  async messages(sessionId: string): Promise<QcgDebugMessage[]> {
    const session = await this.store.get(sessionId)
    return session ? structuredClone(session.messages) : []
  }

  async export(sessionId: string): Promise<string> {
    const session = await this.store.get(sessionId)
    if (!session) throw new Error('Debug session is unknown.')
    return JSON.stringify({ schema_version: 'qcg-debug-handoff.v2', session_id: sessionId, messages: session.messages, review_dispositions: session.review_dispositions ?? [], memories: (session.memories ?? []).map(({ content: _content, ...memory }) => memory) }, null, 2)
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private async prune(): Promise<void> {
    const sessions = (await this.store.all()).sort((a, b) => a.touched_at.localeCompare(b.touched_at))
    await Promise.all(sessions.slice(0, Math.max(0, sessions.length - MAX_SESSIONS)).map((entry) => this.store.delete(entry.session_id)))
  }

  private async appendUnlocked(draft: AnyDebugMessageDraft): Promise<QcgDebugMessage> {
    const session = await this.store.get(draft.session_id)
    if (!session) throw new Error('Debug session is unknown or stale.')
    if (this.now() - new Date(session.touched_at).getTime() > SESSION_TTL_MS) throw new Error('Debug session is stale.')
    if (session.messages.some((entry) => entry.event_id === draft.event_id)) throw new Error('Duplicate debug event ID.')
    if (session.messages.length >= MAX_MESSAGES) throw new Error('Debug session message limit reached.')
    const message = createDebugMessage(draft, session.messages.length + 1, new Date(this.now()))
    session.messages.push(anyQcgDebugMessage.parse(message))
    session.touched_at = message.issued_at
    await this.store.put(session)
    this.notify()
    return structuredClone(message)
  }

  private inWriteOrder<T>(work: () => Promise<T>): Promise<T> {
    const next = this.writeTail.then(work, work)
    this.writeTail = next.then(() => undefined, () => undefined)
    return next
  }

  private notify(): void {
    for (const listener of this.listeners) listener()
  }
}

export function createInMemoryDebugLedger(now?: () => number): DebugLedger {
  return new DebugLedger(now ?? (() => Date.now()), new MemoryBackend())
}

function digest(value: string): string {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) hash = Math.imul(hash ^ value.charCodeAt(index), 16777619)
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`
}
