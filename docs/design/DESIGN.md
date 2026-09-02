# WebMCP-QCG design contract

Status: canonical index
Current detailed contract:
[`qcg-console-redesign/DESIGN.md`](qcg-console-redesign/DESIGN.md)

## Product identity

QCG is a technical browser console, not a seasonal interface. The four seasons
describe the editorial history in the README and articles. The product exposes
exactly two presentation themes:

- Dark, the default;
- Light, persisted in the browser.

Both themes render the same DOM, controls, contracts, evidence and authority.
Color never carries a state by itself.

## Information architecture

The console uses three columns on wide screens and one adaptive surface on
small screens:

```text
navigation rail | bounded workbench | evidence inspector
```

Its seven views are Inspector, Console, WebMCP, Decisions, Sources, Receipts
and Activity. Every navigation control changes the center view. The right
inspector remains contextual and persistent on wide screens, becoming an
explicit drawer on smaller screens.

The visual language uses graphite or warm-white surfaces, emerald for primary
actions, cyan for technical state, gold for declared human authority and red
for refusal or error. Panels remain flat, borders precise and motion brief.
There are no trees, seasonal SVGs, shaders, 3-D scenes, ornamental metrics or
animated backgrounds in the product.

The final emblem and Inspector Q mascot follow the bounded distribution rules
in [`QCG_BRAND_RUNTIME_MAP.md`](QCG_BRAND_RUNTIME_MAP.md). Inspector Q is a
decorative observer of interface state, never an authority or verifier.

## Three browser surfaces

One sanitized state model serves:

1. the Web application;
2. the optional QCG panel in DevTools;
3. the optional QCG Companion side panel.

The Web application is fully usable without the extension. Artifact import,
source-in-memory handling, local consent and bounded simulation remain on the
Web page. F12 and Companion can inspect bounded state, collaborate, request
human review and export handoffs. They cannot receive raw source or consent,
launch simulation, reach a provider or submit work to a QPU.

## Exact tool surface

QCG exposes four quantum tools:

- `inspect_quantum_experiment`
- `evaluate_quantum_call`
- `run_bounded_local_simulation`
- `export_quantum_evidence_report`

It separately exposes four collaboration tools:

- `read_debug_context`
- `post_debug_message`
- `request_human_review`
- `export_debug_handoff`

The Companion WebMCP view displays these eight tools and their state. Safe
console commands remain a different interface and are never presented as
WebMCP tools.

## Human authority

An agent may inspect, recommend, challenge and request review. A visible human
button records `accepted`, `deferred` or `overridden`; an override requires a
factual justification of at least twelve characters. Each recommendation can
receive only one human decision. Re-evaluation creates a new recommendation
before another decision can be recorded.

Accepted `simulate_first` can create one expiring, one-use local consent. Once
consumed, revoked or expired, the same recommendation cannot recreate it. The
simulation control and token remain on the Web page.

## Companion onboarding

The public production package is restricted to `qcg.securedme.ca`. A separate
development package adds localhost for local QA. Once the appropriate unpacked
extension is loaded, the Web page's trusted **Open Companion** click requests
the side panel for the active tab. Chrome's extension action is a fallback.

When Companion is absent, the Web page provides a short download and
installation guide and lets the user continue without it. QCG never claims or
attempts silent extension installation.

## Accessibility and responsive contract

- keyboard reachability and visible focus for every interactive control;
- semantic labels and live status for changing state;
- contrast-aware Dark and Light tokens;
- text scale, stronger contrast, reduced motion and underlined controls;
- 320 px, tablet, laptop and wide-screen layouts;
- no state communicated by color alone.

These controls support direct use. They do not claim certification and do not
replace assistive-technology or human testing.

## Release boundary

React, TypeScript, Vite, Zod and the pinned QDK WebAssembly runtime remain the
stack. Q# and OpenQASM Bell fixtures are the only locally executable paths.
Eight additional ecosystem profiles are static inspection only. The repository
contains no provider credential, paid quantum operation, QPU submission or
universal router claim.

Historical seasonal and Stitch design decisions remain available through Git
history and the dated ADRs. They are reference evidence, not the current
runtime contract.
