# WebMCP-QCG — execution registry (Actions 1–117)

Created: 2026-08-29
Purpose: one evidence-bearing status surface for the complete hackathon path
Status values: `DONE`, `IN_PROGRESS`, `PENDING`, `BLOCKED_EXTERNAL`, `AUTHOR_GATE`, `DEFERRED`, `PRESERVED`

An action reaches `DONE` only when its evidence path exists and supports the stated result. This registry tracks code lanes without authorizing this documentation lane to modify prototype code.

## A. Governance and preservation — 1 to 8

| ID | Action | Owner | Status | Evidence or next gate |
|---:|---|---|---|---|
| 1 | Capture repository branch and working-tree state | Docs lane | DONE | `main...origin/main`; live `git status` captured 2026-08-29 |
| 2 | Preserve the pre-existing `docs/design/DESIGN.md` modification | All lanes | PRESERVED | File remained untouched by this lane |
| 3 | Refresh the live Devpost expectations contract | Docs lane | DONE | `DEVPOST_LIVE_EXPECTATIONS_2026-08-29.md` |
| 4 | Record challenge, project and submission-wizard identifiers separately | Docs lane | DONE | IDs `31011`, `1404828`, `1158343` in expectations document |
| 5 | Preserve final submission as an author-only action | Jean-Sébastien | AUTHOR_GATE | `.devpost-hackathon-state.json`; expectations document |
| 6 | Preserve zero authorization for QPU or paid-provider execution | All lanes | DONE | `HACKATHON_STATE.json`; ADR 2026-08-29 |
| 7 | Isolate this lane to docs, evidence and article files | Docs lane | DONE | Prototype source unchanged by this lane |
| 8 | Create the 97-action status registry | Docs lane | DONE | This file |

## B. Market and comparator research — 9 to 22

| ID | Action | Owner | Status | Evidence or next gate |
|---:|---|---|---|---|
| 9 | Define the actual pre-execution job to be done | Docs lane | DONE | Comparator matrix, “Actual job to be done” |
| 10 | Analyze qBraid Agent Mode, MCP and `TargetProfile` | Docs lane | DONE | Comparator #1; primary links |
| 11 | Analyze Open Quantum MCP quote and spend flow | Docs lane | DONE | Comparator #2; primary links |
| 12 | Analyze official Qiskit MCP Servers | Docs lane | DONE | Comparator #3; maintainer docs/repository |
| 13 | Analyze Qiskit transpilation and IBM Runtime access | Docs lane | DONE | Comparator #4 |
| 14 | Analyze Amazon Braket spending limits and pricing | Docs lane | DONE | Comparator #5 |
| 15 | Analyze Quantinuum Nexus compile, cost and execution jobs | Docs lane | DONE | Comparator #6 |
| 16 | Analyze Classiq as synthesis and provider platform | Docs lane | DONE | Comparator #7 |
| 17 | Analyze Azure QDK/Q# local and browser execution | Docs lane | DONE | Comparator #8 |
| 18 | Analyze CUDA-Q as a heterogeneous engine | Docs lane | DONE | Comparator #9 |
| 19 | Analyze PennyLane resource inspection | Docs lane | DONE | Comparator #10 |
| 20 | Analyze Q-CTRL Fire Opal validation and optimization | Docs lane | DONE | Comparator #11 |
| 21 | Analyze Qiskit Experiments, MLflow and the manual substitute | Docs lane | DONE | Comparators #12–14 |
| 22 | Publish the fourteen-comparator decision matrix | Docs lane | DONE | `research/market/2026-08-29_QCG_14_COMPARATOR_MARKET_MATRIX.md` |

## C. Ecosystem and viability decisions — 23 to 30

