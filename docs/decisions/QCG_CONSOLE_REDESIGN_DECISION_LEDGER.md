# QCG console redesign decision ledger

Append-only public record for the redesign branch. Add a new dated entry; do not
rewrite or delete an accepted entry. This ledger records design and boundary
decisions, not unverified runtime outcomes.

## Entry 0001 — authorize a presentation redesign under a frozen engine

- Timestamp: 2026-08-30T16:20:30-04:00 (America/Toronto)
- Owner: Jean-Sébastien Beaulieu
- Branch: `redesign/qcg-console`
- Baseline HEAD: `50e7de43bfbf2d2d11397ffa9339273f0c486329`
- Evidence: 41/41 tests passed and the TypeScript/Vite build succeeded at the recorded baseline; see the Day 5 closeout and the redesign ADR.
- Selected: redesign layout, tokens and presentation across the existing workbench, extension side panel and QCG DevTools panel.
- Rejected: new tools, profiles, execution backends, provider integrations, authority actions or product-state changes.
- Impact: implementation may improve legibility while preserving one engine contract and one authority model.
- Proof/status: **Accepted; documentation contract recorded. Source implementation and deployment remain separately gated.**

## Entry format for future additions

Use a new numbered entry with timestamp and timezone, owner, evidence, selected and
rejected options, architectural impact, editorial impact and proof/status. Preserve
the original wording of earlier entries.
