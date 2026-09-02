import { afterEach, describe, expect, it, vi } from 'vitest'
import { readReceipts } from './receiptStore'

const originalIndexedDb = globalThis.indexedDB

afterEach(() => Object.defineProperty(globalThis, 'indexedDB', { configurable: true, value: originalIndexedDb }))

describe('local evidence database recovery', () => {
  it('rejects safely when a blocked request has no readable database result yet', async () => {
    const blocked = { onupgradeneeded: null, onsuccess: null, onblocked: null, onerror: null } as unknown as IDBOpenDBRequest
    Object.defineProperty(blocked, 'result', { get: () => { throw new DOMException('not ready', 'InvalidStateError') } })
    Object.defineProperty(globalThis, 'indexedDB', { configurable: true, value: { open: () => blocked } })
    const pending = readReceipts()
    expect(() => blocked.onblocked!(new Event('blocked') as IDBVersionChangeEvent)).not.toThrow()
    await expect(pending).rejects.toThrow('blocked by another open tab')
  })

  it('closes a blocked open request and allows a later bounded recovery attempt', async () => {
    const close = vi.fn()
    const getAll = { result: [] as unknown[], onsuccess: null as (() => void) | null }
    const database = {
      close,
      objectStoreNames: { contains: () => true },
      transaction: () => ({ objectStore: () => ({ getAll: () => getAll }) })
    } as unknown as IDBDatabase
    const blocked = { result: database, onupgradeneeded: null, onsuccess: null, onblocked: null, onerror: null } as unknown as IDBOpenDBRequest
    const recovered = { result: database, onupgradeneeded: null, onsuccess: null, onblocked: null, onerror: null } as unknown as IDBOpenDBRequest
    const open = vi.fn().mockReturnValueOnce(blocked).mockReturnValueOnce(recovered)
    Object.defineProperty(globalThis, 'indexedDB', { configurable: true, value: { open } })

    const first = readReceipts()
    blocked.onblocked!(new Event('blocked') as IDBVersionChangeEvent)
    await expect(first).rejects.toThrow('blocked by another open tab')
    expect(close).toHaveBeenCalledTimes(1)

    const second = readReceipts()
    recovered.onsuccess!(new Event('success') as IDBVersionChangeEvent)
    await Promise.resolve()
    getAll.onsuccess!()
    await expect(second).resolves.toEqual([])
    expect(open).toHaveBeenCalledTimes(2)
    expect(close).toHaveBeenCalledTimes(2)
  })
})