| ID | Action | Owner | Status | Evidence or next gate |
|---:|---|---|---|---|
| 23 | Classify ecosystem roles without implying partnerships | Docs lane | DONE | `2026-08-29_PARTNER_DECISION_MATRIX.md` |
| 24 | Record public partner-language guardrails | Docs lane | DONE | Partner matrix, language guardrail |
| 25 | Classify proven, must-next, later and cut features | Docs lane | DONE | `2026-08-29_FEATURE_CLASSIFICATION.md` |
| 26 | Issue GO narrow / CUT general / RESEARCH MORE verdict | Docs lane | DONE | `2026-08-29_GO_CUT_RESEARCH_MORE.md` |
| 27 | Define the narrow executionless evidence-firewall differentiation | Jean-Sébastien + Docs | DONE | Verdict and ADR |
| 28 | Define a five-user market validation protocol | Docs lane | DONE | Verdict, “Research-more gate” |
| 29 | Recruit five multi-surface quantum users | Jean-Sébastien | PENDING | Named participant list and consent |
| 30 | Re-evaluate commercial viability after user tests | Jean-Sébastien | PENDING | Test results and updated verdict |

## D. Product contract — 31 to 42

| ID | Action | Owner | Status | Evidence or next gate |
|---:|---|---|---|---|
| 31 | Accept the browser-native HITL workbench ADR | Jean-Sébastien | DONE | `docs/decisions/2026-08-29-browser-native-hitl-quantum-preflight-workbench.md` |
| 32 | Define a real OpenQASM 3 or Q# artifact intake schema | Implementation lane | DONE | Q# v2 contracts, real file import and public Bell fixture |
| 33 | Bind a digest to the real artifact bytes and parser version | Implementation lane | DONE | `crypto.ts`; one-byte-change regression |
| 34 | Define the normalized target-profile schema | Implementation lane | DONE | `types.ts`; versioned target-profile fixtures |
| 35 | Add source, observed time, expiry and profile hash | Implementation lane | DONE | `targetProfiles.ts`; known/stale/unknown tests |
| 36 | Define exact scientific evidence-reuse semantics | Implementation + domain review | DONE | Strict reuse key; exact-versus-near regression |
| 37 | Add `known`, `stale` and `unknown` resource states | Implementation lane | DONE | Target-profile policy and false-ready regression |
| 38 | Preserve exactly five decision outcomes | Implementation lane | DONE | Existing contracts and service tests |
| 39 | Model `ready`, `consent_required`, `authorized`, `expired`, `revoked` and `consumed` separately | Implementation lane | DONE | `services.test.ts`; explicit state transitions and zero-call revocation test |
| 40 | Finalize the canonical portable receipt schema | Implementation + Docs | DONE | Evidence receipt v2, export and v1 conversion test |
| 41 | Preserve the absence of a provider `submit_job` tool | All lanes | DONE | ADR and feature classification |
| 42 | Keep agent responses compact and raw artifact processing local | Implementation lane | DONE | Current WebMCP descriptions and Q# Worker boundary |

## E. Workbench interaction and accessibility — 43 to 52

| ID | Action | Owner | Status | Evidence or next gate |
|---:|---|---|---|---|
| 43 | Map the workbench information architecture | Design lane | DONE | Five-tab implementation plus `docs/design/DESIGN.md` |
| 44 | Add the artifact inspection panel | Design + Implementation | DONE | Live real-file import and byte digest receipt |
| 45 | Add target-profile and freshness panel | Design + Implementation | DONE | Visible sourced snapshot, hash and expiry state |
| 46 | Preserve the decision, reason-code and next-action panel | Implementation lane | DONE | Five deterministic recommendations on real state |
| 47 | Expand visible authority and consent state | Design + Implementation | DONE | Accepted/deferred/overridden plus expiring one-use consent |
| 48 | Preserve receipt preview and export controls | Implementation lane | DONE | Existing JSON/Markdown export |
| 49 | Display empty, partial, active, cancelled, error and recovery states | Design + Implementation | DONE | Implemented state surfaces and cancellation regression |
| 50 | Use text and icons in addition to color | Design lane | DONE | Lighthouse accessibility 1.00; visible labels/icons |
| 51 | Complete the full path by keyboard | Design + QA | DONE | Home/End tab navigation receipt |
| 52 | Add one-step recovery instructions for every blocked state | Design + Implementation | DONE | Specific recovery actions in UI and design matrix |

## F. Security and authority — 53 to 61

