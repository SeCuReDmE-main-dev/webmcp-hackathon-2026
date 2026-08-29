# Actions 99–117 consolidated receipt — 2026-08-29

Status: release candidate validated locally; seasonal cPanel promotion blocked before mutation

## Automated gates

- Baseline preserved: the original 18 tests remain represented inside the full suite.
- Final command: `npm test -- --run`.
- Result: **6 test files, 34/34 tests passed**.
- Final command: `npm run build`.
- Result: TypeScript and Vite passed; 127 modules transformed.
- Production outputs include the Q# Worker, pinned `qsharp-lang@1.31.0` WASM,
  four seasonal SVGs, `.htaccess`, `_headers`, the Bell fixture, JavaScript and CSS.
- `git diff --check` reports no whitespace errors.
- The 50-file public change set scan found zero secret values, `.env` files,
  private paths, private-key markers or raw imported Q#.
- Seasonal contrast passed every measured foreground/background gate; the
  minimum ratio is 7.65:1.

## Seasonal browser proof

Browser: Chrome 151

- Exactly four radio options were exposed: Autumn, Winter, Spring and Summer.
- ArrowRight moved Winter to Spring; End selected Summer; Home selected Autumn;
  ArrowRight returned to Winter.
- Winter persisted after a true page reload.
- At the 320 px gate, `scrollWidth` remained below the measured viewport width;
  all five tabs and all three security cards remained in the semantic DOM.
- At the tablet gate, the browser measured 769 px inner width and 738 px client
  and scroll widths; all five tabs, all three security cards and Winter remained
  present.
- The Activity tab accepted one bounded visible human observation and reported
  IndexedDB storage while quantum counters remained zero.
- Console inspection found WebMCP diagnostic messages and no application error.

Public-safe captures:

```text
D3BA38A8F8FF1F78BE03ECF18DE7BC5C568B021C13F321ADDFBF79FFBB1DAE84  evidence/browser/qcg-winter-desktop.png
F8166498223D293246E26646D1DF5A91C4A974F07787A94A532C3FCD873F2A44  evidence/browser/qcg-winter-mobile.png
```

The same PNG bytes were copied into the independent Winter article dossier.

## Collaboration authority proof

The executable integration fixture discovers exactly four third-party tools by
`devtoolstooldiscovery` and `event.respondWith()`:

1. `read_debug_context`
2. `post_debug_observation`
3. `request_human_review`
4. `export_debug_handoff`

The fixture appends a Codex observation, a Gemini-labelled counter-observation,
a Gemini-labelled review request and an append-only human acknowledgement. The
four sequences are monotonic. `identity_assurance` is `declared`. Authority
remains `ready` and QPU submissions remain `0` before and after the exchange.

This proves the contract and authority boundary. It does **not** claim that a
live external Gemini client or the built-in Gemini DevTools assistant took part.
Loading the unpacked extension and opening the real F12 panel remain manual
Chrome actions.

## Security boundary

- Debug schemas reject unknown fields and duplicate IDs, allowlist structured
  evidence references, and reject recognized high-risk credential, local-path,
  raw-Q#, stack and network-body patterns. The UI explicitly warns participants
  never to paste secrets or source code.
- Third-party tools reject human impersonation; visible human input enters
  through the QCG bridge.
- Human acknowledgement creates a collaboration receipt only. It cannot create,
  accept, consume or replay quantum consent.
- The narrow panel snapshot exposes no raw code, private consent token,
  simulation function, provider credential or external execution command.
- IndexedDB failure changes the reported storage mode to memory and preserves
  the page workflow.

## Seasonal package and cPanel outcome

Package:

```text
9161EFEFD2636ECFB336FB2AF7B0F01181333DA1BC34613314974E6440A6BF87  evidence/releases/qcg-seasonal-2026-08-29.zip
```

The ZIP contains 13 expected paths. `securedme-cpanel-operator` health passed,
reported live mutation enabled and exposed no secret. The required deploy-plan
call for `public_html/qcg.securedme.ca` returned `CPANEL_READ_FAILED` before a
confirmation token was produced. Therefore:

- `mutated=false`;
- no `apply` call was attempted;
- SSH was not used;
- the stable URL still serves the prior accepted release;
- seasonal deployment remains `BLOCKED` until the cPanel read contract succeeds.

## Remaining author gates

- Final graphics and covers: Jean-Sébastien.
- Manual extension installation and optional live external Gemini validation.
- Public video: approximately 30 seconds live plus two minutes NotebookLM.
- Devpost final review and submission.
- Article publication.

No Devpost submission or publication action occurred.

## Winter manuscript receipt

- Repository draft: `docs/journal/WINTER_GATE_DAY_3_4_EN_DRAFT.md`.
- Article draft: independent Winter dossier under `manuscript/`.
- Both copies are byte-identical.
- SHA-256: `FD7D2030ECD7B82757B509ECBB13E47D032EC995C94A9F0742D08CC7833F0AD5`.
- Length: 2,429 words in nine sections.
- Canonical Codex research-partner disclosure: exactly once.
- Collective `we`: zero occurrences.
- Repetitive `cannot` and `does not` constructions: zero occurrences.
- Final graphics, author review and publication remain Jean-Sébastien's gates.
