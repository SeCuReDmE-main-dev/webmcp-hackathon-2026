# ADR — Authorize the QCG console and extension redesign

- Date: 2026-08-30
- Status: **Implemented, author-approved and promoted to the canonical cPanel origin**
- Decision owner: Jean-Sébastien Beaulieu
- Branch: `redesign/qcg-console`
- Baseline HEAD: `50e7de43bfbf2d2d11397ffa9339273f0c486329`
- Baseline verification: 41/41 tests passed; TypeScript/Vite production build succeeded

## Context

WebMCP-QCG has a working browser gate whose engine, safety boundary, receipts and
tool contracts are already proven. The next visual pass needs a clearer operating
console and a coherent relationship between the web workbench, the extension side
panel and the QCG DevTools panel. A visual redesign must remain reversible and must
not turn presentation work into a new execution surface.

The Supabase-inspired reference means a calm, information-dense console with clear
columns, quiet borders and strong hierarchy. It is an art-direction reference only;
it is not a dependency, a brand relationship or permission to copy an external
interface.

## Decision

Authorize a UI and extension presentation redesign on `redesign/qcg-console` with
the canonical contract in
[`docs/design/qcg-console-redesign/DESIGN.md`](../design/qcg-console-redesign/DESIGN.md).
The redesign may change layout, tokens, responsive composition, visual hierarchy,
and presentation components for the three approved surfaces:

1. the primary WebMCP-QCG workbench console;
2. the browser extension side panel;
3. the custom `QCG` DevTools/F12 panel.

The redesign may not change the engine or its public contracts. The following stay
frozen:

- exactly four quantum tools, four collaboration tools and ten profile identities;
- Q# and OpenQASM local-only execution boundaries;
- static-only treatment of Python, C++, QIR and the other non-executable profiles;
- human-only decision, consent, memory and authority dispositions;
- receipt schemas, provenance, validation limits, threat model and rejection rules;
- the five product tabs and the existing state machine;
- the absence of provider credentials, QPU submission, paid execution and an
  `Execute` command.

Native Gemini remains a previewed, sanitized human relay. The redesign must not
claim or create an API for writing directly into Gemini's native conversation.

## Authority and release gates

Agents may observe, propose, challenge and request human review. Only the human may
approve, deny, reject, defer, remember, forget or authorize a quantum consent path.
No visual control, extension message or DevTools action may bypass this boundary.

Before any source implementation is promoted, the change requires before/after
screenshot receipts, SHA-256 hashes, responsive and accessibility checks, the frozen
test/build baseline, a secret/path scan and explicit author approval. This ADR does
not authorize deployment, a public-site mutation, a graphics publication or a
Devpost submission.

Jean-Sébastien later supplied the separate deployment authorization required by
this gate. That authorization and its runtime proof are preserved in the canonical
cPanel deployment receipt; it does not extend to Devpost submission or editorial
publication.

## Consequences

The redesign can make the existing workflow legible across its three surfaces while
keeping one semantic contract. Product code changes, if later authorized, must land
behind the evidence gates and remain separable from this documentation decision.
Any new tool, profile, execution backend, authority action or external-model API is
post-freeze backlog work and requires a new decision.

## Evidence

- [`docs/design/DESIGN.md`](../design/DESIGN.md) — existing behavioral and visual contract
- [`docs/DEVTOOLS_MULTI_AGENT_RUNBOOK.md`](../DEVTOOLS_MULTI_AGENT_RUNBOOK.md) — DevTools collaboration boundary
- [`docs/security/QCG_THREAT_MODEL.md`](../security/QCG_THREAT_MODEL.md) — threat and data-handling boundary
- [`docs/hackathon-build/DAY5_CLOSEOUT_2026-08-30.md`](../hackathon-build/DAY5_CLOSEOUT_2026-08-30.md) — Day 5 proof and stable-release guard
- [`docs/evidence/QCG_CPANEL_LIVE_DEPLOYMENT_RECEIPT_2026-08-30.md`](../evidence/QCG_CPANEL_LIVE_DEPLOYMENT_RECEIPT_2026-08-30.md) — author-authorized canonical promotion and live smoke
