# Hackathon status

Updated: 2026-08-28

| Workstream | State | Evidence |
|---|---|---|
| Public repository foundation | active and public | README, charter, source registry, license, notices and evidence receipts |
| Candidate history | preserved | Quantech Vid rejected for this challenge; WebCCP deferred; QCG selected |
| Resource analysis | pass | 39 unique Devpost Resource-tab URLs plus a separately tracked OpenAI Site tools page |
| Showcase analysis | pass with explicit gaps | five OpenAI examples mapped to transferable patterns and anti-patterns |
| MVP interaction contract | accepted | four progressive tools and five falsifiable scenario cards |
| Q# browser Worker | pass | `qsharp-lang@1.31.0`, 64/64 shots, Bell invariant true |
| Native WebMCP path | pass in WebMCP-capable browser | inspection, evaluation, local simulation and export invoked natively |
| External Chrome | partial environment gate | app and human fallback load; `document.modelContext` absent until Chrome 149+ WebMCP testing is enabled |
| External/QPU execution | structurally zero | local simulations 1; provider calls 0; QPU calls 0 |
| Automated validation | pass | clean `npm ci`, 11 tests, production build, zero reported vulnerabilities |
| Public deployment proof | pass on expiring preview | hardened Vercel preview returned both security headers and passed the complete native WebMCP/Q# trace |
| Stable deployment | pending authenticated hosting | Cloudflare Workers rejected the 6.07 MB WASM asset at its 5 MB per-file gate; the Vercel proof URL expires and is excluded from Devpost |
| Devpost | project 1404828, `submission_draft` | project exists, `submitted_at=null`, video blank, no submission action performed |
| Day 4 article | draft | `docs/journal/DAY_4_THE_QUANTUM_CALL_I_DID_NOT_MAKE_EN_DRAFT.md` |

Next gate: authenticate an approved hosting provider, convert the passing preview into a stable public deployment, repeat the header and expiry checks, then prepare the video. Final Devpost submission remains an author-only decision.
