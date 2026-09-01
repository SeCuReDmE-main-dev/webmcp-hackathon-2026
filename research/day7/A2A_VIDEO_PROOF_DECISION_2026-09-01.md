# Day 7 — A2A video proof decision

Date: 2026-09-01
Status: accepted by Jean-Sebastien

## Decision

The final Devpost video treats agent-to-agent collaboration as a primary
product proof. The retained sequence contains a genuine Codex observation, a
sanitized handoff to native Gemini in DevTools, a real structured Gemini reply,
a preview, an import explicitly labelled untrusted, and a human
acknowledgement.

## Integrity boundary

- Codex never authors a message attributed to Gemini.
- A rehearsal packet or reply is never reused as final evidence.
- Gemini receives identifiers and bounded evidence references, never source
  code, local paths, secrets, consent tokens, stack traces or network bodies.
- The Gemini reply has declared provenance, not cryptographic identity.
- Human acknowledgement changes collaboration state only.
- Quantum consent, simulation authority and external-effect counters remain
  unchanged throughout the A2A exchange.

## Production consequence

The Companion and native Gemini relay are release gates for the retained video.
If either fails, recording is postponed. Response latency may be removed in
editing, while causal order and the real packet/reply pair remain intact.
