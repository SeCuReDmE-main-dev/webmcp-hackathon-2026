import { readFileSync } from "node:fs";
import {
  QscEventTarget,
  getCompiler,
  loadWasmModule,
} from "qsharp-lang";

const resolvedEntry = import.meta.resolve("qsharp-lang");
const wasmUrl = new URL("../lib/web/qsc_wasm_bg.wasm", resolvedEntry);
await loadWasmModule(readFileSync(wasmUrl).buffer);

const source = `namespace WebMcpSpike {
  operation BellPair() : Result[] {
    use qubits = Qubit[2];
    H(qubits[0]);
    CNOT(qubits[0], qubits[1]);
    return MResetEachZ(qubits);
  }
}`;

const program = {
  sources: [["bell.qs", source]],
  languageFeatures: [],
};

const startedAt = performance.now();
const compiler = await getCompiler();
const diagnostics = await compiler.checkCode(source);
const events = new QscEventTarget(true);
await compiler.run(program, "WebMcpSpike.BellPair()", 20, events);

const results = events.getResults();
const counts = results.reduce((acc, shot) => {
  const key = JSON.stringify(shot.result);
  acc[key] = (acc[key] ?? 0) + 1;
  return acc;
}, {});

console.log(
  JSON.stringify(
    {
      schema: "webmcp.qdk.public-api-spike.v1",
      diagnostics: diagnostics.length,
      shotsRequested: 20,
      shotsReturned: results.length,
      counts,
      elapsedMs: Math.round(performance.now() - startedAt),
      status: diagnostics.length === 0 && results.length === 20 ? "PASS" : "FAIL",
    },
    null,
    2,
  ),
);
