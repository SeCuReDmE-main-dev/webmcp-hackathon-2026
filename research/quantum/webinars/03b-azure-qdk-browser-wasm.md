# Webinar 03B — Azure QDK in the browser

Date: 2026-08-27  
Status: watched in part; primary-source code audit and local spike completed

## Why this remains a companion source

The 2024 Azure presentation is not the current general orchestration reference;
the 2025 CUDA-Q webinar fills that role. The Azure segment from 02:11 to 05:00
is nevertheless valuable because it demonstrates a browser-hosted Q# workflow:
editing, diagnostics, in-memory simulation, repeated shots, a histogram, and
code explanation beside the editor.

This is prior art for one execution location, not prior art for the proposed
multi-framework WebMCP router.

## Exact lesson retained from the viewing

The webinar is retained as a **proof of mechanism**, not as a current product
or orchestration reference. It demonstrates that a useful quantum development
loop can already live inside a browser: compile, diagnose, simulate, repeat
shots, visualize distributions, and inspect simulated state. The current QDK
repository and our executable package spike independently confirm that this is
not merely a presentation mock-up.

That evidence removes one major feasibility doubt for the hackathon. We do not
need to invent the browser quantum engine before building the Quantum Call
Gate. We can place a small WebMCP decision and evidence layer above an existing
WASM engine, while keeping modern backend selection and orchestration in our
own bounded router.

## Claims checked against the current QDK repository

- **Confirmed by primary sources:** the Microsoft QDK repository is MIT licensed.
- **Confirmed by primary sources:** the repository publishes a browser and Node
  package named `qsharp-lang`, backed by a prebuilt Rust/WebAssembly compiler.
- **Confirmed by primary sources:** its public compiler supports code checks,
  simulation, circuit generation, QIR generation, and resource estimation.
- **Confirmed by primary sources:** the playground loads the compiler and
  language service in Web Workers, keeping those operations away from the UI
  thread.
- **Confirmed by local execution:** version `1.31.0` validated and simulated a
  two-qubit Bell program on the hackathon machine without compiling Rust.

## What transfers to the MVP

Adopt the published package behind a narrow `QdkBrowserAdapter`. The adapter may
offer deterministic operations such as `validate`, `describe_circuit`,
`simulate`, and later `emit_qir`. WebMCP exposes those operations to a compatible
agent; the quantum router decides whether the QDK adapter is appropriate.

The router, capability profiles, preflight decision, cache policy, evidence
record, and framework selection remain our code. QDK is one engine beneath that
layer.

## What does not transfer

- Do not fork or rebuild the QDK Rust workspace during the seven-day build.
- Do not copy the Azure website, Monaco editor, Copilot panel, or cloud job UI.
- Do not make Azure identity or a paid provider account a prerequisite.
- Do not describe the QDK adapter as support for Qiskit, TorchQuantum, or
  TensorFlow Quantum.
- Do not imply that a locally successful simulation establishes hardware
  compatibility.

## Performance boundary

The installed WebAssembly binary is about 6.1 MB and the published package is
about 11.6 MB unpacked. Its initialization cost is acceptable for a deliberate
lab page, but it should be lazy-loaded. Quantum state simulation scales
exponentially with qubit count. The MVP therefore uses small fixtures, bounded
shots, timeouts, cancellation, and a worker. Heavy experiments route to Colab
or another explicitly selected backend.

## Accessibility principle

The deterministic browser lab must work without an Azure account and without a
large local language model. Agent access is an enhancement: a person should
still be able to validate and run the bounded example through the page UI. Cloud
models, Colab, provider emulators, and QPUs are optional execution tiers with
their own availability and account constraints. This improves accessibility but
does not justify a claim of universal geographic availability.

## Future surface, deliberately outside the MVP

Q# allows developers to define and compose their own operations from available
quantum instructions, so a future circuit or gate authoring surface is feasible.
Custom physical gates are target-specific and cannot be promised by a universal
adapter. The seven-day MVP consumes a fixed, auditable Bell-style fixture and
records circuit/gate authoring as roadmap work only.

## Sources

- Webinar: https://www.youtube.com/watch?v=PD0wHX6edIg
- Microsoft QDK: https://github.com/microsoft/qdk
- QDK npm package: https://www.npmjs.com/package/qsharp-lang
- Public compiler interface: https://github.com/microsoft/qdk/blob/main/source/npm/qsharp/src/compiler/compiler.ts
- Browser package entry: https://github.com/microsoft/qdk/blob/main/source/npm/qsharp/src/browser.ts
- Playground integration: https://github.com/microsoft/qdk/tree/main/source/playground
