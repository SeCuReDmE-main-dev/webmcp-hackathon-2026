import { convertV1Receipt } from './migrations'
import type { EvidenceReceipt } from './types'

const DB_NAME = 'webmcp-qcg'
const STORE_NAME = 'evidence-receipts'
const DB_VERSION = 1

function openDatabase(): Promise<IDBDatabase | null> {
  if (!('indexedDB' in globalThis)) return Promise.resolve(null)
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'receipt_id' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(new Error('The local evidence database could not be opened.'))
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
    if ((value as EvidenceReceipt)?.schema_version === 'webmcp-qcg.evidence-receipt.v2') {
      receipts.push(value as EvidenceReceipt)
      continue
    }
    const converted = await convertV1Receipt(value)
    if (converted) receipts.push(converted)
  }
  return receipts.sort((left, right) => right.updated_at.localeCompare(left.updated_at))
}
