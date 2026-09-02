/// <reference lib="webworker" />
import { QscEventTarget, getCompiler, loadWasmModule } from 'qsharp-lang'
import type { ArtifactFormat } from './types'

interface Request {
  type: 'analyze' | 'run'
  requestId: string
  source: string
  format: ArtifactFormat
  shots?: number
}

type WorkerErrorCode = 'analysis_failed' | 'compiler_unavailable' | 'execution_failed' | 'unsupported_format' | 'validation_failed'

function postError(requestId: string, errorCode: WorkerErrorCode): void {
  self.postMessage({ type: 'error', requestId, errorCode })
}

let wasmReady: Promise<void> | undefined

async function compiler() {
  if (!wasmReady) {
    const wasmUrl = new URL('../node_modules/qsharp-lang/lib/web/qsc_wasm_bg.wasm', import.meta.url).href
    wasmReady = loadWasmModule(wasmUrl)
  }
  await wasmReady
  return getCompiler()
}

function boundedDiagnostics(count: number): string[] {
  if (count === 0) return []
  return [`Q# compiler reported ${count} bounded diagnostic${count === 1 ? '' : 's'}.`]
}

function executableFormat(format: ArtifactFormat): format is 'qsharp' | 'openqasm3' {
  return format === 'qsharp' || format === 'openqasm3'
}

async function analyze(qsharp: Awaited<ReturnType<typeof getCompiler>>, source: string, format: ArtifactFormat) {
  if (format === 'qsharp') return qsharp.checkCode(source)
  if (format === 'openqasm3') {
    await qsharp.getQir({ sources: [['main.qasm', source]], languageFeatures: [], projectType: 'openqasm' })
    return []
  }
  throw new Error('Static profiles are not sent to the QDK worker')
}

self.onmessage = async (event: MessageEvent<Request>) => {
  const { type, requestId, source, format } = event.data
  if (!executableFormat(format)) { postError(requestId, 'unsupported_format'); return }
  let qsharp: Awaited<ReturnType<typeof getCompiler>>
  try { qsharp = await compiler() } catch { postError(requestId, 'compiler_unavailable'); return }
  let diagnostics: Awaited<ReturnType<typeof analyze>>
  try { diagnostics = await analyze(qsharp, source, format) } catch { postError(requestId, 'analysis_failed'); return }
  if (type === 'analyze') {
    self.postMessage({
      type: 'analysis_complete', requestId, valid: diagnostics.length === 0,
      diagnosticCount: diagnostics.length, diagnostics: boundedDiagnostics(diagnostics.length)
    })
    return
  }
  if (diagnostics.length > 0) { postError(requestId, 'validation_failed'); return }
  try {
    const shotsRequested = Math.max(1, Math.min(256, Math.trunc(event.data.shots ?? 1)))
    const events = new QscEventTarget(true)
    await qsharp.run(
      { sources: [[format === 'qsharp' ? 'main.qs' : 'main.qasm', source]], languageFeatures: [], projectType: format === 'qsharp' ? 'qsharp' : 'openqasm' },
      format === 'qsharp' ? 'Qcg.Main()' : '()', shotsRequested, events
    )
    const shots = events.getResults()
    const outcomeCounts = shots.reduce<Record<string, number>>((counts, shot) => {
      const outcome = typeof shot.result === 'string' ? shot.result : 'compiler_error'
      counts[outcome] = (counts[outcome] ?? 0) + 1
      return counts
    }, {})
    const bellInvariant = shots.length === shotsRequested && shots.every((shot) =>
      shot.success && typeof shot.result === 'string' && /^\[(Zero|One),\s*\1\]$/.test(shot.result)
    )
    self.postMessage({ type: 'complete', requestId, bellInvariant, shotsRequested, shotsReturned: shots.length, outcomeCounts })
  } catch { postError(requestId, 'execution_failed') }
}

export {}
