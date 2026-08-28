# Technical specification — WebMCP-QCG vertical slice

## Runtime

- React + TypeScript + Vite
- `document.modelContext.registerTool`
- `qsharp-lang@1.31.0`
- Q# WebAssembly in a dedicated Web Worker
- Static deployment with `Origin-Agent-Cluster: ?1` and `Permissions-Policy: tools=(self)`

## Registration state machine

| Application state | Registered tools |
|---|---|
| empty / inspected | inspect, evaluate |
| evaluated | inspect, evaluate, export |
| `simulate_first` + unused visible consent | inspect, evaluate, simulate, export |
| consent consumed | inspect, evaluate, export |

Each registration cycle owns an `AbortController`. Cleanup aborts every tool. Any partial-registration failure aborts the cycle and reports `error`.

## Policy outputs

Exactly one of:

- `reuse_result`
- `reject`
- `recompile`
- `simulate_first`
- `ready_for_external_execution`

Every decision includes reason codes and one next action. Request bounds participate in the policy; scenario labels never dictate the answer directly.

## Simulation bounds

- Shots: 1–256
- Qubits: 1–8
- Timeout: 500–15000 ms
- Target: `local_simulator` or `external_unspecified`
- Fixture: fixed two-qubit Bell program
- Success invariant: every completed result is `[Zero, Zero]` or `[One, One]`

## Evidence boundary

Agent contracts omit raw Q# code, credentials and provider diagnostics. Detailed results appear in the human interface after invocation. The pre-invocation DOM contains hypotheses and controls, not the machine-verifiable decision record.
