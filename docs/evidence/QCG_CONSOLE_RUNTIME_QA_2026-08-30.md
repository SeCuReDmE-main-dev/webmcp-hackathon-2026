# QCG console runtime QA receipt — 2026-08-30

This receipt records local evidence for the console redesign. It does not claim a
public deployment, formal accessibility certification, native Gemini API access or
external quantum execution.

## Runtime context

- Branch: `redesign/qcg-console`
- Source baseline before these uncommitted integration changes: `e26cdd5`
- Surface tested: Web console at `http://127.0.0.1:4173/`
- Viewports: 1440 × 1024 and 412 × 915
- Themes: Dark and Light
- Public cPanel site: unchanged

## Functional checks

- All seven left-rail entries changed the centre view: Inspector, Console,
  WebMCP, Decisions, Sources, Receipts and Activity.
- The desktop right inspector remained visible while the centre view changed.
- Contextual inspector actions opened their matching centre views.
- At 412 px, the inspector opened as a drawer; a contextual navigation action
  opened Activity and closed the drawer.
- The WebMCP view exposed exactly four quantum tools and four collaboration
  tools with separate headings.
- The console snapshot used `qcg-console-snapshot.v2`, declared surface `web`,
  and excluded the forbidden raw-source, secret and arbitrary-command fields
  covered by the schema tests.
- An arbitrary `eval` command was rejected.
- The Companion request returned a bounded unavailable result when the extension
  was absent instead of waiting indefinitely.

## Accessibility and presentation checks

- Light and Dark persisted independently of application state.
- Dark used cyan for active technical state; Light used emerald for active
  state and primary actions.
- The Light focus token was `#0e7490`, selected to preserve a visible non-text
  focus indicator on light surfaces.
- Access preferences offered 100%, 112.5% and 125% text sizes, stronger
  contrast, reduced motion, underlined controls and reset.
- Preferences persisted in browser-local storage and reset to the standard
  state.
- Escape closed the access panel.
- A skip link targeted the centre workspace.
- No horizontal page overflow was observed at 1440 px or 412 px.

## Automated validation

- `npm test -- --run`: **10 files, 51 tests passed**.
- `npm run build`: **passed**.
- Production application JavaScript: **371.02 kB** uncompressed, excluding
  the QDK WASM worker.
- Production CSS: **14.11 kB** uncompressed.

## Capture receipts

| Capture | SHA-256 |
|---|---|
| `evidence/browser/qcg-console-redesign/after-local-dark-desktop.png` | `53145EFF714C614324148A1D19B9A041C50FB17E6E2F7B027BD816F0ADB12138` |
| `evidence/browser/qcg-console-redesign/after-local-light-desktop.png` | `27EFE9418D2ECC49905C1567C4BA4993CF8295559F23F0D496DA3F75C7A9984B` |
| `evidence/browser/qcg-console-redesign/after-local-light-access-panel.png` | `6750057EA34298B8ADD5B59C3674D2ECB49DB9837817856B05E89228D0634DC4` |
| `evidence/browser/qcg-console-redesign/after-local-light-mobile.png` | `84766A6C336C2E78D4873ED73F86882051989EBAFAA4803B9AE0FB93CAA4C331` |

## Remaining release gates

- Load the MV3 extension manually and verify the Companion side panel in Chrome
  and Edge.
- Verify the QCG F12 panel against the inspected tab after navigation.
- Perform an independent keyboard and assistive-technology review.
- Obtain Jean-Sébastien's visual approval on the preview before any cPanel
  replacement.
