/// <reference lib="webworker" />
import { QscEventTarget, getCompiler, loadWasmModule } from 'qsharp-lang'

interface Request {
  type: 'analyze' | 'run'
  requestId: string
  source: string
  shots?: number
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

self.onmessage = async (event: MessageEvent<Request>) => {
  const { type, requestId, source } = event.data
  try {
    const qsharp = await compiler()
    const diagnostics = await qsharp.checkCode(source)
    if (type === 'analyze') {
      self.postMessage({
        type: 'analysis_complete',
        requestId,
        valid: diagnostics.length === 0,
        diagnosticCount: diagnostics.length,
        diagnostics: boundedDiagnostics(diagnostics.length)
      })
      return
    }
    if (diagnostics.length > 0) throw new Error('Q# source failed validation')

    const shotsRequested = Math.max(1, Math.min(256, Math.trunc(event.data.shots ?? 1)))
    const events = new QscEventTarget(true)
    await qsharp.run({ sources: [['main.qs', source]], languageFeatures: [] }, 'Qcg.Main()', shotsRequested, events)
    const shots = events.getResults()
    const outcomeCounts = shots.reduce<Record<string, number>>((counts, shot) => {
      const outcome = typeof shot.result === 'string' ? shot.result : 'compiler_error'
      counts[outcome] = (counts[outcome] ?? 0) + 1
      return counts
    }, {})
    const bellInvariant = shots.length === shotsRequested && shots.every((shot) =>
      shot.success && typeof shot.result === 'string' && /^\[(Zero|One),\s*\1\]$/.test(shot.result)
    )
    self.postMessage({
      type: 'complete',
      requestId,
      bellInvariant,
      shotsRequested,
      shotsReturned: shots.length,
      outcomeCounts
    })
  } catch {
    self.postMessage({
      type: 'error',
      requestId,
      message: 'Local Q# processing could not complete. Review the bounded artifact and retry.'
    })
  }
}

export {}
