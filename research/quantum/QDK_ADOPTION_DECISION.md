# QDK adoption decision — use the package, not the repository

Date: 2026-08-27  
Decision: `ADOPT_AS_BOUNDED_BROWSER_ADAPTER`  
Evidence status: primary-source audit plus local executable spike

## Objective

Decide whether learning or reimplementing Microsoft's quantum engine would help
or delay a seven-day WebMCP Quantum Call Gate MVP.

## Environment / Stack Context

- Hackathon base SHA: `485a0bac5faefaed63a151909680de1a119624f3`
- Audited QDK SHA: `d9a2611924c980608bb267849a8de9a8a4891400`
- Test system: Windows 11 Pro, 64-bit
- Node: 24.18.1
- Package tested: `qsharp-lang@1.31.0`, pinned exactly
- Prebuilt WebAssembly binary: 6,066,574 bytes
- No Rust toolchain, MSYS2, MinGW, Nix, Azure account, model API, or QPU used

## Research Questions

1. Is the public QDK boundary small enough to learn within the hackathon?
2. Does it provide deterministic capabilities that the router should not rebuild?
3. Does it run acceptably on the available Windows machine?
4. Which parts must remain outside the seven-day scope?

## Findings

### The useful boundary is small

**Confirmed by primary sources.** Browser consumers load one prebuilt WebAssembly
module, then request a compiler directly or through a Web Worker. The compiler
interface exposes `checkCode`, `run`, `runWithNoise`, `getCircuit`, `getQir`,
`getEstimates`, intermediate representations, and documentation. Learning this
boundary is substantially smaller than learning the Rust compiler internals.

### Rebuilding the quantum engine would be the wrong engineering task

**Confirmed by primary sources and engineering scope.** A replacement would need
to reproduce language parsing, type checking, lowering, Q# semantics, simulation,
diagnostics, circuit extraction, and possibly QIR. Our unique work is the
multi-surface capability router and preflight policy, not another Q# compiler.

### It runs on the available machine

**Confirmed by local execution.** The spike loaded the published WebAssembly,
validated a two-qubit Q# Bell operation with zero diagnostics, and returned all
twenty requested shots in 716 ms. The observed results were split between the
two correlated Bell outcomes, with no impossible mixed result. This proves the
public package boundary on Node; the browser-worker path remains a separate
implementation gate.

### QDK helps only if it remains isolated

**Recommended path.** Introduce a `QdkBrowserAdapter` behind our own framework-
neutral contract. Lazy-load it only after the router selects Q#/QDK. Return
native diagnostics and results inside a common evidence envelope; never flatten
QDK semantics into a fake universal circuit API.

## Recommended Path

1. Keep `qsharp-lang@1.31.0` pinned for the hackathon.
2. Copy the package's WebAssembly asset during the web build; do not compile Rust.
3. Run the compiler in a Web Worker.
4. Implement only `validate` and `simulate` first; add `getCircuit` only if the
   first two pass browser tests.
5. Bound source length, qubits, shots, run time, and returned events.
6. Map WebMCP cancellation to worker termination or adapter cancellation.
7. Keep all cloud submission disabled by default and outside the initial demo.
8. Preserve the MIT notice and avoid Microsoft/Azure endorsement language.

## Alternatives Considered

- **Build the QDK repository:** rejected for the MVP; adds Rust/WASM build work
  without increasing the proof.
- **Write a Q# compiler/simulator:** rejected; technically much larger and less
  reliable than adopting the maintained engine.
- **Use QDK only as inspiration:** inferior because the public package already
  passes on the target machine.
- **Make QDK the whole router:** rejected; it would narrow the product to one
  language/ecosystem and erase the multi-framework contribution.

## Risks / Unknowns

- The npm `latest` tag currently points to a development-suffixed release; the
  hackathon must keep the verified stable pin rather than float on `latest`.
- The browser bundler must correctly serve the WebAssembly and worker assets.
- The 6.1 MB module should be cached and lazy-loaded.
- Simulation cost grows exponentially with qubit count.
- QDK validation does not prove QPU or provider compatibility.
- WebMCP support varies by browser/agent surface; the page UI remains the
  deterministic fallback.

## Decision

QDK saves time. Learning its public boundary took less effort than constructing
even a minimally trustworthy replacement, and the first executable proof passed.
The MVP will reuse the package as one adapter while keeping the routing engine,
call gate, evidence model, Colab delegation, and other framework adapters
independent.

## Sources

- https://github.com/microsoft/qdk
- https://github.com/microsoft/qdk/blob/main/LICENSE.txt
- https://github.com/microsoft/qdk/tree/main/source/npm/qsharp
- https://github.com/microsoft/qdk/blob/main/source/npm/qsharp/src/compiler/compiler.ts
- https://github.com/microsoft/qdk/tree/main/source/playground
- https://www.npmjs.com/package/qsharp-lang

