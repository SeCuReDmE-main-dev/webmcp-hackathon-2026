# Gemini cold-judge finding disposition

Date: 2026-09-02 (America/Toronto)  
Authority: Gemini supplied an independent cold-judge report. This file records QCG's code-grounded disposition; it is not a certification.

| Finding | Disposition | Code-grounded reason | Required action |
|---|---|---|---|
| Concurrent `simulate()` can consume consent twice | TEST_ONLY | The first call sets `used: true` synchronously before its first `await`; a second JavaScript call observes the consumed state. | Add a simultaneous-call regression test; do not serialize the Worker runtime. |
| `digest()` depends on object key insertion order | DOCUMENT | Exact artifact evidence uses byte digests. Changing generic receipt/profile canonicalization immediately would alter historical hashes and requires a versioned migration. | Keep v3 behavior stable; backlog recursive canonical JSON for a future schema. |
| Worker errors are too generic | FIX | Raw error forwarding would leak internals, but bounded diagnostic categories improve recovery. | Add public error codes without raw messages, paths or stacks. |
| `id()` accepts predictable short entropy | DOCUMENT | IDs are deterministic labels, not authentication tokens; active ID creation already includes UUID or digest entropy. | Document non-authentication semantics; no release code change. |
| Extension does not independently validate quantum consent | REJECT | The extension intentionally never receives consent. Duplicating page authority against a stale snapshot would create a weaker second policy. | Preserve the page-only authority boundary and add negative tests/documentation. |
| `findDemoCard()` uses prefix inference | FIX | A human import whose identifier resembles a fixture could receive the wrong presentation metadata. | Store explicit fixture provenance or an exact mapping. |
| OpenQASM Bell regex accepts extra operations | TEST_ONLY | Executability also requires canonical fixture identity; the regex alone is not the gate. | Add an adversarial modified-program test. |
| Markdown omits decision details | FIX | JSON is complete, but the human-readable evidence omits useful decision provenance. | Add bounded choice, justification, decision ID and timestamp. |
| Revoke after natural expiry lacks a direct test | TEST_ONLY | Current behavior is bounded but not directly covered. | Add regression coverage. |
| IndexedDB lacks `onblocked` recovery | FIX | A blocked upgrade can leave the user without an actionable bounded error. | Add deterministic `onblocked` handling and recovery tests. |
| All public URLs are rejected in collaboration messages | REJECT | URL-free messages are an intentional exfiltration and prompt-injection boundary; structured evidence references carry provenance. | Keep the URL ban and clarify the structured-reference path. |
| WebMCP re-registers every eligible tool on state changes | FIX | Abort-all registration can create a transient tool-unavailable window. | Diff desired tools and maintain one AbortController per registration. |
| Sanitizer rejects the ordinary word `body` | FIX | The isolated word is over-broad; request/response/HTTP bodies remain sensitive. | Narrow the pattern consistently across all sanitization layers. |
| Public repository trails the candidate | FIX | Judges must clone the exact deployed product. | Commit and push only after all release gates pass. |
| `npm ci` is unreliable on Windows | REJECT_AS_REPRODUCED | A fresh candidate copy completed `npm ci`, 69 tests and build; the reported EPERM came from an already-used directory. | Retain a fresh-copy release gate and publish its receipt. |
| Missing video and unsubmitted Devpost entry | AUTHOR_GATE | Both are real submission requirements, but the user reserved publication and submission authority. | Prepare all materials; submit only at Action 245. |
| Reserved software DOI is not public | FIX | A clickable badge must resolve to a published record. | Publish the verified source archive after tag and deployment parity. |

## Protected strengths

- strict Zod and JSON Schema contracts;
- progressive discovery rather than DOM scraping;
- human authority separated from agent recommendation;
- page-private consent;
- multi-layer sanitization;
- complete human-only fallback when WebMCP is unavailable;
- honest exclusions and zero provider/QPU calls.
