# QCG Companion 0.2.1 repair receipt

Date: 2026-09-01
Status: implementation, automated validation, public deployment and live page-button smoke complete; same-session A2A and F12 proof remain production gates

## Observed symptom

On the live QCG page, `Open Companion` ended with an extension-not-connected
status. The only visible injected script belonged to the general WebMCP browser
support surface, so it did not prove that QCG Companion was attached.

## Root cause and repair

The previous QCG path moved the click through `window.postMessage`, then awaited
`sidePanel.setOptions()` before calling `sidePanel.open()`. Chrome requires
`sidePanel.open()` to follow a user interaction. Version 0.2.1 therefore:

- listens directly for a trusted click on the UUID-marked QCG button;
- rejects synthetic clicks;
- prepares tab-specific panel options when the content bridge attaches;
- makes `sidePanel.open()` the first browser operation on the click path;
- returns bounded status and reason codes;
- keeps a companion-tab fallback when Chrome declines the side panel;
- gives the page a four-second extension handshake window and a precise
  load-or-reload message when no QCG extension is connected.

## Automated evidence

- `npm test` in `companion/qcg-devtools-extension`: PASS.
- Manifest, host, permissions, command allowlist and bridge validation: PASS.
- Trusted-click runtime harness: PASS.
- Synthetic-click rejection: PASS.
- Production application TypeScript/Vite build: PASS.

## Local package

- Archive: `evidence/releases/qcg-console-companion-0.2.1.zip`
- Size: `21870` bytes
- SHA-256: `4B44A5BC9F0D17991A130AEBB1CF1C0D8B87E6E1115590D67AEED83989C3368A`

The archive is local release evidence and is ignored by Git. The auditable
extension source remains under `companion/qcg-devtools-extension/`.

## Live Chrome proof after unpacked-extension reload

Jean-Sebastien reloaded the unpacked QCG Companion, restarted Chrome and pinned
the extension. Codex then claimed the fresh Chrome tab, opened the canonical
public application and observed this bounded state transition:

- before click: `Companion not requested`;
- trusted human-surface click: `Open Companion`;
- after click: `Companion side panel opened`.

The same live page exposed the functional `Access preferences` dialog with
browser-local text-size, stronger-contrast, reduced-motion and underlined-control
settings. Its visible disclaimer correctly separates direct-use support from
accessibility certification.

Result: **PASS for trusted page-button opening on the canonical origin.**

## Remaining A2A and F12 gate

The final retained smoke must still prove same-tab and same-session attachment,
F12 panel state, the Codex-to-Gemini manual relay and unchanged quantum
authority. The successful opening status alone does not prove those later
states.

## Public application deployment

- cPanel plan: `8bd0f01b8e1100c995f6455d`
- Package: `qcg-console-2026-09-01-companion-fix.zip`
- Package SHA-256: `44374087298B828877FE450A9DD63DDFD2B1311C7095BA3646DB235DC83A81F3`
- Verified paths: `14/14`
- Atomic apply: PASS
- Rollback restoration invoked: no
- Staging cleanup: complete
- Public HTTP status: `200`
- Public and local `index.html` SHA-256: `FBA3C3CE693FF1B11B22E425C7B8047708E33378178E3639F21331EF6EBB8C7C`
- Public JS and CSS hashes match the local production build.
- Public JS contains the UUID-marked trigger and the explicit disconnected
  extension status.