| ID | Action | Owner | Status | Evidence or next gate |
|---:|---|---|---|---|
| 53 | Preserve strict schemas and unknown-property rejection | Implementation lane | DONE | `contracts.ts`; automated tests |
| 54 | Preserve explicit bounds for shots, qubits and timeout | Implementation lane | DONE | Current schema tests |
| 55 | Preserve `AbortSignal` registration cleanup | Implementation lane | DONE | Current WebMCP lifecycle tests |
| 56 | Add consent scope, expiry, revocation and one-time consumption tests | Implementation lane | DONE | Recommendation-bound token, expiry, cancellation, explicit revocation, consumption and replay tests pass |
| 57 | Treat unsourced or expired provider facts as unknown/stale | Implementation lane | DONE | Unknown/stale false-ready regressions |
| 58 | Bind artifact, profile and decision hashes in the receipt | Implementation lane | DONE | Evidence receipt v2 and export tests |
| 59 | Keep secrets, provider credentials and raw code out of compact agent results | Implementation lane | DONE | Current local-only boundary; security review |
| 60 | Write the workbench threat model | Security + Docs | DONE | `docs/security/QCG_THREAT_MODEL.md` |
| 61 | Test malformed, oversized, expired and replayed inputs | QA lane | DONE | Service-contract negative regressions |

## G. Executable proof — 62 to 72

| ID | Action | Owner | Status | Evidence or next gate |
|---:|---|---|---|---|
| 62 | Preserve one canonical service layer for human and agent controls | Implementation lane | DONE | Current service architecture |
| 63 | Preserve five deterministic scenario fixtures | Implementation lane | DONE | `catalog.ts`; service tests |
| 64 | Preserve the pinned bounded Q# Worker | Implementation lane | DONE | `qsharp-lang@1.31.0`; browser receipt |
| 65 | Preserve the passing automated baseline | QA lane | DONE | 18/18 tests; local and live WebMCP smoke 2/2; live acceptance receipt |
| 66 | Preserve the native in-app-browser trace | QA lane | DONE | `qcg-native-browser-proof-2026-08-28.json` |
| 67 | Repeat native discovery in external Chrome 149+ | QA lane | DONE | Official live `webmcp-evals` Chrome trace 2/2 |
| 68 | Implement one real artifact parser | Implementation lane | DONE | Pinned Q# compiler/Worker plus import error cases |
| 69 | Implement one dated target-profile fixture | Implementation lane | DONE | Two sourced, hashed and expiring JSON snapshots |
| 70 | Test exact and near-match evidence reuse | QA lane | DONE | Exact reuse and changed-observable regression |
| 71 | Add a false-ready regression suite | QA lane | DONE | Unknown and stale target evidence never report ready |
| 72 | Preserve zero external calls across all five current decisions | QA lane | DONE | `services.test.ts`; browser counters |

## H. Deployment — 73 to 80

| ID | Action | Owner | Status | Evidence or next gate |
|---:|---|---|---|---|
| 73 | Preserve the passing production build | Implementation lane | DONE | Day 3 QA receipt |
| 74 | Record the Cloudflare Worker per-file WASM limit | Hosting lane | DONE | `HACKATHON_STATE.json`; Day 4 draft |
| 75 | Preserve the expiring Vercel proof as evidence only | Hosting lane | DONE | Temporary preview receipt; excluded from Devpost live URL |
| 76 | Deploy to a retained stable host | Hosting lane | DONE | `https://qcg.securedme.ca/`; live acceptance receipt |
| 77 | Verify security headers on the retained URL | Hosting + QA | DONE | `evidence/qa/LIVE_ORIGIN_ACCEPTANCE_RECEIPT_2026-08-29.md` |
| 78 | Verify WebAssembly MIME type and full asset delivery | Hosting + QA | DONE | Live hashes and `application/wasm` in acceptance receipt |
| 79 | Define cache and integrity behavior for the pinned WASM asset | Hosting + Security | DONE | Release manifest plus hash-verified cPanel transaction |
| 80 | Repeat the complete native trace on the stable URL | QA lane | DONE | Live `webmcp-evals` 2/2 plus progressive simulation/export trace |

## I. Evidence and QA — 81 to 87

