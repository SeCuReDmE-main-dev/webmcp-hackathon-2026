# Native WebMCP + Q# receipt — 2026-08-29

Status: **PASS**
Surface: Codex in-app browser at `http://127.0.0.1:5173/`
Artifact: `prototype/webmcp-qcg/public/fixtures/qcg-bell-sample.qs`

## Artifact inspection

- File size: `236` bytes
- SHA-256: `602ec14b539c7ac01513b043eedd01931894dc00b746f2c55ed22ef0305e17df`
- Manifest: `manifest-602ec14b539c7ac01513b043`
- Compiler: `qsharp-lang@1.31.0`
- Compilation: `compiled`
- Diagnostics: `0`
- Estimated qubits: `2`
- Raw Q# crossed the WebMCP contract: `false`

## Native tool sequence

1. `inspect_quantum_experiment`
2. `evaluate_quantum_call`
3. Visible human choice: `accepted`
4. `run_bounded_qsharp_simulation`
5. `export_quantum_evidence_report`

The evaluation returned:

- Recommendation: `simulate_first`
- Reason: `BOUNDED_LOCAL_EVIDENCE_REQUIRED`
- Recommendation ID: `recommendation-602ec14b539c7ac01513b043`
- Confidence: `high`
- Safer alternative: one bounded local Q# simulation after human consent

## Human authority and effects

- Human justification: one bounded local Bell simulation was authorized; provider and QPU calls were explicitly excluded.
- Consent: visible, time-limited, one-use and consumed after simulation.
- Simulation tool before consent: absent.
- Simulation tool after accepted consent: present.
- Simulation tool after consumption: absent.
- Consent replay: rejected by automated test.

## Simulation result

- Shots requested: `64`
- Shots returned: `64`
- `[Zero, Zero]`: `37`
- `[One, One]`: `27`
- Bell invariant: `true`
- Local simulations: `1`
- Metadata validations: `1`
- QPU submissions: `0`
- Receipt: `receipt-recommendation602ec14b53`

## Export boundary

The Markdown receipt export succeeded without re-evaluation or simulation. It contained the artifact digest, target snapshot, recommendation, reason, human choice, controlled-effect counters and Bell invariant. It contained no raw Q#, provider credentials, private path or provider error.

## Automated verification

- `npm run build`: **PASS** — 122 modules transformed.
- `npm test`: **PASS** — 2 files, 14 tests.
- `npm run eval:smoke`: **PASS** — the official experimental `webmcp-evals` CLI executed `inspect_quantum_experiment` then `evaluate_quantum_call` against a fresh browser page; 2/2 steps passed without an LLM key.
- Lighthouse accessibility: **1.00**.
- Lighthouse best practices: **1.00**.
- Keyboard tab navigation: `Home` and `End` select the expected workflow tabs.
- Covered gates include byte-digest changes, malformed inputs, five decisions, zero-call decisions, accepted/deferred/overridden choices, expired authority, cancellation, non-replayable consent, bounded exports, v1-to-v2 conversion and WebMCP registration lifecycle.

The five visible cards were also exercised in the browser and returned their announced decisions:

| Card | Observed decision | QPU calls |
|---|---|---:|
| Reuse the Fresh Result | `reuse_result` | 0 |
| Reject the Unsupported Call | `reject` | 0 |
| Recompile for the Target | `recompile` | 0 |
| Simulate Before Spending | `simulate_first` | 0 |
| Ready, but Not Authorized | `ready_for_external_execution` | 0 |

## Claim boundary

This receipt proves a browser-local Q# Bell simulation mediated by native WebMCP tools and explicit human authority. It does not prove QPU execution, provider compatibility, generalized cost savings or multi-framework quantum support.
