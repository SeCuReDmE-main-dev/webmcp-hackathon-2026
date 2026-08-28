# Day 3 release QA — WebMCP-QCG

Status: **PASS for the native vertical slice; release remains gated on stable hosting and video**  
Checked: 2026-08-28

## Automated validation

| Check | Result |
|---|---|
| Clean `npm ci` | PASS |
| Reported dependency vulnerabilities | 0 |
| Test files | 2 passed |
| Automated tests | 11 passed |
| TypeScript check | PASS |
| Vite production build | PASS |
| Modules transformed | 116 |
| Q# Worker asset | 33.86 kB |
| Q# WebAssembly asset | 6,066.57 kB |
| Main JavaScript asset | 298.10 kB |

The clean validation ran from `C:\Users\jeans\Desktop\Case study\.validation\qcg-final-20260828-1555` to avoid mapped-drive module-resolution behavior. The copied source matched the repository prototype at validation time. Vercel independently rebuilt the same source successfully.

## Contract validation

- Exactly four progressive tools: PASS.
- Five policy decisions represented: PASS.
- Unknown properties rejected: PASS.
- Shot, timeout and qubit bounds: PASS.
- Simulation requires `simulate_first`: PASS.
- Simulation requires visible consent: PASS.
- Expired decisions rejected: PASS.
- Cancellation path tested: PASS.
- All five named scenarios return the expected baseline decision: PASS.
- Request limits can falsify a scenario hypothesis: PASS.
- Non-simulation decisions keep external calls at zero: PASS.
- Simulation output is strictly projected: PASS.
- Invocation source attribution distinguishes `human` and `webmcp`: PASS.

## Browser validation

| Surface | Result |
|---|---|
| Local in-app browser native WebMCP trace | PASS |
| Local Q# Worker, 64/64 shots, Bell invariant | PASS |
| Local external-provider counter | 0 |
| External Chrome human fallback | PASS |
| External Chrome native WebMCP | PARTIAL: `document.modelContext` absent until the experimental flag is enabled and Chrome restarts |
| Temporary public Vercel origin | PASS |
| Public security headers | PASS |
| Public native WebMCP trace | PASS |
| Public Q# Worker, 64/64 shots, Bell invariant | PASS |
| Public external-provider counter | 0 |

## Data and editorial QA

- Devpost resource registry: 39 declared, 39 actual, 39 unique.
- Journal: 11 valid JSONL records, sequences 1–11.
- Devpost state: `submission_draft`, `submitted=false`, `submitted_at=null`.
- Day 4 article: first-person singular, zero `we`/`our` pronouns.
- Canonical Codex research-partner disclosure: exactly once.
- Secret-pattern scan across publishable text/source: zero hits.
- Raw Firecrawl cache, Vercel state and raw deep-research reports remain ignored.

## Deployment boundary

Cloudflare Workers Assets rejected the 6.07 MB Q# WebAssembly file at the 5 MB per-file limit encountered in the deployment trace. A hardened anonymous Vercel preview passed the complete public native trace but expires after one hour and remains unclaimed. It is evidence, not the final Devpost live URL.

## Remaining release gates

1. Authenticate a supported hosting provider and create a stable URL.
2. Confirm the two security headers on that stable URL.
3. Repeat the native WebMCP trace on the stable URL.
4. Enable Chrome 149+ WebMCP testing in external Chrome and repeat its trace.
5. Record a public demo under three minutes with audio.
6. Obtain explicit author review and authorization before Devpost submission.
