import type { ArtifactFormat, RequestedLimits } from './types'

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
  errorCode?: 'analysis_failed' | 'compiler_unavailable' | 'execution_failed' | 'unsupported_format' | 'validation_failed'
}

const workerErrorMessages = {
  analysis_failed: 'QCG worker analysis failed safely. Review the bounded artifact and retry.',
  compiler_unavailable: 'QCG worker compiler is unavailable. Retry the bounded local operation.',
  execution_failed: 'QCG worker execution failed safely. Review the bounded artifact and retry.',
  unsupported_format: 'QCG worker rejected an unsupported bounded artifact format.',
  validation_failed: 'QCG worker validation failed. Review the bounded artifact and retry.'
} as const

function workerErrorMessage(code: WorkerReply['errorCode']): string {
  return code && code in workerErrorMessages ? workerErrorMessages[code] : 'QCG worker processing failed safely.'
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
        finish(() => reject(new Error(workerErrorMessage(event.data.errorCode))))
      } else {
        finish(() => resolve(select(event.data)))
      }
    }
    worker.onerror = () => finish(() => reject(new Error('QCG worker processing failed safely.')))
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
  analyze(source: string, format: ArtifactFormat, signal?: AbortSignal): Promise<ArtifactAnalysis>
}

export class WorkerArtifactAnalyzer implements ArtifactAnalyzer {
  analyze(source: string, format: ArtifactFormat, signal = new AbortController().signal): Promise<ArtifactAnalysis> {
    return invokeWorker(signal, 15_000, { type: 'analyze', source, format }, (reply) => ({
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
  run(signal: AbortSignal, limits: RequestedLimits, source: string, format: Extract<ArtifactFormat, 'qsharp' | 'openqasm3'>): Promise<SimulatorResult>
}

export class WorkerSimulator implements Simulator {
  run(signal: AbortSignal, limits: RequestedLimits, source: string, format: Extract<ArtifactFormat, 'qsharp' | 'openqasm3'>): Promise<SimulatorResult> {
    return invokeWorker(signal, limits.timeout_ms, { type: 'run', shots: limits.shots, source, format }, (reply) => ({
      bellInvariant: Boolean(reply.bellInvariant),
      shotsRequested: reply.shotsRequested ?? limits.shots,
      shotsReturned: reply.shotsReturned ?? 0,
      outcomeCounts: reply.outcomeCounts ?? {}
    }))
  }
}
