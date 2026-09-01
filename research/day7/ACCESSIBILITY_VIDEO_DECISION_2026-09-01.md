# Day 7 — accessible authority video decision

Date: 2026-09-01
Timezone: America/Toronto
Status: accepted for production; retained footage pending
Decision owner: Jean-Sébastien Beaulieu

## Question

Why should the final QCG demonstration spend scarce time on the visible
`Access` control when QCG is primarily an underlying preflight engine?

## Source-grounded answer

Kasper Kulikowski's article distinguishes the responsibilities cleanly:
accessibility exists for people; semantic HTML, labels, headings, keyboard
support, roles, names and states give assistive technologies a useful interface;
browser agents benefit from that same structure. He also argues that agents can
act as an assistive layer while complementing, rather than replacing, the tools
and workflows people already trust.

Source: <https://www.kulikowski.me/blog/accessibility-the-agentic-webs-most-overlooked-gain>

QCG applies that reasoning to authority. A deterministic engine may calculate a
recommendation correctly, yet the HITL boundary remains incomplete when the
person cannot comfortably perceive, understand or operate the decision surface.
The Access panel supports direct use through browser-local presentation
preferences. Underneath it, explicit names, roles, states, reason codes and
receipts reduce ambiguity for both people and agents.

## Video decision

Reserve `02:08–02:21`—13 seconds—between the progressive WebMCP lifecycle and
the genuine Codex-to-Gemini handoff.

On screen:

1. Open `Access` from the top bar.
2. Set text size to 125% and enable stronger contrast, or retain the single
   change that reads best in the final crop.
3. Keep reduced motion visible as an available preference.
4. Preserve enough decision and effect context to show that authority does not
   change.
5. Display `Accessibility framing: Kasper Kulikowski, 2026-08-20` discreetly.

Voice-over:

> Even for an underlying engine, Access matters to both sides. Kulikowski's
> point is practical: people need a readable decision surface, while agents
> benefit from the same clear names, roles and states—without taking control.

## Claim boundary

- QCG demonstrates functional browser-local presentation preferences.
- QCG preserves one semantic decision surface for human and agent paths.
- The segment makes no WCAG-conformance or accessibility-certification claim.
- The Access panel does not replace semantic implementation, manual testing or
  established assistive technology.
- Agent assistance supplements human access and never substitutes for human
  authority.

## Editorial consequence

This moment gives the Summer article a compact architectural principle:
clarity for agents is useful to humans, and accessibility built for humans also
makes delegated interaction more reliable. The order of responsibility remains
clear: accessibility serves people first; agents benefit from the same honest
structure.
