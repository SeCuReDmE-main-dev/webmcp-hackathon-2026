# QCG Console Companion

This Manifest V3 extension provides two views of the same bounded QCG console:

- **QCG DevTools panel** for the inspected QCG tab;
- **browser side panel** opened from the extension action, with a companion-tab
  fallback when the browser declines `chrome.sidePanel.open()`.

The production manifest is restricted to `https://qcg.securedme.ca/*`.
`manifest.dev.json` adds only `http://localhost:5173/*` and
`http://127.0.0.1:5173/*`. To test development locally, copy the development
manifest to a disposable unpacked-extension directory as `manifest.json`; do
not replace the production manifest in a release package.

## Architecture

`pageBridge.js` runs in the page's main world and prefers
`window.__QCG_CONSOLE_V2__` (`getSnapshot()` and
`executeConsoleCommand(unknown)`). It falls back to the older
`__QCG_DEVTOOLS_V1__` only for collaboration actions during transition.
`contentBridge.js` relays a bounded snapshot and strict command
envelopes through a long-lived `runtime.Port`. `background.js` brokers ports by
`tabId`; panels never receive another tab's snapshot. Both the DevTools panel
and side panel load `panel.html`, `panel.js`, and `panel.css`.

Every command carries `schema_version: 'qcg-console-command.v1'` and the active
session identifier. A v2 recommendation exposes human decision controls only
when `available_commands` includes `human_decision`: Accept, Defer, or Override
with a justification of at least 12 characters. The decision command carries
the active recommendation identifier and is generated only by those buttons;
it is not an MCP tool or a free-text command. Commands are allowlisted end to
end and cannot invoke a simulator, create consent, reach a provider, or send
raw source.

## Page open-companion handshake

The QCG page marks its real button with a single-use UUID:

```html
<button data-qcg-open-companion="<uuid>">Open Companion</button>
```

`contentBridge.js` accepts only a trusted click on that marked control, validates
the UUID, and sends only the request ID to the service worker. This preserves
Chrome's required user-gesture boundary. The worker derives the target from
`sender.tab.id`; it never accepts a page-supplied tab identifier. Tab-specific
options are prepared when the content bridge connects, so `sidePanel.open()` is
the first browser operation on the click path. The content bridge emits a paired
`open_companion_result` with the same UUID and a bounded `side_panel`,
`companion_tab`, or `none` status plus a non-sensitive reason code.

## Shared console information architecture

The exact same `panel.html`, `panel.js`, and `panel.css` render every extension
surface. Its navigation is **Inspector, Console, WebMCP, Decisions, Sources,
Receipts, Activity**. Wide DevTools renders the workbench with the evidence
rail; the narrow side panel converts the same navigation into a scrollable
single pane. Inspector/Sources/Receipts expose metadata only, Console is
bounded messages plus manual Gemini relay, Decisions contains visible human
buttons, and Activity lists participants, messages and relay observations.
Tokens remain dark/light only: emerald action/success, cyan technical state,
gold human authority/evidence, and red rejection/error.

Native Gemini remains a manual relay: create/copy a sanitized packet, paste it
into Gemini DevTools yourself, preview the reply, then explicitly import it as
untrusted data.

## Validate

```powershell
Set-Location companion/qcg-devtools-extension
npm test
```

Manual smoke matrix:

1. In `chrome://extensions`, enable Developer mode and choose `Load unpacked`.
   Select this `qcg-devtools-extension` directory. After any source update,
   press the extension card's Reload control and reload the QCG page.
2. Open the QCG DevTools panel on the public QCG tab; verify its snapshot is
   bounded.
3. Click the page's `Open Companion` button; verify the side panel opens and the
   page reports `Companion side panel opened`. If Chrome declines the side
   panel, verify the explicit companion-tab fallback and status instead.
4. Click the extension action; verify it opens the same side-panel surface.
5. Navigate away and switch tabs; verify the companion shows no other tab's
   context.
6. Use decision, review, memory, observation, and Gemini relay buttons;
   verify QCG records only explicit human actions.
7. Confirm no UI offers consent, simulation, provider, or QPU execution.
