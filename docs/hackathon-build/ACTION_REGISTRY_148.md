# WebMCP-QCG action registry — extension through Action 148

This registry inherits Actions 1–117 and their evidence from `ACTION_REGISTRY_98.md`. It records the accepted Day 5 extension without rewriting historical status.

| ID | Action | Owner | Status | Acceptance evidence |
|---:|---|---|---|---|
| 118 | Capture the executable Day 5 baseline | Root/Sol | DONE | `evidence/qa/ACTION_118_DAY5_BASELINE_2026-08-30.md` |
| 119 | Accept the Spring proof and feature-freeze ADR | Root/Sol | DONE | `docs/decisions/2026-08-30-day5-spring-proof-and-feature-freeze.md` |
| 120 | Formalize direct MCP and native-Gemini-manual collaboration lanes | Terra | DONE | `evidence/qa/ACTION_127_F12_MCP_COLLABORATION_2026-08-30.md` + contracts |
| 121 | Version collaboration intents, dispositions, memory and handoff packages | Terra | DONE | Strict v2 schemas and tests |
| 122 | Implement a deterministic handoff coordinator | Terra | DONE | Coordinator tests |
| 123 | Extend the append-only ledger and bounded memory | Terra | DONE | IndexedDB, fallback and bounded-memory tests |
| 124 | Upgrade the four collaboration tools | Terra | DONE | Discovery and lifecycle tests |
| 125 | Implement previewed Gemini handoff export/import | Terra | DONE | `evidence/qa/ACTION_127_F12_MCP_COLLABORATION_2026-08-30.md` |
| 126 | Complete the F12 responsibility and handoff interface; install the unpacked extension only after action-time author confirmation; prove the `QCG` tab, page bridge, visibility lifecycle and human message path | Terra + Root | DONE | Live installed-panel screenshots and runtime receipt |
| 127 | Prove one same-page MCP conversation through the live F12 panel and preserve the agent observation, counter-analysis and human acknowledgement | Root + Terra | DONE | `evidence/qa/ACTION_127_F12_MCP_COLLABORATION_2026-08-30.md`; structured human disposition remains open |
| 128 | Test injection, secrets, paths, duplicates and authority | Terra | DONE | Security and contract suite; 41/41 tests |
| 129 | Add the adapter registry and EvidenceReceipt v3 | Terra | DONE | `evidence/qa/DAY5_QUANTUM_ADAPTER_RECEIPT_2026-08-30.md` |
| 130 | Add Q# and OpenQASM QDK adapters | Terra | DONE | `evidence/qa/DAY5_QUANTUM_ADAPTER_RECEIPT_2026-08-30.md` |
| 131 | Compile and simulate the OpenQASM Bell fixture | Terra | DONE | 64/64 locally correlated outcomes in adapter receipt |
| 132 | Add eight inspection-only ecosystem profiles | Terra | DONE | Adapter conformance matrix and contract tests |
| 133 | Add explicit profile selection and capability disclosure | Root + Terra | DONE | UI, catalog and 41/41 regression suite |
| 134 | Generalize the bounded local-simulation tool | Terra | DONE | Four-tool lifecycle tests |
| 135 | Test formats, digests, limits, migrations and execution isolation | Terra | DONE | 41/41 regression suite |
| 136 | Componentize the application without changing semantics | Root/Sol | DONE | 41/41 tests and production build |
| 137 | Implement the distinctive Spring design | Root/Sol | DONE | Real product captures |
| 138 | Validate responsive behavior, accessibility and reduced motion | Root + Luna | DONE | `evidence/qa/ACTIONS_136_138_SPRING_VISUAL_QA_2026-08-30.md` |
| 139 | Initialize the reproducible benchmark workspace and corpus | Luna | DONE | `.benchmark/` corpus and manifests |
| 140 | Establish the local baseline and retain the blocked Multipass comparator honestly | Root/Sol | DONE | `results/ACTION_140_BASELINE_RECEIPT_2026-08-30.md`; Windows 10k pass; Multipass zero-operation blocked receipt |
| 141 | Execute the gated E2B Professional campaign | Root/Sol | DONE | 2.6M operations; two 1M passes; `results/day5-campaign-aggregate.json` |
| 142 | Execute the capped cPanel canary | Root/Sol | DONE | 80/80 HTTP 200; `results/http-canary-20260830T191121Z.json` |
| 143 | Aggregate performance, security, cost and reproducibility | Root + Luna | DONE | `evidence/qa/ACTION_143_DAY5_BENCHMARK_REPORT_2026-08-30.md` |
| 144 | Run clean-clone, WebMCP, F12, security and recovery QA | Root + Terra | DONE | `evidence/qa/ACTION_144_INTEGRATED_QA_2026-08-30.md`; clean install, 41/41 tests, build, F12 receipt and zero credential/private-path findings |
| 145 | Preserve the stable cPanel release under the superseding author visual guard and verify rollback | Root/Sol | DONE | `evidence/hosting/ACTION_145_STABLE_RELEASE_AUTHOR_GUARD_2026-08-30.md`; public mutation count 0 |
| 146 | Produce English/French Spring editorials and short extracts | Luna + Root | DONE | `MANUSCRIPT_EN.md`, `MANUSCRIPT_FR.md`, `EXTRACT_EN.md`, `EXTRACT_FR.md` in the Day 5 Spring article folder; author-review only |
| 147 | Update public docs, push main and tag the feature freeze | Root/Sol | IN_PROGRESS | Product commit `ff23d48`; remote verification pending |
| 148 | Produce the Day 5 closeout and enforce the freeze | Root/Sol | IN_PROGRESS | `docs/hackathon-build/DAY5_CLOSEOUT_2026-08-30.md`; remote verification pending |

## Status rule

An action becomes `DONE` only when its acceptance artifact exists and its relevant tests or author gate pass. A failed benchmark remains valuable evidence but cannot satisfy an authority, safety or reproducibility gate.

F12 is a blocking release gate. The presence of `companion/qcg-devtools-extension/` is implementation evidence only. Actions 126 and 127 require a real Chrome session with the unpacked extension installed, DevTools opened, the `QCG` panel selected, the inspected page bridge connected and a round-trip displayed without changing quantum authority.
