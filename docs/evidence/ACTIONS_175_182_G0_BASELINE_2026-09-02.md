# Actions 175–182 — G0 baseline and scope receipt

- Captured: 2026-09-02 00:59 EDT
- Repository: `Z:\03_LABS_EXPERIMENTS\WebMCP-Hackathon-2026`
- Branch: `main`
- HEAD: `16565d66eeb981f94d43a90f20a61764da4cc805`
- Remote: public GitHub `SeCuReDmE-main-dev/webmcp-hackathon-2026`
- Existing tag: `day5-feature-freeze` at `107cd36`
- Node: `v24.18.1`
- npm: `11.16.0`
- Application: `webmcp-qcg@0.1.0`
- Vite lock intent: `^8.2.2`
- Vitest lock intent: `^4.1.11`
- QDK browser package: `qsharp-lang@1.31.0`
- Companion: `0.2.4`

## Worktree classification

No current path was deleted, restored, staged or discarded during G0.

| Class | Paths | Interpretation |
|---|---|---|
| Product code | `prototype/webmcp-qcg/src/**`, target profiles and `styles.css` | Console redesign, multiformat evidence, authority hardening and tests; preserve for validation. |
| Intentional product removals | seasonal SVGs, `season.ts`, `season.test.ts`, `WorkbenchShell.tsx`, `webTransport.ts` | Dark/Light console supersedes seasonal product UI and obsolete shells; validate imports before accepting deletion. |
| Companion code | `companion/qcg-devtools-extension/**` | v0.2.4 side panel, F12 broker, snapshot lifecycle, sanitization, Access and packaging; preserve. |
| Public product packages | `prototype/webmcp-qcg/public/downloads/*.zip` and root public Companion ZIPs | Generated production/development install artifacts; rebuild from validated source before release. |
| Documentation | README, Getting Started, DevTools runbook, design documents | Current narrative and installation contract; reconcile after code gate. |
| Evidence | `docs/evidence/**`, `evidence/runtime/browser-proof/**`, selected visual QA | Public-safe receipts and screenshots; run privacy/claim scan before commit. |
| Local packaging residue | `evidence/releases/obsolete/**`, `evidence/releases/unpacked/**` | Keep locally for comparison; do not publish unpacked duplicates or obsolete ZIPs. |
| Release automation | `scripts/package-companion.ps1` | Candidate packaging script; validate and document before tracking. |
| Repository policy | `.gitignore` | Intends to publish selected sanitized runtime evidence while ignoring raw runtime/release ZIP material. |

Tracked state at capture: 46 modified or deleted paths. `git status --short` collapses untracked directories; `git ls-files --others --exclude-standard` identifies 44 individual untracked files. All are covered by the classes above, with local packaging residue excluded from release.

## Initial claim-to-source manifest

| Claim | Strongest current source | G0 state |
|---|---|---|
| Four quantum tools | `prototype/webmcp-qcg/src/webmcp.ts` | verify at G1/G2 |
| Four collaboration tools | `prototype/webmcp-qcg/src/devtoolsTools.ts` | verify at G1/G2 |
| Human-only authority | `services.ts`, `devtoolsBridge.ts`, strict tests | protected invariant |
| Q# and OpenQASM local Bell execution | adapters, Worker, browser proof receipts | verify after surgery |
| Eight static-only profiles | adapter registry and target profiles | verify after surgery |
| Zero provider/QPU submissions | strict effects contracts and public exclusions | protected invariant |
| Companion v0.2.4 | manifests, validation tests and package parity test | rebuild after G3 |
| Canonical public application | `https://qcg.securedme.ca/` | cPanel canonical; final parity pending |
| Vercel deployment | `https://webmcp-qcg.vercel.app/` | known older build; must be replaced |
| Software DOI | reserved record referenced by README/CITATION | publication author gate pending |
| Devpost | local draft and state documents | intentionally not submitted |

## DAG and monitoring contract

```text
G0 175–182 -> G1 183–199 -> G2 200–213 -> G3 214–225
G3 -> technical publication 226–236
    -> video/article 237–241
    -> separate adjacent proofs 242–243
all required receipts -> 244 -> author action 245
```

- Maximum two simultaneous lanes and one writer in the main repository.
- Warning at 80%, escalation at 100%, release/reroute at 150%.
- One retry for a transient anomaly.
- Persistent release defect remains within its bounded action.
- Systemic authority, secret or false-ready defect stops dependent gates.
- Actions 235, 239 and 245 require Jean-Sébastien's action-time authority.

## Gate result

`G0_PASS`

Actions 175–182 are complete. Scope, worktree ownership, historical evidence and author boundaries are explicit. Code surgery may begin.
