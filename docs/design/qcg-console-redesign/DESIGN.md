# QCG console redesign — canonical three-surface design contract

- Status: approved design direction; implementation remains separately gated
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
defines how that behavior is presented across three surfaces. No implementation,
deployment or public-site change is implied by this document.

## Frozen product contract

The redesign preserves the existing five tabs, state machine, validation limits,
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
requests and transfer-package status. It may prepare or display a handoff, but it
cannot approve a decision, create consent, write into native Gemini, or run a
quantum operation.

### 3. QCG DevTools/F12 panel

The custom `QCG` panel is the inspection and evidence surface. It shows sanitized
page-bound state, the collaboration ledger, tool discovery and human
acknowledgement. It may post bounded messages through the existing collaboration
contract. It cannot mutate the product decision, grant authority or turn a report
state into execution permission.

All three surfaces use source labels (`human`, `webmcp`, `worker`, `extension`,
`export`) and digest-bound identifiers where applicable. Shared state is sanitized,
bounded and versioned; presentation differences never create a second state
machine.

## Three-column console

At desktop widths, the workbench uses a 3-column composition with a maximum width
of approximately 1,280 px:

| Column | Responsibility | Required content |
| --- | --- | --- |
| Left rail | navigation and provenance | product identity, five tabs, source labels, gate stages and active context |
| Center chamber | work and decision | current tab, artifact/profile controls, recommendation or human action, primary evidence |
| Right rail | evidence and authority | `Artifact Integrity`, `Target Evidence`, `Authority & Effects`, receipt and review status |

The center chamber receives the widest measure and strongest contrast. The left rail
can become a compact navigation strip. The right rail can stack below the center
when space requires it, but its authority content must remain discoverable without
hover. No column is decorative: each contains real application information or
explicitly documented empty/loading/error/recovery state.

The first viewport identifies `SecuredMe / WebMCP-QCG`, the promise “Decide before
quantum execution.” and the working-prototype status. It keeps the active gate
state, human authority boundary and a readable evidence summary in view. Marketing
copy never displaces a required control.

## Dark and light themes

Dark and light are contrast-tested token sets, not separate products. Theme changes
surface, text, border, focus and state tokens only; it never changes tools, fields,
routes, capabilities or authority.

- Light: mineral surfaces, graphite text, cool blue/cyan evidence lines and a
  restrained leaf accent.
- Dark: charcoal/navy surfaces, warm-white text, cyan/blue evidence lines and a
  restrained leaf accent.
- Both: opaque or sufficiently dense text surfaces, visible 3 px focus treatment,
  non-color labels for every state and AA contrast for normal text.

The four existing seasonal presentations remain available as visual tokens within
the product contract. Spring is the current art direction; it does not add a fifth
mode or imply a scientific result.

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
shadows and a restrained editorial botanical/circuit provenance motif. The gate
remains the center of attention. Botanical lines may connect real evidence nodes;
they may not obscure controls, impersonate data or look like a live QPU.

Use high-legibility sans text for controls and body content, with monospace only for
digests, IDs and reason codes. Sentence case carries explanations. Avoid star
fields, pulsing counters, casino-like success effects, generic clip-art trees and
decorative “metrics” that have no receipt source.

## Responsive and accessibility contract

The semantic order is: identity and navigation, active work, authority/evidence,
then supporting activity. At narrow widths the columns stack in that order; no
control is removed or hidden behind a visual-only gesture. The three surfaces must
support keyboard navigation, landmarks, readable focus, screen-reader labels,
reduced motion and touch-sized targets. Empty, loading, error, completed,
cancelled and recovery states remain explicit.

## Implementation and proof gate

This design is ready for a separately authorized source implementation only after:

1. the baseline 41/41 test and successful TypeScript/Vite build remain green;
2. all four quantum and four collaboration tool counts remain unchanged;
3. before/after screenshot receipts record surface, theme, viewport, state, commit,
   byte size and SHA-256;
4. 320 px, tablet and desktop checks pass with keyboard, contrast and reduced-motion
   evidence;
5. secret, private-path, provider and unauthorized-effect scans remain clean;
6. Jean-Sébastien approves the visual result before any deployment or public-site
   mutation.
