/// <reference lib="webworker" />
import { QscEventTarget, getCompiler, loadWasmModule } from 'qsharp-lang'

const bellProgram = `
namespace Qcg {
  @EntryPoint()
  operation Main() : Result[] {
    use (left, right) = (Qubit(), Qubit());
    H(left);
    CNOT(left, right);
    let result = [M(left), M(right)];
    ResetAll([left, right]);
    return result;
  }
}`

self.onmessage = async (event: MessageEvent<{ type: 'run'; requestId: string; shots: number }>) => {
  if (event.data.type !== 'run') return
  try {
    // This import and WASM compiler are deliberately confined to this worker.
    const wasmUrl = new URL('../node_modules/qsharp-lang/lib/web/qsc_wasm_bg.wasm', import.meta.url).href
    await loadWasmModule(wasmUrl)
    const compiler = await getCompiler()
    const diagnostics = await compiler.checkCode(bellProgram)
    if (diagnostics.length > 0) throw new Error('Q# Bell program failed validation')

    const shotsRequested = Math.max(1, Math.min(256, Math.trunc(event.data.shots)))
    const events = new QscEventTarget(true)
    await compiler.run({ sources: [['main.qs', bellProgram]], languageFeatures: [] }, 'Qcg.Main()', shotsRequested, events)
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
      requestId: event.data.requestId,
      bellInvariant,
      shotsRequested,
      shotsReturned: shots.length,
      outcomeCounts
    })
  } catch {
    // Do not expose compiler/WASM diagnostics to the page or agent.
    self.postMessage({ type: 'error', requestId: event.data.requestId, message: 'Local Q# simulation could not complete. Recover by retrying the bounded local run.' })
  }
}

export {}
