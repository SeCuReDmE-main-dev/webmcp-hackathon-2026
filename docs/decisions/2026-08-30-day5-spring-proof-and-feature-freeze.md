# ADR — Day 5 Spring proof and feature freeze

- Date: 2026-08-30
- Status: **Implemented; feature freeze active**
- Decision owner: Jean-Sébastien Beaulieu
- Baseline commit: `237d208b26fdee93de6642d6018ce9b7778a90a6`

## Context

WebMCP-QCG already demonstrates a four-tool browser-native preflight, five deterministic recommendations, explicit human authority, bounded local Q# simulation, evidence receipts, four seasonal themes and an isolated DevTools collaboration surface. The Day 5 objective is to turn that functional base into a recognizable, measurable release candidate without opening another product branch.

The public Chrome documentation exposes Gemini as a user-facing DevTools capability, but it does not document a public extension API for sending messages into the native Gemini conversation. Chrome DevTools MCP does expose page routing and page-defined third-party tools. QCG therefore supports direct MCP clients on the same page and a structured human relay for native Gemini.

The installed `qsharp-lang@1.31.0` package exposes Q# and OpenQASM project loading. Those two formats can share the pinned local WASM runtime. Other major quantum ecosystems enter the MVP as explicit inspection-only profiles.

## Decision

Day 5 adds only the following bounded capabilities:

1. A two-lane collaboration protocol: `mcp_direct` and `native_gemini_manual`.
2. A deterministic handoff coordinator with no model, provider key or network authority.
3. Human-only review dispositions and local memory dispositions.
4. Q# and OpenQASM local compilation/simulation through the pinned QDK runtime.
5. Inspection-only profiles for Qiskit, Cirq/TFQ, TorchQuantum, PennyLane, CUDA-Q, Braket and textual QIR.
6. A componentized Spring presentation using the existing semantic workflow.
7. A reproducible benchmark campaign that measures the decision engine separately from HTTP delivery.

The product retains exactly four quantum tools and four collaboration tools. `run_bounded_qsharp_simulation` becomes `run_bounded_local_simulation`; `post_debug_observation` becomes `post_debug_message`.

## Authority boundary

- Agents may read, observe, propose, challenge and request review.
- Only a human may approve, deny, reject, defer, remember or forget.
- Collaboration state cannot create or consume quantum consent.
- Inspection-only adapters never execute imported Python, C++, QIR or provider code.
- Provider credentials, remote execution, paid quantum calls and QPU submission remain outside the release.
- Native Gemini receives and returns only a human-reviewed, bounded handoff package.

## Benchmark authorization

The supplied E2B billing evidence shows a Professional plan with 100 concurrent sandboxes and substantial available credits. The campaign may use all 100 concurrent slots after local, 10-sandbox and 50-sandbox gates pass. Cost alerts detect configuration errors; they are not a user budget ceiling.

The public cPanel origin receives only a capped canary. Saturation and failure-limit testing occur in isolated environments.

## Feature freeze

Actions 120–148 are the final Day 5 product additions. After the `day5-feature-freeze` tag, every new feature, provider, tool, decision, remote model API or execution backend moves to the post-hackathon backlog. Remaining work is restricted to defects, tests, accessibility, evidence, deployment, documentation and video.

## Release gates

- Zero false `ready` decisions and zero unauthorized effects.
- Q# and OpenQASM Bell fixtures compile and simulate locally.
- Every other adapter remains inspection-only.
- Four quantum and four collaboration tools remain the entire public surface.
- The same-page MCP exchange and native Gemini manual relay both produce receipts.
- The unpacked extension is installed with explicit author confirmation and the live `QCG` F12 panel proves bridge read, bounded message write, visibility lifecycle and human acknowledgement. Source presence alone is insufficient.
- Spring passes responsive and accessibility checks without changing product semantics.
- Benchmarks publish corpus, configuration, results, variance, cost and limitations.
- Devpost remains unsubmitted until Jean-Sébastien explicitly authorizes submission.

## Implementation outcome

The bounded Day 5 scope is implemented at product commit `ff23d48d2ba8dfe785e8e6a17b13e3b452629f1a`.

- The clean-copy regression suite passed 41 of 41 tests and the production build completed.
- Q# and OpenQASM Bell fixtures execute locally through the pinned QDK runtime.
- Eight additional ecosystem profiles remain inspection-only.
- The live `QCG` F12 panel and same-page Chrome DevTools MCP exchange were demonstrated.
- The E2B campaign completed 2.6 million deterministic evaluations, including two one-million-operation passes with matching digests across all 100 sandboxes.
- The public HTTP canary returned 80 of 80 successful responses.
- The E2B SDK did not return an invoice total, so campaign cost remains unknown.
- The Spring candidate remains local under the author's visual guard; the stable public cPanel release was not mutated.
- Devpost remains a draft and no QPU, quantum provider or payment operation was invoked.

All feature ideas after this outcome belong to the post-hackathon backlog. Release work may now change only defects, tests, evidence, accessibility, documentation, deployment packaging or video materials.
