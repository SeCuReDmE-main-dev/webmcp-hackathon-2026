import { afterEach, describe, expect, it, vi } from 'vitest'
import { WorkerSimulator } from './workerClient'

const originalWorker = globalThis.Worker

afterEach(() => {
  vi.restoreAllMocks()
  Object.defineProperty(globalThis, 'Worker', { configurable: true, value: originalWorker })
})

describe('Worker client error boundary', () => {
  it('maps a Worker error category to a fixed public message without forwarding raw internals', async () => {
    class FailingWorker {
      onmessage: ((event: MessageEvent) => void) | null = null
      onerror: ((event: Event) => void) | null = null
      postMessage(message: { requestId: string }): void {
        queueMicrotask(() => this.onmessage?.({ data: {
          type: 'error', requestId: message.requestId, errorCode: 'execution_failed',
          message: 'C:\\private\\artifact.qs:12 secret stack trace'
        } } as MessageEvent))
      }
      terminate(): void {}
    }
    Object.defineProperty(globalThis, 'Worker', { configurable: true, value: FailingWorker })
    const simulator = new WorkerSimulator()
    const failure = await simulator.run(
      new AbortController().signal,
      { shots: 4, timeout_ms: 500, max_qubits: 2, target: 'local_simulator' },
      'private source is never part of the public error', 'qsharp'
    ).catch((error: Error) => error)
    expect(failure).toBeInstanceOf(Error)
    expect((failure as Error).message).toBe('QCG worker execution failed safely. Review the bounded artifact and retry.')
    expect((failure as Error).message).not.toMatch(/private|C:\\|stack|trace|secret/i)
  })

  it('uses the same fixed fallback when a Worker does not supply a recognized category', async () => {
    class UnknownFailureWorker {
      onmessage: ((event: MessageEvent) => void) | null = null
      onerror: ((event: Event) => void) | null = null
      postMessage(message: { requestId: string }): void {
        queueMicrotask(() => this.onmessage?.({ data: { type: 'error', requestId: message.requestId, errorCode: 'not-a-public-code' } } as MessageEvent))
      }
      terminate(): void {}
    }
    Object.defineProperty(globalThis, 'Worker', { configurable: true, value: UnknownFailureWorker })
    const failure = await new WorkerSimulator().run(
      new AbortController().signal,
      { shots: 4, timeout_ms: 500, max_qubits: 2, target: 'local_simulator' }, 'source', 'qsharp'
    ).catch((error: Error) => error)
    expect((failure as Error).message).toBe('QCG worker processing failed safely.')
  })
})
