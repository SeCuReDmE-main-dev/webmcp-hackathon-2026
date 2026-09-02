# WebMCP-QCG v3 release-candidate threat model

Status: repaired G3 clean-copy and deployment parity pass; official public inspect/evaluate smoke passes; human-controlled simulation/export remains open
Date: 2026-09-02
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
| Consent is replayed or raced | Consent is short-lived and recommendation-bound; the first simulation call marks it used synchronously before its first asynchronous step; success, cancellation and error keep it consumed and the simulation tool disappears | Browser/runtime compromise remains outside this application control |
| Resource exhaustion through a local program | 128 KiB artifact limit; UTF-8 and extension checks; 1–256 shots, 1–8 qubits and 500–15000 ms bounds; Worker termination | The current qubit estimate is a bounded static heuristic, not a general resource estimator |
| Raw source or private paths leak through agent responses | Compact output schemas, bounded errors and export tests; source stays outside WebMCP and IndexedDB | Browser extensions and the host OS remain outside QCG's trust claim |
| A static profile is treated as executable | Capabilities are registry-owned; static profiles cannot return `simulate_first` or `ready_for_external_execution` and never enter the Worker | Static findings remain bounded heuristics, not compiler proof |
| A declared agent identity is mistaken for authentication | Every collaboration record uses `identity_assurance: declared`; actor, role and source remain visible | The ledger proves provenance fields and sequence, not external identity ownership |
| Page content injects instructions into a debugging agent | Tool descriptions are static; page-derived content is labelled untrusted, schema-bounded and filtered; the ledger cannot create consent | Semantically manipulative bounded text still requires human review |
| A collaboration message changes quantum authority | Collaboration services and quantum services are separate; tools can observe/request/export only | The human can still choose to act after reading a poor recommendation |
| A stale tool survives a state change | Per-tool registration controllers diff canonical eligibility, use `AbortSignal`, preserve stable tools and remove progressive tools after state loss or consent consumption | Browser implementation defects remain external dependencies |
| Companion displays a stale or cross-tab snapshot | Broker allowlists commands and correlates tab/session identifiers; page, side-panel and F12 ports reconnect after disconnect; replacement ports cannot be cleared by stale disconnects | When a fresh session cannot be proven, Companion clears state and asks the person to reload/reopen |
| UI and agent paths diverge | Human controls and WebMCP tools call the same service layer and atomic state transitions | Visual copy can still lag code; release QA checks both |
| Deployment serves substituted assets | Release manifest, archive SHA-256, expected-path verification, HTTPS and public byte-hash comparison | cPanel account compromise is outside the application threat model |

## Security headers

The stable origin serves a restrictive Content Security Policy, `Origin-Agent-Cluster: ?1`, `Permissions-Policy: tools=(self)`, `X-Content-Type-Options: nosniff`, same-origin resource policy and a bounded referrer policy. The pinned WASM asset is served as `application/wasm`.

The repaired 2026-09-02 release candidate passed a 24-path live manifest on
canonical cPanel and the synchronized Vercel secondary. Chrome also decoded all
eight corrected brand PNGs on both hosts. Vercel additionally passed exact
SPA fallback HTML at `/decisions`, all seven expected policy headers, correct
WASM/ZIP MIME types and `.htaccess` non-disclosure. These checks establish the
recorded deployed bytes and host behavior, not protection from a compromised
hosting account, browser or operating system.

## Deliberate exclusions

This threat model does not claim provider authentication, cloud budget enforcement, QPU isolation, scientific correctness for arbitrary code, authenticated external-agent identity, direct automation of Gemini's native DevTools conversation, regulatory compliance, penetration-test coverage or protection against a compromised browser/operating system.

## Limits and recovery

- Local execution is limited to the checked-in Q# and OpenQASM Bell fixtures,
  1–256 shots, 1–8 qubits, 128 KiB input and a 500–15000 ms Worker timeout.
  Other profiles remain static inspection only.
- A bounded public error code may explain a Worker or storage category. Raw
  messages, stacks, paths and source remain excluded from WebMCP and receipts.
- When an IndexedDB upgrade is blocked, QCG returns a bounded recovery state.
  Close other QCG tabs, reload one tab, and retry; never delete evidence merely
  to make a failed gate pass.
- After page reload, navigation, Companion reload or extension-worker
  suspension, reopen the page/panel and require a fresh tab/session snapshot.
  Waiting or cleared state is safer than displaying an uncorrelated snapshot.
- A failed release candidate stops promotion. Restore only the exact identified
  previous host state, retain the failed artifact hash, and record the failure.
  The presence of a backup boundary is not proof that rollback has been drilled.

## Release evidence

See [the stable live-origin receipt](../../evidence/qa/LIVE_ORIGIN_ACCEPTANCE_RECEIPT_2026-08-29.md), [the G1 adversarial receipt](../evidence/ACTIONS_183_199_G1_SURGERY_2026-09-02.md), [the G2 real-browser receipt](../evidence/ACTIONS_200_213_G2_REAL_BROWSER_2026-09-02.md), [the G3 clean-copy receipt](../evidence/ACTIONS_220_225_G3_RELEASE_CANDIDATE_2026-09-02.md), [the publication/parity receipt](../evidence/ACTIONS_227_232_PUBLICATION_PARITY_2026-09-02.md), [the Gemini disposition](../evidence/GEMINI_FINDING_DISPOSITION_2026-09-02.md) and [the Qodo disposition](../evidence/QODO_COLD_REVIEW_DISPOSITION_2026-09-02.md). These records support bounded findings in their recorded environments; they are not a security certification. The human-controlled simulation/export portion of Action 237 remains open.
