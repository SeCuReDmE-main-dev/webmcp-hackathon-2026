import type { RequestedLimits } from './types'

interface WorkerReply {
  type: 'analysis_complete' | 'complete' | 'error'
  requestId: string
  valid?: boolean
  diagnosticCount?: number
  diagnostics?: string[]
  bellInvariant?: boolean
  shotsRequested?: number
  shotsReturned?: number
  outcomeCounts?: Record<string, number>
  message?: string
}

function invokeWorker<T>(
  signal: AbortSignal,
  timeoutMs: number,
  message: Record<string, unknown>,
  select: (reply: WorkerReply) => T
): Promise<T> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./qsharp.worker.ts', import.meta.url), { type: 'module' })
    const requestId = crypto.randomUUID()
    let settled = false
    const finish = (callback: () => void) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      signal.removeEventListener('abort', cancel)
      worker.terminate()
      callback()
    }
    const cancel = () => finish(() => reject(new DOMException('Operation cancelled', 'AbortError')))
    const timer = setTimeout(
      () => finish(() => reject(new Error('Bounded local Q# operation timed out'))),
      timeoutMs
    )
    signal.addEventListener('abort', cancel, { once: true })
    worker.onmessage = (event: MessageEvent<WorkerReply>) => {
      if (event.data.requestId !== requestId) return
      if (event.data.type === 'error') {
        finish(() => reject(new Error(event.data.message ?? 'Local Q# operation failed')))
      } else {
        finish(() => resolve(select(event.data)))
      }
    }
    worker.onerror = () => finish(() => reject(new Error('Local Q# operation failed')))
    if (signal.aborted) cancel()
    else worker.postMessage({ ...message, requestId })
  })
}

export interface ArtifactAnalysis {
  valid: boolean
  diagnosticCount: number
  diagnostics: string[]
}

export interface ArtifactAnalyzer {
  analyze(source: string, signal?: AbortSignal): Promise<ArtifactAnalysis>
}

export class WorkerArtifactAnalyzer implements ArtifactAnalyzer {
  analyze(source: string, signal = new AbortController().signal): Promise<ArtifactAnalysis> {
    return invokeWorker(signal, 15_000, { type: 'analyze', source }, (reply) => ({
      valid: Boolean(reply.valid),
      diagnosticCount: reply.diagnosticCount ?? 0,
      diagnostics: (reply.diagnostics ?? []).slice(0, 4)
    }))
  }
}

export interface SimulatorResult {
  bellInvariant: boolean
  shotsRequested: number
  shotsReturned: number
  outcomeCounts: Record<string, number>
}

export interface Simulator {
  run(signal: AbortSignal, limits: RequestedLimits, source: string): Promise<SimulatorResult>
}

export class WorkerSimulator implements Simulator {
  run(signal: AbortSignal, limits: RequestedLimits, source: string): Promise<SimulatorResult> {
    return invokeWorker(signal, limits.timeout_ms, { type: 'run', shots: limits.shots, source }, (reply) => ({
      bellInvariant: Boolean(reply.bellInvariant),
      shotsRequested: reply.shotsRequested ?? limits.shots,
      shotsReturned: reply.shotsReturned ?? 0,
      outcomeCounts: reply.outcomeCounts ?? {}
    }))
  }
}
