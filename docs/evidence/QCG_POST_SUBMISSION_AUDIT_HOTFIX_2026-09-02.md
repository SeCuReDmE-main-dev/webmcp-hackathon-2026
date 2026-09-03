# QCG post-submission audit hotfix receipt — 2026-09-02

Status: `PASS — FINAL HUMAN-VOICE VIDEO REPLACEMENT PENDING`

This receipt records the bounded hardening performed after the WebMCP Challenge
entry was submitted with its provisional safety video. It does not change the
immutable `v0.1.0-hackathon` tag, the tagged source archive or software DOI
[`10.5281/zenodo.22240306`](https://doi.org/10.5281/zenodo.22240306).

## Ground

- Repository: `SeCuReDmE-main-dev/webmcp-hackathon-2026`.
- Validated runtime commit:
  `b1f0e991d9bd30f67800be3b5167708329f48268`.
- Runtime commit matched `origin/main` at promotion time; subsequent
  documentation-only commits do not alter the validated application bytes.
- Scope stayed limited to stale asynchronous results, WebMCP response bounds,
  Companion command parity and explicit panel DOM dependencies.
- The evidence receipt schema remains `webmcp-qcg.evidence-receipt.v3`.
- No QPU, paid provider, credential or external quantum execution was added.

## Execute

### Confirmed and fixed

1. **Stale Worker result attachment — P1.** A private simulation lease now binds
   artifact, manifest, target, recommendation, human decision, consent and
   receipt identities. Consent is consumed once before the first `await`; a
   second run is refused while the Worker is active. A result is committed only
   if the complete lease still matches after the Worker and receipt work.
2. **Evaluation commit consistency — P1 companion fix.** Evaluation is
   serialized and its manifest identity is rechecked before commit, preventing
   stale recommendations and lost counters.
3. **WebMCP response budget — M1/M7.** The public 5,000-byte limit is measured
   with UTF-8 bytes through `TextEncoder`. Oversized responses use a typed
   `{ truncated, summary, budget_bytes }` alternative. Internal export content
   may validate up to 12,000 characters, but cannot cross the public WebMCP
   budget.
4. **Nine-command Companion parity — L5.** MAIN, ISOLATED and background
   validators recognize the same nine bounded commands. V1 accepts the human
   override note and explicitly reports that debug export requires V2; V2
   routing is exercised.
5. **Panel DOM contract — L4.** Required singleton and collection selectors are
   explicit. Validation proves that every literal selector used by `panel.js`
   exists in `panel.html` and rejects missing dependencies with a precise
   initialization error.

### Compensated, documented or accepted

- **H1 MAIN world:** retained as a necessary untrusted intake. Frozen page
  bridge objects plus independent ISOLATED and background sanitization remain
  the defense-in-depth boundary.
- **H2/M5 mutation queue:** rejected as a bug. The caller receives the original
  rejection; only the internal queue tail is reopened to avoid deadlock. State
  revision and serialized commits remain load-bearing and documented.
- **H3 client clock:** accepted within the local-browser trust boundary. Consent
  remains session-local, one-use and revalidated.
- **M2 identifiers:** retained; they are deterministic labels rather than
  authentication tokens and preserve approximately 128 bits for digest-backed
  identifiers.
- **M3 FNV-1a:** retained only for explicitly prefixed, non-cryptographic memory
  tombstones. Evidence receipts continue to use SHA-256.
- **M4/M8:** bounded fixture identity and raw-code filtering remain intentional;
  adversarial tests and documentation cover the distinction.
- **M6, L1, L2, L3, L6 and L7:** deferred as post-video architectural polish.
  None changes the submitted authority, execution or evidence boundary.

## Validate

### Automated and clean-clone gates

- TypeScript and production build: `PASS`.
- Vitest: `104/104 PASS` across 13 files.
- Companion validation, trusted-open, lifecycle, theme and package parity:
  `5/5 PASS`.
- `npm audit`: zero vulnerabilities.
- Clean clone at the exact runtime commit: `PASS`; 25 build output files.
- Vite output: 131 modules; JavaScript 391.76 kB, CSS 23.65 kB; QDK
  WebAssembly remains a separate asset.
- Official `webmcp-evals@0.0.4` live smoke against the canonical origin:
  inspection and evaluation `2/2 PASS`, returning `simulate_first` with high
  confidence.

Adversarial coverage includes two runs against one consent, import/evaluation/
reset replacement during an active Worker, concurrent export counter
preservation, accented and emoji UTF-8 boundaries, all nine Companion commands,
intentional absence of quantum commands from the extension and full DOM
selector parity.

### Real Chrome gate

A fresh session on `https://qcg.securedme.ca/?eval_fixture=simulate-first`
completed this path:

```text
Q# Bell → inspect → evaluate → human Accept
→ 64-shot bounded local simulation → receipt → JSON export prepared
```

Observed final state: one local simulation, one evidence export and zero QPU
submissions. The export action and counter were verified in the application;
the automation harness did not expose a downloadable-file event, so this
receipt does not claim that a new file was persisted by that harness.

The same Chrome pass verified one-click Companion open, second-click close,
reload/reconnect, Dark and Light, Access, Escape/focus return, responsive
navigation, no console warnings or errors and no network loading failures.

No new message was transmitted to Gemini while the author was away. The real
earlier Gemini judge trace is retained; current V1/V2 relay contracts and their
sanitization were revalidated locally without impersonating the author.

## Output

- Immutable deployment package:
  `evidence/releases/qcg-console-b1f0e99-audit-hotfix-docroot.zip`.
- Package SHA-256:
  `6AAA54DC3FCBB0622932890027C2A8C11EFCCF22651E3B20A35B128BBA28B881`.
- Package entries: 25.
- Deployment manifest:
  `evidence/releases/qcg-console-b1f0e99-audit-hotfix-deployment-manifest.json`.
- cPanel transaction plan: `55e11403697e7ff92c6f5a36`; 25/25 paths
  verified; retained rollback backup
  `/home/xacm7978/public_html/qcg.securedme.ca.backup-55e11403697e7ff92c6f5a36`.
- cPanel and Vercel: 23/23 public content files match; `/decisions` returns the
  exact application shell; seven policy headers and WASM/ZIP MIME checks pass.
- Companion production `0.2.5` SHA-256:
  `AC69EFB5293163DF77420C7525B44D7CFD02AB3B76A8A06C8753FDD369F423CB`.
- Companion development `0.2.5` SHA-256:
  `E7FC5BCB876D325BF52E48403AE571FC45E691DD7D671D18FD487FD52369FB5A`.

## Repository hygiene note

An external editor operation briefly committed the local 51 MB provisional
safety video together with the hotfix. Cleanup commit
`873324a174b437618fa2aa73fe00dd8c7005626b` removed it from the current public
tree while preserving the author's local file. Public history was not rewritten
because doing so would destabilize shared history. The current release package
and current repository tree do not contain the video; the earlier blob remains
in Git history and is recorded here transparently.

Two author-owned recording inputs under `asset/video/` remain untracked and
were deliberately excluded from the release commit.

## Receipt

`QCG_POST_SUBMISSION_AUDIT_HOTFIX_PASS`

The runtime, Companion, package, canonical deployment, synchronized Vercel
surface, repository documentation and audit evidence are ready. Devpost
submission `1158343` is already protected by the provisional video. The only
required public replacement is the final demo under three minutes using
Jean-Sébastien's real voice.
