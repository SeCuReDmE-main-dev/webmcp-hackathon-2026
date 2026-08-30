# WebMCP-QCG v3 candidate threat model

Status: Day 5 feature-freeze candidate; stable v2 remains public
Date: 2026-08-30
Scope: multi-format preflight, bounded Q#/OpenQASM simulation, declared-agent collaboration and evidence export

## Security objective

QCG helps a human review an agent-proposed quantum action without giving the agent provider credentials, a remote submission surface or independent spending authority. The MVP protects artifact confidentiality, decision integrity, human authority and receipt provenance inside one browser origin.

## Trust boundaries

1. **Human file boundary** — the human chooses a supported local file and its profile. Source remains in session memory. Only Q#/OpenQASM enters the local QDK Worker; static profiles never execute.
2. **WebMCP boundary** — the agent receives identifiers, bounded manifests, recommendations and receipts. Raw source, local paths and credentials stay outside tool inputs and outputs.
3. **Worker boundary** — `qsharp-lang@1.31.0` compiles and runs approved Q#/OpenQASM Bell contracts in a dedicated Worker with shot, qubit and timeout limits.
4. **Persistence boundary** — IndexedDB stores evidence receipts only. Source code and consent tokens are not durable records.
5. **Collaboration boundary** — the F12 ledger stores bounded, declared-identity messages separately from quantum authority. Native Gemini exchange is human-mediated and previewed before import.
6. **External boundary** — no provider API, QPU job, credential, payment or remote quantum execution exists in the MVP.

## Assets

- exact artifact bytes and their SHA-256 digest;
- source and freshness of the target-profile snapshot;
- deterministic recommendation and reason codes;
- visible human decision and justification;
- one-use local consent state;
- effect counters and exported evidence receipt.

## Threats and controls

| Threat | Control | Residual boundary |
|---|---|---|
| Agent invents or substitutes an artifact | Human import plus byte-exact digest; tool accepts only an existing artifact identifier | The human remains responsible for selecting the intended file |
| Prompt injection attempts to smuggle fields | Strict Zod and JSON schemas reject unknown properties and bound strings, objects and numeric limits | Semantically misleading but schema-valid intent still requires human review |
| Stale or unsupported target facts produce a false ready state | Sourced, hashed, expiring snapshots with `known`, `stale` and `unknown` states; false-ready regressions | QCG does not verify live provider queues, credentials or prices |
| Agent treats a recommendation as authority | Recommendation, human decision, consent and effect are separate contracts and UI states | A human can still make an imprudent choice; QCG records it rather than claiming to prevent it |
| Consent is replayed | Consent is short-lived, recommendation-bound and consumed on success, cancellation or error; the simulation tool then disappears | Explicit pre-use revocation is a follow-up state |
| Resource exhaustion through a local program | 128 KiB artifact limit; UTF-8 and extension checks; 1–256 shots, 1–8 qubits and 500–15000 ms bounds; Worker termination | The current qubit estimate is a bounded static heuristic, not a general resource estimator |
| Raw source or private paths leak through agent responses | Compact output schemas, bounded errors and export tests; source stays outside WebMCP and IndexedDB | Browser extensions and the host OS remain outside QCG's trust claim |
| A static profile is treated as executable | Capabilities are registry-owned; static profiles cannot return `simulate_first` or `ready_for_external_execution` and never enter the Worker | Static findings remain bounded heuristics, not compiler proof |
| A declared agent identity is mistaken for authentication | Every collaboration record uses `identity_assurance: declared`; actor, role and source remain visible | The ledger proves provenance fields and sequence, not external identity ownership |
| Page content injects instructions into a debugging agent | Tool descriptions are static; page-derived content is labelled untrusted, schema-bounded and filtered; the ledger cannot create consent | Semantically manipulative bounded text still requires human review |
| A collaboration message changes quantum authority | Collaboration services and quantum services are separate; tools can observe/request/export only | The human can still choose to act after reading a poor recommendation |
| A stale tool survives a state change | Every registration uses an `AbortSignal`; progressive tools are re-registered from canonical state and removed after consent consumption | Browser implementation defects remain external dependencies |
| UI and agent paths diverge | Human controls and WebMCP tools call the same service layer and atomic state transitions | Visual copy can still lag code; release QA checks both |
| Deployment serves substituted assets | Release manifest, archive SHA-256, expected-path verification, HTTPS and public byte-hash comparison | cPanel account compromise is outside the application threat model |

## Security headers

The stable origin serves a restrictive Content Security Policy, `Origin-Agent-Cluster: ?1`, `Permissions-Policy: tools=(self)`, `X-Content-Type-Options: nosniff`, same-origin resource policy and a bounded referrer policy. The pinned WASM asset is served as `application/wasm`.

## Deliberate exclusions

This threat model does not claim provider authentication, cloud budget enforcement, QPU isolation, scientific correctness for arbitrary code, authenticated external-agent identity, direct automation of Gemini's native DevTools conversation, regulatory compliance, penetration-test coverage or protection against a compromised browser/operating system.

## Release evidence

See [the stable live-origin receipt](../../evidence/qa/LIVE_ORIGIN_ACCEPTANCE_RECEIPT_2026-08-29.md), [the Day 5 adapter receipt](../../evidence/qa/DAY5_QUANTUM_ADAPTER_RECEIPT_2026-08-30.md), [the F12 collaboration receipt](../../evidence/qa/ACTION_127_F12_MCP_COLLABORATION_2026-08-30.md) and [the benchmark receipt](../../evidence/qa/ACTION_143_DAY5_BENCHMARK_REPORT_2026-08-30.md).
