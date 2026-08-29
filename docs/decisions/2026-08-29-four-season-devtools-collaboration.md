# ADR — Four-season interface and DevTools collaboration

- Date: 2026-08-29
- Status: **Accepted for implementation**
- Decision owner: Jean-Sébastien Beaulieu
- Preserves: the four-tool browser gate and browser-native HITL workbench

## Context

The QCG prototype now proves real Q# artifact intake, deterministic preflight, visible human authority, bounded local simulation and evidence export. Its current dark/light presentation communicates the workflow but does not yet carry the editorial identity established by the Autumn field report. The next editorial sequence assigns Winter to Days 3–4, Spring to Day 5 and Summer to Day 6.

The project also needs a browser-debugging collaboration surface where Codex, Gemini-oriented clients, Antigravity and the human author can preserve observations without transferring quantum authority to a language model. Chrome documents extension-created DevTools panels and Chrome DevTools MCP page-defined developer tools. Chrome exposes Gemini assistance as a user-facing DevTools capability; its documented public surface does not provide a third-party conversation API.

## Decision

### Seasonal presentation

QCG will expose exactly four visual themes: `autumn`, `winter`, `spring` and `summer`. Autumn remains the default and the selection persists locally. Theme selection changes tokens and decoration only. The same semantic DOM, workflow, decisions, accessibility labels and WebMCP lifecycle remain active in every season.

The gate, evidence cube and provenance lines remain permanent motifs. Trees express the seasons through restrained SVG/CSS layers. Reduced-motion preferences disable decorative transitions.

### Collaboration boundary

The four quantum WebMCP tools remain the only product tools. A separate `qcg-debug-message.v1` ledger will record bounded, schema-validated and append-only collaboration entries. It will expose four page-defined developer tools through `devtoolstooldiscovery`: `read_debug_context`, `post_debug_observation`, `request_human_review` and `export_debug_handoff`.

Agent identity is declared rather than cryptographically verified. Debug messages can reference evidence and request review. They cannot accept, defer or override a recommendation; create, revoke or consume consent; run a simulation; or authorize an external call.

### DevTools panel

An unpacked MV3 extension will create a top-level `QCG` DevTools panel. The panel reads a structurally reduced page snapshot and appends human ledger messages through a narrow `window.__QCG_DEVTOOLS_V1__` bridge. It has no route into consent or execution. The core site remains complete when the extension is absent.

Codex, Gemini CLI or Code Assist, and Antigravity can target the same browser page through Chrome DevTools MCP and exchange structured entries through the ledger. Direct automation of the built-in Gemini DevTools chat remains outside this release.

## Consequences

- Seasonal identity strengthens the four-article editorial sequence without multiplying product states.
- Debug collaboration stays observable and independently testable.
- Deterministic QCG services retain authority over product state.
- The extension can evolve independently from the static application.
- An unpacked extension and experimental DevTools tool category are sufficient for the hackathon proof; Web Store publication, cloud relay and provider credentials remain future work.

## Validation gates

- Existing eighteen tests and production build continue to pass.
- Four themes preserve the same product behavior and accessibility.
- Debug contracts reject unknown fields, duplicate IDs, stale sessions and sensitive content.
- Two distinct agent identities can post to one session and the human can acknowledge the exchange.
- No debug operation changes consent, simulation or QPU/provider counters.
- The F12 panel mirrors current evidence and works in Chrome 151 after explicit user installation.
