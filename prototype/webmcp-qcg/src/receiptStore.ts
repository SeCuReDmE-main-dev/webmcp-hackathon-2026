import { convertV1Receipt, convertV2Receipt } from './migrations'
import type { EvidenceReceipt } from './types'

const DB_NAME = 'webmcp-qcg'
const STORE_NAME = 'evidence-receipts'
const DB_VERSION = 1

function openDatabase(): Promise<IDBDatabase | null> {
  if (!('indexedDB' in globalThis)) return Promise.resolve(null)
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    let database: IDBDatabase | undefined
    let settled = false
    const close = (): void => {
      try { database?.close() } catch { /* closing an incomplete connection is best-effort */ }
    }
    const captureResult = (): IDBDatabase | undefined => {
      try { return request.result } catch { return undefined }
    }
    const fail = (message: string): void => {
      if (settled) return
      settled = true
      database ??= captureResult()
      close()
      reject(new Error(message))
    }
    request.onupgradeneeded = () => {
      database = captureResult()
      if (!database) { fail('The local evidence database could not be opened.'); return }
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'receipt_id' })
      }
    }
    request.onsuccess = () => {
      database = captureResult()
      if (!database) { fail('The local evidence database could not be opened.'); return }
      if (settled) { close(); return }
      settled = true
      database.onversionchange = () => close()
      resolve(database)
    }
    request.onblocked = () => fail('The local evidence database is blocked by another open tab. Close or reload that tab, then retry.')
    request.onerror = () => fail('The local evidence database could not be opened.')
  })
}

export async function saveReceipt(receipt: EvidenceReceipt): Promise<void> {
  const database = await openDatabase()
  if (!database) return
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    transaction.objectStore(STORE_NAME).put(receipt)
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(new Error('The local evidence receipt could not be saved.'))
  }).finally(() => database.close())
}

export async function readReceipts(): Promise<EvidenceReceipt[]> {
  const database = await openDatabase()
  if (!database) return []
  const values = await new Promise<unknown[]>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly')
    const request = transaction.objectStore(STORE_NAME).getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(new Error('The local evidence receipts could not be read.'))
  }).finally(() => database.close())
  const receipts: EvidenceReceipt[] = []
  for (const value of values) {
    if ((value as EvidenceReceipt)?.schema_version === 'webmcp-qcg.evidence-receipt.v3') {
      receipts.push(value as EvidenceReceipt)
      continue
    }
    const v2 = await convertV2Receipt(value)
    if (v2) {
      receipts.push(v2)
      continue
    }
    const converted = await convertV1Receipt(value)
    if (converted) receipts.push(converted)
  }
  return receipts.sort((left, right) => right.updated_at.localeCompare(left.updated_at))
}
