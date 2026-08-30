# Action 127 — live F12 and same-page MCP collaboration receipt

Date: 2026-08-30 14:34 EDT
Origin: `http://127.0.0.1:4173/`
Browser: Chrome for Testing 150.0.7871.24
Extension: unpacked `companion/qcg-devtools-extension`
Chrome DevTools MCP: 1.8.0

## Ground

The QCG page was opened in an isolated Chrome profile with its unpacked MV3 DevTools extension. DevTools created a real `QCG` panel. The inspected page remained the only source of collaboration state.

## Execute

Chrome DevTools MCP selected the live QCG page as `pageId 1`, enabled experimental third-party tool discovery and discovered exactly four page-bound collaboration tools:

1. `read_debug_context`
2. `post_debug_message`
3. `request_human_review`
4. `export_debug_handoff`

The same MCP client then performed a bounded conversation on session `b6282c73-cbb4-49d4-ab75-b78d46698747`:

- sequence 1 — human panel connection observation;
- sequence 2 — Codex direct MCP observation;
- sequence 3 — declared Gemini-role test fixture observation;
- sequence 4 — Codex decision request for human review.

The native-Gemini-manual lane created handoff `2bae7cf4-963a-416b-bf9d-d58d2be31540`, previewed a structured untrusted reply and imported it as an observation. The reply was a declared fixture; this receipt does not claim that Gemini DevTools generated it.

## Validate

- The `QCG` tab existed inside the real F12 interface.
- The panel read the same session and messages as the inspected page.
- The direct MCP and manual relay lanes remained visibly distinct.
- A `challenge` sent through `post_debug_message` was rejected because that public tool accepts open observations only. The test was repeated with the documented bounded kind, without expanding the contract.
- The manual reply required preview before import.
- The panel exposed no Gemini API, quantum consent or simulation authority.
- Clipboard copy failed only in the headless proof because the document lacked focus; packet creation, preview and import succeeded.
- No review disposition was fabricated. Jean-Sebastien acknowledged the architecture in the active Codex conversation; the structured QCG request remains open until he explicitly chooses a disposition.

## Evidence

- `evidence/qa/day5-spring/qcg-f12-panel-runtime-final.png`
- `evidence/qa/day5-spring/qcg-f12-panel-runtime-review.png`
- `evidence/qa/day5-spring/qcg-f12-panel-runtime-ledger.png`
- live runtime output: four discovered tools, three declared participants and one open human review request

## Result

`PASS_WITH_OPEN_HUMAN_DISPOSITION`

The technical gate is complete: one same-page MCP conversation and one previewed manual Gemini relay are visible in F12. Human authority remains intact because the requested decision is still open.
