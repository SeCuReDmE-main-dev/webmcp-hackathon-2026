# Day 7 — Two-block hackathon closeout

Status: execution authorized by Jean-Sébastien on 2026-09-02. This plan closes functional development. Later work is limited to defects, evidence, editorial recomposition, graphics, video and submission preparation.

## Frozen intent

- Keep WebMCP-QCG as the browser-native human decision gate.
- Demonstrate one real reusable Companion attachment with FNP-QNN.
- Make the same bounded snapshot contract producible by the SecuredMe FNP-QNN Gateway.
- Keep QCG and Q-bit distinct in this release.
- Treat other gateways, including OpenClaw, as future adapter examples only. Do not install, depend on or claim support for them.
- Preserve exactly four quantum tools and four collaboration tools.
- Preserve human-only authority, page-private consent and zero provider/QPU execution.
- Keep Devpost unsubmitted until Jean-Sébastien authorizes submission.

## Allocation

| Entity | Responsibility | Context budget |
|---|---|---|
| Jean-Sébastien | Intent, visual approval, public claims, spending, publication and submission | Receives only checkpoint receipts and decisions |
| Sol/root | Architecture, cross-repository coherence, integration and release verdict | Reads manifests, diffs and failed evidence only |
| Terra | Contract implementation, adapter code, tests and benchmark fixes | Receives exact paths, schemas and binary gates |
| Luna | Mechanical QA, hashes, drift matrix, screenshots and receipt compression | Receives outputs and public surfaces, not full source history |

Maximum normal concurrency: two lanes. No duplicated audit. Raw logs remain on disk and move between roles by pointer and SHA-256.

## Dependency graph

```text
175A source inventory ─┬─> 175B shared snapshot contract ─> 175C FNP adapter
                       └─> 175D gateway producer ───────────┤
                                                           ├─> CP-1 attachment proof
QCG extension baseline ─────> 175E generic broker adapter ──┘

CP-1 ─> 176A cold-judge findings ─> 176B targeted repairs
     └> 176C deterministic benchmarks ─────────────────────┤
                                                           ├─> 176D clean release QA
                                                           └─> CP-2 feature freeze

CP-2 ─> editorial recomposition, graphics, video and Devpost preparation
```

## Work package 175 — FNP-QNN and Gateway attachment

**Owner:** Terra; **arbitration:** Sol; **mechanical receipt:** Luna.

**One transformation:** make the existing QCG Companion consume a generic, read-only, sanitized host snapshot, with FNP-QNN as the real browser adapter and FNP-QNN Gateway as a compatible producer.

**Ground**

- QCG: `Z:\03_LABS_EXPERIMENTS\WebMCP-Hackathon-2026`
- FNP-QNN: `Z:\SecuredMe Education suite\FNP-QNN-MVP`
- Gateway: `Z:\SecuredMe Education suite\fnpqnn_gateway_MVP`
- Python: `Z:\SecuredMe Education suite\.venv\Scripts\python.exe`
- Never read or expose `Z:\SecuredMe Education suite\.env`.

**Execute**

- Version one bounded host/gateway snapshot contract.
- Extend the Companion only for exact allowlisted QCG, FNP-QNN and Gateway origins.
- Expose bounded FNP-QNN landing/dashboard metadata and evidence counters without raw payloads.
- Add a read-only Gateway snapshot producer using the same contract.
- Keep all execution commands unavailable outside the original site boundaries.

**Validate**

- FNP-QNN, Gateway and QCG tests pass.
- The Companion opens from a trusted FNP-QNN button or extension action.
- QCG, FNP-QNN and Gateway contexts are identified distinctly.
- Source, payloads, paths, secrets, provider configuration and consent do not cross the extension.
- No tool count, simulation authority or quantum contract changes.

**Output**

- Source diffs in the three repositories.
- Contract documentation and integration guide.
- Browser screenshots and sanitized snapshots.

**Receipt**

- Git SHAs, test commands/counts, bundle sizes, extension ZIP hashes, exact origins and visual proof.

**Release condition:** CP-1 passes all binary gates. Otherwise the adapter remains local and the public claim is removed.

## Work package 176 — Audit, benchmark and final feature freeze

**Owner:** Sol; **technical repairs:** Terra; **evidence compression:** Luna; **release decision:** Jean-Sébastien.

**One transformation:** convert the post-attachment candidate into a reproducible release candidate with no open P0/P1 finding.

**Ground**

- Gemini cold-judge report produced from `docs/evidence/GEMINI_ANTIGRAVITY_COLD_JUDGE_PROMPT_2026-09-02.md`.
- Current unit, integration, browser, accessibility, security, deployment and benchmark receipts.

**Execute**

- Classify every finding P0–P3 and fix only release-relevant defects.
- Run deterministic application/extension/FNP/Gateway tests and the already-approved bounded benchmarks.
- Rebuild packages, verify cPanel/Vercel parity, refresh README/DOI/release artifacts and perform clean-clone QA.
- Deploy only a hash-identified candidate that has a tested rollback.

**Validate**

- Zero P0/P1 findings.
- Zero false `ready`, unauthorized effects, secret leaks, digest disagreements or lost receipts.
- All repositories install/test/build through documented commands.
- Public app, Vercel preview, extension package, README and Devpost draft describe the same implemented contract.
- Companion auto-open, close, F12, FNP attachment and cross-tab isolation pass in a real browser.

**Output**

- Final audit matrix, benchmark report, release archive, deployment receipt, tag candidate and feature-freeze record.

**Receipt**

- Exact commands, exit codes, test counts, URLs, SHAs, SHA-256 hashes, screenshots, bundle sizes and rollback state.

**Release condition:** CP-2 passes and Jean-Sébastien approves the freeze. No publication or Devpost submission is implied.

## Post-freeze lane

After CP-2, new ideas go to the post-hackathon backlog. Remaining work is limited to:

1. recomposing and correcting Autumn, Winter, Spring and Summer articles from final evidence;
2. graphics, covers, README narrative and captions;
3. final three-minute video capture and human voice-over;
4. Devpost proofreading and the submission decision reserved to Jean-Sébastien.

## Token and monitoring rules

- Stable context is this file plus one current manifest; do not replay the full conversation.
- Each role receives one work package, exact paths and failed gates only.
- Raw reports stay on disk; handoffs use summaries, IDs and hashes.
- One retry for transient anomalies. Persistent failure changes route. Systemic failure stops the dependent release node.
- Warning at 80% of a package timeout, escalation at 100%, force-release or reroute at 150%.
- Stop agents as soon as their receipt passes.
- Do not estimate token savings without measured usage.

## Decisions reserved to Jean-Sébastien

- final visual acceptance;
- any public compatibility claim;
- publishing either Zenodo record;
- release/tag publication;
- Devpost submission;
- any post-hackathon Q-bit naming or third-party gateway implementation.
