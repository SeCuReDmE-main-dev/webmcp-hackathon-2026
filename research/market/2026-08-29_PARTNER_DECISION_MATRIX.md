# WebMCP-QCG — partner and ecosystem decision matrix

Date: 2026-08-29
Purpose: assign every ecosystem a precise role without implying a commercial partnership or unsupported integration.

## Decision vocabulary

- **CORE DEPENDENCY**: used by the current executable path.
- **PROTOCOL SURFACE**: defines how the product is discovered or invoked.
- **REFERENCE CONTRACT**: supplies a pattern, constraint or comparator.
- **ADAPTER CANDIDATE**: may contribute a future read-only capability profile.
- **EXCLUDED FROM MVP**: valuable ecosystem whose execution or credentials remain outside the current release.

## Matrix

| Ecosystem | Demonstrated capability | Current QCG role | Decision for the hackathon | Evidence required before expansion |
|---|---|---|---|---|
| Google Chrome WebMCP | Native page tool registration, browser discovery, cancellation and DevTools inspection | **PROTOCOL SURFACE** | Keep native `document.modelContext` as the principal agent boundary | Stable-deployment discovery and invocation trace in a supported browser |
| OpenAI ChatGPT/Codex in-app browser | Agent discovery and invocation of page tools | **PROTOCOL SURFACE / TEST CLIENT** | Keep as the proven native browser-agent client | Repeat the trace on the retained production URL |
| Microsoft QDK / `qsharp-lang@1.31.0` | Q# compile and simulation through WebAssembly | **CORE DEPENDENCY** | Keep one pinned, bounded local adapter | Package integrity, timeout, cancellation and deterministic fixture tests |
| qBraid Agent Mode and SDK | Live device, queue and pricing context; multi-framework conversion; hardware approval | **REFERENCE CONTRACT / ADAPTER CANDIDATE** | Use as the closest comparator. Keep qBraid credentials and submission outside QCG | A read-only target-profile import contract, licensing review and freshness policy |
| IBM Qiskit and Qiskit MCP Servers | Circuit build, transpilation, Runtime hardware access and agent tools | **REFERENCE CONTRACT / ADAPTER CANDIDATE** | Use a target snapshot or fake backend only after the browser workbench accepts real artifacts | One versioned read-only profile, a compatibility test and zero Runtime calls |
| Open Quantum MCP | Quote, spend preview, backend choice and separate job submission | **REFERENCE CONTRACT** | Benchmark QCG's earlier local gate against `prepare_job`; do not embed submission | A documented handoff format that transfers readiness without credentials |
| Amazon Braket | Device-specific spending limits that reject tasks over budget | **REFERENCE CONTRACT** | Use as evidence that spend guards matter; keep AWS calls outside scope | Read-only imported price/limit snapshot with source, timestamp and unknown state |
| Quantinuum Nexus/pytket | Compilation jobs, backend configs, cost jobs, project metadata and long queues | **REFERENCE CONTRACT / ADAPTER CANDIDATE** | Use to test the claim that even costing or compilation can be an external call | A local profile fixture and a no-call preflight case |
| Classiq | High-level synthesis and multi-provider execution | **REFERENCE CONTRACT** | Treat synthesis as an upstream engine, not a QCG feature | User evidence that a QCG receipt adds value before Classiq execution |
| NVIDIA CUDA-Q | Hybrid kernels, heterogeneous targets and local simulation | **ADAPTER CANDIDATE** | Retain for the roadmap; keep the hackathon slice on Q# | Local resource budget, install weight and one bounded adapter contract |
| PennyLane | Local resource specifications and quantum ML workflows | **ADAPTER CANDIDATE** | Consider as a future read-only resource-inspection adapter | Real artifact intake and normalized resource schema |
| Q-CTRL Fire Opal | Hardware-aware validation, optimization and error suppression | **REFERENCE CONTRACT** | Treat as a downstream specialist service | Evidence that an independent preflight receipt is useful to its users |
| SecuredMe hosting/cPanel | Retained public domain and operator-controlled deployment surface | **DELIVERY SURFACE** | Prefer a stable SecuredMe-hosted URL when the WebAssembly asset, headers and MIME types pass | HTTPS, `_headers` equivalent, WASM delivery, cache policy and native WebMCP trace |
| Cloudflare/Vercel/Netlify | Alternative static or Worker hosting | **DELIVERY FALLBACKS** | Select only the provider that can retain the WASM asset and required headers | Stable authenticated deployment and documented size limits |

## Partner-language guardrail

These rows describe technical ecosystems and potential adapters. Public writing must use terms such as “built with,” “tested against,” “inspired by,” “compatible target,” or “future adapter candidate.” The words “partner,” “supported by,” “approved by,” and “integrated with” require direct evidence from the named organization.

## Decision

The MVP owns one native browser contract and one local Q# execution path. Every provider-facing system remains a reference or future read-only adapter. This keeps the product useful across ecosystems while preserving a release that can be tested, explained and audited within the hackathon window.
