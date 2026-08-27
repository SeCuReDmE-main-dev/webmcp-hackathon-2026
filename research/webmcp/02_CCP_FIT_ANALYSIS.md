# CCP fit analysis

## Decision

No prior CCP codebase is a logical direct import into WebMCP. The useful material is a set of invariants; the implementation must be a clean external laboratory.

## Live comparison

| Project | What exists | What transfers | What must not transfer |
|---|---|---|---|
| Commonly, `docs/cap-context-continuity-packet` at `0e3612f3` | Optional `commonly.ccp.v1` CAP event metadata with owner, provenance, freshness, and references; default-off; no memory body. | Versioned envelope, explicit provenance/freshness, pointer-not-prompt rule, opt-in posture. | Agent/pod ownership fields, CAP event coupling, or any assumption that a driver injects the packet. |
| III, `fix/queue-metadata-continuity` at `bc5c0208` | Opaque invocation metadata survives builtin, Redis, and RabbitMQ queues, retries, DLQ, and redrive while remaining separate from business data. | Transport continuity must preserve bytes and provenance without interpretation. | Queue adapters, broker semantics, retries, or calling transport metadata “memory.” |
| Dakera, `experiment/fractal-stigmergy-swarm` at `0264837` | Handoff fixtures and byte/token comparisons; compact decision-only forms beat full envelopes; a full JSON envelope can overfetch. | Measure actual payload size; include only decision-critical state; treat freshness as a reliability claim. | Full transcript, graph-recall claims, or timestamp-only freshness. The user-owned `output/` remains untouched. |
| OpenAI Swarm study, `phase-three-internal` at `269befb` | Caller-controlled local JSON stamping, validation, persistence, and helper handoff. | Explicit caller control, no automatic prompt injection, small helper boundary. | Local-store semantics, `_ccp_*` runtime fields, and timestamp-only stale checks. |

## Retained invariants

1. The packet is an explicit, versioned contract.
2. It is bounded and opt-in.
3. It carries provenance and a freshness claim that can be rejected.
4. It contains references and decisions, not a transcript or hidden prompt.
5. Transport does not interpret the packet.
6. The receiver decides whether to use it and must treat it as untrusted.
7. The packet is not authority: it cannot grant cross-origin access or user permission.
8. Measurement includes the envelope cost; compact JSON is not assumed to be cheaper.

## WebMCP-specific correction

The previous packages mostly move continuity between processes controlled by one application. WebMCP exposes a page-controlled result to an agent product. That changes the trust model:

- the producing page may be compromised or adversarial;
- the browser controls origin exposure, but the harness controls ingestion;
- the packet’s digest detects mutation, not a trustworthy producer;
- a `readOnlyHint` describes side effects, not truthfulness;
- `untrustedContentHint` is mandatory, but still only advisory.

## Placement verdict

`ccp.webmcp.experiment.v1` belongs in `06_experiments/ccp_webmcp_lab`, outside the upstream checkout. If the read-only tool produces no measurable gain or agents cannot discover it, that result does not justify a WebMCP resource or session API. It first identifies either envelope overhead or a product integration gap.

## Alternative contribution if CCP is out of scope

Issue #231 is open, unassigned, and contains a direct maintainer welcome for a documentation clarification explaining that real agents will need smart handling of repeated observations. This is the only identified fallback with positive maintainer language. It remains gated on the issue still being open/unclaimed and on a fresh maintainer check; it is not authorization to open a PR now.
