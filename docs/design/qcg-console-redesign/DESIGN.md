# QCG console redesign — canonical three-surface design contract

- Status: implemented, locally validated and author-approved for a Vercel preview; cPanel promotion remains gated
- Date: 2026-08-30
- Branch: `redesign/qcg-console`
- Baseline: `50e7de43bfbf2d2d11397ffa9339273f0c486329`
- Behavioral authority: [`../../DESIGN.md`](../../DESIGN.md)
- Decision authority: [`../../decisions/2026-08-30-qcg-console-redesign-authority.md`](../../decisions/2026-08-30-qcg-console-redesign-authority.md)

## Purpose and boundary

This document is the canonical design contract for a Supabase-inspired QCG
operator console. “Inspired” describes information architecture and restraint:
three calm columns, compact navigation, strong surface hierarchy and useful empty
space. It does not introduce a Supabase dependency, copy its branding or change the
QCG product contract.

The existing `docs/design/DESIGN.md` remains the behavioral authority. This document
defines how that behavior is presented across three surfaces. The implementation
exists on the redesign branch; deployment and public-site replacement remain
separately gated.

## Frozen product contract

The redesign preserves the existing seven views, state machine, validation limits,
receipt semantics and progressive registration rules. It exposes exactly four
quantum tools and four collaboration tools. Q# and OpenQASM remain the two bounded
local executable paths. The other eight ecosystem profiles remain inspection-only.

There is no provider selector, QPU claim, hidden execution path, synthetic metric,
or `Execute` button. `ready_for_external_execution` remains a report state and
never becomes permission. Native Gemini remains a structured, sanitized,
human-mediated relay; the console never presents it as native A2A write access.

## Three surfaces, one semantic contract

### 1. Workbench console

The web workbench is the primary decision surface. It owns artifact import,
profile selection, inspection, deterministic evaluation, human decision, bounded
local simulation and receipt export according to the existing contract.

### 2. Extension side panel

The side panel is a contextual companion for the inspected page. It shows bounded
collaboration context, participants, responsibilities, messages, open review
requests and transfer-package status. Visible human controls may accept, defer or
override the active recommendation through the shared validated command envelope.
The side panel cannot create consent, write into native Gemini, or run a quantum
operation.

### 3. QCG DevTools/F12 panel

The custom `QCG` panel is the inspection and evidence surface. It shows sanitized
page-bound state, the collaboration ledger, tool discovery and human
acknowledgement. It may post bounded messages and record a visible human decision
through the same validated command contract. It cannot create simulation consent,
run a simulation or turn a report state into external execution permission.

All three surfaces use source labels (`human`, `webmcp`, `worker`, `extension`,
`export`) and digest-bound identifiers where applicable. Shared state is sanitized,
bounded and versioned; presentation differences never create a second state
machine.

## Three-column console

At desktop widths, the workbench uses a 3-column composition with a maximum width
of approximately 1,280 px:

| Column | Responsibility | Required content |
| --- | --- | --- |
| Left rail | navigation and provenance | product identity, seven views, source labels, gate stages and active context |
| Center chamber | work and decision | current tab, artifact/profile controls, recommendation or human action, primary evidence |
| Right rail | evidence and authority | `Artifact Integrity`, `Target Evidence`, `Authority & Effects`, receipt and review status |

The center chamber receives the widest measure and strongest contrast. The left rail
can become a compact navigation strip. The right rail remains persistent across
center-view changes on desktop. At tablet and mobile widths it becomes an
explicitly opened drawer and closes after a contextual jump. Its authority content
remains discoverable without hover. No column is decorative: each contains real
application information or explicitly documented empty/loading/error/recovery state.

The first viewport identifies `SecuredMe / WebMCP-QCG`, the promise “Decide before
quantum execution.” and the working-prototype status. It keeps the active gate
state, human authority boundary and a readable evidence summary in view. Marketing
copy never displaces a required control.

## Dark and light themes

Dark and light are contrast-tested token sets, not separate products. Theme changes
surface, text, border, focus and state tokens only; it never changes tools, fields,
routes, capabilities or authority.

- Light: mineral surfaces, graphite text, emerald selected-state accents and cyan
  technical evidence.
- Dark: charcoal/navy surfaces, warm-white text and stronger cyan active-state
  accents.
- Both: opaque or sufficiently dense text surfaces, visible 3 px focus treatment,
  non-color labels for every state and AA contrast for normal text.

Autumn, Winter, Spring and Summer remain the editorial structure of the article
series. They are absent from the product theme contract.

## Authority boundary in the UI

The interface must make the following distinction visible in every surface:

- Agents may observe, propose, contest and request a human review.
- Only the human may approve, deny, reject, defer, remember or forget.
- Only an accepted, explicitly bounded human consent can permit the local Q# or
  OpenQASM simulation path.
- Collaboration messages cannot create, consume or extend quantum consent.
- Inspection-only adapters cannot return executable recommendations.
- Provider credentials and external/QPU execution are absent from the UI.

The final gate stage remains visibly locked and labelled `external — human
controlled`. A status color is always paired with text, reason codes and an icon.

## Visual grammar

Use quiet panel borders, compact radii, an 8 px spacing rhythm, layered but light
shadows and a restrained static technical grid. The gate remains the center of
attention. Avoid trees, botanical overlays, dramatic gradients, animated scenes,
or decoration that can impersonate data.

Use high-legibility sans text for controls and body content, with monospace only for
digests, IDs and reason codes. Sentence case carries explanations. Avoid star
fields, pulsing counters, casino-like success effects, generic clip-art trees and
decorative “metrics” that have no receipt source.

## Responsive and accessibility contract

The semantic order is: identity and navigation, active work, authority/evidence,
then supporting activity. At narrow widths the rail becomes horizontal navigation
and the authority inspector becomes a labelled drawer. No control is removed or
hidden behind a visual-only gesture. The three surfaces support keyboard
navigation, landmarks, readable focus, screen-reader labels, reduced motion and
touch-sized targets. The web surface also offers browser-local text scaling,
stronger contrast, reduced motion, underlined controls and reset. This preference
panel supports direct use; it does not replace semantic HTML, assistive technology,
human testing or a conformance audit. Empty, loading, error, completed, cancelled
and recovery states remain explicit.

## Implementation and proof gate

This implementation is ready for preview only after:

1. all 51 tests and the successful TypeScript/Vite build remain green;
2. all four quantum and four collaboration tool counts remain unchanged;
3. before/after screenshot receipts record surface, theme, viewport, state, commit,
   byte size and SHA-256;
4. 320 px, tablet and desktop checks pass with keyboard, contrast and reduced-motion
   evidence;
5. secret, private-path, provider and unauthorized-effect scans remain clean;
6. Jean-Sébastien approves the visual result before any deployment or public-site
   mutation.