| ID | Action | Owner | Status | Evidence or next gate |
|---:|---|---|---|---|
| 81 | Create the source and claim registry | Docs lane | DONE | `evidence/SOURCE_CLAIM_REGISTRY_2026-08-29.md` |
| 82 | Preserve the existing source manifest | Docs lane | DONE | `evidence/SOURCE_MANIFEST.md` |
| 83 | Preserve browser screenshots and machine-readable receipts | QA lane | DONE | `evidence/browser/` |
| 84 | Publish the market, partner, feature and verdict documents | Docs lane | DONE | `research/market/` |
| 85 | Validate every new public URL and local cross-reference | Docs + QA | DONE | `evidence/qa/PUBLIC_LINK_CHECK_RECEIPT_2026-08-29.md`; 55 public URLs, 26 local links, zero unresolved |
| 86 | Scan public artifacts for secrets and private paths | Security + QA | DONE | `evidence/qa/PUBLIC_ARTIFACT_SCAN_2026-08-29.md` |
| 87 | Reproduce install, tests and build from a clean clone | QA lane | DONE | `evidence/qa/CLEAN_CLONE_RECEIPT_2026-08-29.md`; public commit `9dfb625`, 18/18 tests and production build pass |

## J. Editorial and video — 88 to 93

| ID | Action | Owner | Status | Evidence or next gate |
|---:|---|---|---|---|
| 88 | Open the Day 4 market-relevance/HITL research folder | Docs lane | DONE | Article `recherche/06_day_4_market_relevance_hitl/` |
| 89 | Create the private append-only brainstorming ledger | Docs lane | DONE | Article-local `private/BRAINSTORMING_LEDGER_APPEND_ONLY.md` |
| 90 | Create the public-safe research trace | Docs lane | DONE | `research/day4/PUBLIC_SAFE_TRACE_2026-08-29.md` |
| 91 | Draft the English Day 4 market-relevance article | Docs lane | DONE | `WEBMCP_QCG_DAY_4_MARKET_RELEVANCE_EN_DRAFT.md` |
| 92 | Use first-person singular and one canonical Codex disclosure | Docs lane | DONE | Disclosure count gate in article draft |
| 93 | Record the 30-second live plus 2-minute NotebookLM video decision | Jean-Sébastien + Docs | DONE | `VIDEO_DECISION_2026-08-29.md`; `VIDEO_SCRIPT_AND_STORYBOARD_2026-08-29.md` |

## K. Devpost closure — 94 to 97

| ID | Action | Owner | Status | Evidence or next gate |
|---:|---|---|---|---|
| 94 | Preserve the complete Devpost description draft | Docs lane | DONE | `devpost-submission.md` |
| 95 | Add the retained stable application URL | Jean-Sébastien + Hosting | DONE | `https://qcg.securedme.ca/`; passing live trace |
| 96 | Upload the final public video under three minutes with audio | Jean-Sébastien | PENDING | Public video URL and QA receipt |
| 97 | Review every field and explicitly authorize final submission | Jean-Sébastien | AUTHOR_GATE | `FINAL_AUTHOR_REVIEW_CHECKLIST_2026-08-29.md`; direct author action |

## L. Deferred three-year editorial vision — 98

| ID | Action | Owner | Status | Evidence or next gate |
|---:|---|---|---|---|
| 98 | Research and draft a source-grounded three-year vision for broadly accessible AI-assisted quantum simulation; use the supplied LinkedIn post and private prior writing only as provenance of Jean-Sébastien's intuition, verify the underlying Japanese primary research, and separate feasible trends, unknowns and speculation | Jean-Sébastien + Docs research lane | DONE | `research/day4/ACTION_98_THREE_YEAR_QUANTUM_ACCESS_VISION_2026-08-29.md`; `evidence/qa/ACTION_98_THREE_YEAR_VISION_RECEIPT_2026-08-29.md`; 17 attributed sources and four explicit evidence levels |

## M. Seasonal redesign and DevTools collaboration — 99 to 117

