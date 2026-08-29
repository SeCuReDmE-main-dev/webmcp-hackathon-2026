# ADR — Browser-native HITL quantum preflight workbench

- Date: 2026-08-29
- Status: **Accepted for the narrow hackathon product**
- Decision owner: Jean-Sébastien Beaulieu
- Supersedes: any interpretation of QCG as a general multi-provider execution router
- Preserves: the progressive four-tool browser gate accepted on 2026-08-28

## Context

The first vertical slice proves that a browser agent can inspect a fixture, evaluate it, wait for visible one-time consent, run a bounded local Q# simulation and export evidence. Market research now shows that agentic quantum execution, multi-framework conversion, provider selection, quote review and spend enforcement already exist across qBraid, Qiskit MCP, Open Quantum, Braket and specialist platforms.

The useful unresolved boundary sits earlier. A researcher needs a consistent way to determine whether a new call is justified, which evidence supports that decision, whether target information is current and who holds authority for the next effectful step.

## Decision

WebMCP-QCG will operate as a **browser-native, human-in-the-loop quantum preflight workbench**.

The workbench will:

1. inspect a real local artifact and create a digest;
2. inspect or import a timestamped target-profile snapshot;
3. search for exactly reusable evidence under a versioned equivalence key;
4. evaluate compatibility, bounds, resource facts and evidence freshness through deterministic policy;
5. return exactly one decision with reason codes and a next action;
6. display technical readiness and human authority as distinct states;
7. run only an explicitly bounded local simulation after visible consent;
8. export a portable receipt that contains provenance, hashes, authority state and call counters.

The MVP carries no provider credentials and exposes no provider submission tool. `ready_for_external_execution` means the preflight found no recorded blocker under the supplied profile. It never means a provider call has been authorized.

## Browser and agent contract

- The human page and WebMCP tools call the same canonical services.
- The page remains useful when native WebMCP is absent.
- Agent responses remain compact and exclude raw source code, credentials and provider diagnostics.
- Raw artifact processing occurs locally in the page or its Worker.
- Tool availability follows application state and an `AbortSignal` lifecycle.
- Consent contains scope, expiry and one-time consumption semantics.
- The detailed result becomes visible after invocation; the decision record does not exist before the tool executes.

## Decision states

| Decision | Meaning | Permitted next action |
|---|---|---|
| `reuse_result` | Exact, fresh evidence already answers the declared question | Export or inspect the existing receipt |
| `reject` | The request violates a declared compatibility, policy or evidence bound | Repair the stated input or target condition |
| `recompile` | The artifact requires a deterministic transformation for the selected target | Produce a new artifact and re-inspect it |
| `simulate_first` | A bounded local experiment supplies the minimum next evidence | Request visible consent, then run the local Worker |
| `ready_for_external_execution` | The supplied profile and evidence contain no recorded preflight blocker | Export the receipt and request separate external authorization elsewhere |

## Security and authority properties

- Default-deny state transition for unknown, stale or malformed inputs.
- Exact schema bounds and unknown-property rejection.
- Artifact and profile hashes bind the decision to inspected inputs.
- Provider price, queue and capability data carries source, observed time and expiry.
- Unknown commercial data remains `unknown`.
- Simulation consent expires, can be revoked and is consumed once.
- External-call counters remain independently inspectable.
- Receipt export has no execution side effect.

## Consequences

### Positive

- The product remains compatible with qBraid, Qiskit, Open Quantum and other runners instead of competing with their execution layers.
- A reviewer can falsify a claim through the visible decision, reason codes and counters.
- Real professional relevance can be tested with one artifact and one target profile.
- The seven-day implementation path remains bounded.

### Cost accepted

- Live provider execution and generalized routing move to later adapters.
- The first workbench supports a narrow artifact and profile schema.
- A `ready` result remains intentionally less dramatic than a hardware run because authority and credentials stay outside QCG.

## Rejected alternatives

1. **General quantum agent/router.** Rejected because mature platforms already occupy execution and the scope multiplies credentials, providers and irreversible effects.
2. **Provider-specific frontend.** Rejected because it weakens the independent evidence contract.
3. **Static five-card demonstration as final product.** Retained as regression fixtures; insufficient as the complete professional workflow.
4. **Automatic QPU handoff.** Deferred until a separately authorized product surface has an explicit threat, cost and liability model.

## Validation gates

- One real artifact enters locally and produces a stable digest.
- One dated target profile can be inspected and later expire.
- Exact evidence can return `reuse_result`; a near-match cannot.
- Unknown price or queue remains visible as unknown.
- A false-ready test suite contains zero false-ready outcomes.
- Every non-execution decision records zero provider calls.
- The receipt can be independently compared with the visible state.
- Native WebMCP and human controls reach semantically equivalent results.

## Linked evidence

- `research/market/2026-08-29_QCG_14_COMPARATOR_MARKET_MATRIX.md`
- `research/market/2026-08-29_FEATURE_CLASSIFICATION.md`
- `research/market/2026-08-29_GO_CUT_RESEARCH_MORE.md`
- `evidence/browser/qcg-native-browser-proof-2026-08-28.json`
- `evidence/qa/DAY3_RELEASE_QA_2026-08-28.md`