| ID | Action | Owner | Status | Evidence or next gate |
|---:|---|---|---|---|
| 99 | Capture the executable baseline and accept the seasonal/DevTools architecture | Root/Sol | DONE | `evidence/qa/ACTION_99_SEASONAL_DEVTOOLS_BASELINE_2026-08-29.md`; seasonal DevTools ADR |
| 100 | Produce the complete English Winter introduction and cover brief | Root/Sol | DONE | `docs/journal/DAY_3_4_WINTER_INTRODUCTION_EN.md`; `DAY_3_4_WINTER_COVER_BRIEF_EN.md` |
| 101 | Create the separate Day 3–4 Winter article dossier and provenance manifest | Luna | DONE | New dated article folder; `research/PROVENANCE_MANIFEST.md`; Autumn boundary recorded |
| 102 | Classify Stitch screens and quarantine generated or unsupported claims | Luna | DONE | `docs/design/STITCH_ASSET_TRIAGE.md`; 113/113 screens classified; raw ZIP remains ignored |
| 103 | Rewrite the canonical seasonal and collaboration design system | Root + Luna | DONE | `docs/design/DESIGN.md`; executable tool-registration wording reconciled |
| 104 | Replace the Stitch prompt with a functional seasonal workbench prompt | Root + Luna | DONE | `docs/design/STITCH_PROMPT.md`; five tabs/four tools/four seasons locked |
| 105 | Create four seasonal token sets and decorative SVG assets | Terra | DONE | Four reviewed SVGs plus theme tokens; final illustration remains Jean-Sébastien's graphic pass |
| 106 | Replace Light/Dark with an accessible persistent season selector | Terra | DONE | Four-option radiogroup; keyboard and reload persistence browser proof |
| 107 | Validate seasonal accessibility, responsive layouts and reduced motion | Terra + Luna | DONE | `SEASONAL_CONTRAST_RECEIPT_2026-08-29.md`; 320 px, tablet and desktop browser checks |
| 108 | Add strict versioned debug-collaboration contracts | Terra | DONE | `debugContracts.ts`; strict contract tests |
| 109 | Implement the bounded append-only IndexedDB ledger | Terra | DONE | `debugLedger.ts`; bounded persistence, fallback and duplicate tests |
| 110 | Register four separate third-party DevTools tools | Terra | DONE | `devtoolstooldiscovery` lifecycle and authority-boundary tests |
| 111 | Add collaboration UI and the narrow F12 bridge | Terra | DONE | Activity UI, structurally reduced cached bridge and tests |
| 112 | Build the unpacked MV3 QCG DevTools panel | Terra | DONE | Valid MV3 package under `companion/qcg-devtools-extension/`; manual installation remains an author gate |
| 113 | Document shared-page attachment for Codex, Gemini and Antigravity | Root/Sol | DONE | `docs/DEVTOOLS_MULTI_AGENT_RUNBOOK.md`; official CLI flags and `pageIdRouting` verified 2026-08-29 |
| 114 | Prove a structured Codex → Gemini → human exchange | Terra + Root | PARTIAL | Executable declared-identity protocol fixture passed with unchanged authority; live external Gemini and installed F12 panel remain manual gates |
| 115 | Complete code, security, accessibility and visual QA | Terra + Luna | DONE | 34/34 tests, build, browser checks, AA contrast, public scan and consolidated receipt |
| 116 | Deploy the seasonal application and distribute public-safe assets | Root + Luna | BLOCKED | Package and public-safe Winter captures complete; cPanel deploy plan returned `CPANEL_READ_FAILED` with `mutated=false` |
| 117 | Finalize the Day 3–4 manuscript and update public drafts without submitting | Root/Sol | DONE | Mirrored 2,429-word Winter draft, README and Devpost draft; publication remains author-controlled |

## Current total

This registry reports evidence rather than assuming completion. The original 97-action base and completed Action 98 remain unchanged. Of Actions 99–117, seventeen are `DONE`, Action 114 is `PARTIAL` at the live-external-client gate and Action 116 is `BLOCKED` before cPanel mutation. `AUTHOR_GATE` protects manual extension installation, final graphics, publication, video upload and Devpost submission. The working release candidate stays locally valid while the prior accepted public release remains intact.
