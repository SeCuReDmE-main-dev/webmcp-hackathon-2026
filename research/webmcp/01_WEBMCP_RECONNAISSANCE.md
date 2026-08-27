# WebMCP reconnaissance at `fca7462`

## Repository identity

The canonical repository is a Web Machine Learning Community Group specification incubation. It is not a browser agent, an MCP server, or an application runtime. The audited checkout is clean and exactly matches both `origin/main` and `upstream/main` at `fca7462d703c628f4cf110ddadd51e8e5b52a579`.

The tracked-file inventory contains 14 files. Hashes, byte counts, and line counts are frozen in `01_sources/repository/tracked_file_inventory.json`.

## Every tracked file

| File | Role | Audit finding | CCP consequence |
|---|---|---|---|
| `.github/dependabot.yml` | dependency automation | Maintains workflow action versions. | No experimental dependency belongs upstream. |
| `.github/workflows/auto-publish.yml` | normative CI/deploy | Runs `w3c/spec-prod@v2`; build fails on warnings; publishes `gh-pages`. | A future spec PR would need warning-free Bikeshed, but this lab creates no spec change. |
| `.gitignore` | generated-file hygiene | Ignores Bikeshed output such as `index.html`. | Build output can be produced without proposing it. |
| `.pr-preview.json` | PR preview configuration | Connects spec previews to the repository. | Issue-first discussion can link a future preview only after maintainer signal. |
| `CONTRIBUTING.md` | legal/process gate | Substantive contributors must join the WebML CG and identify co-contributors. | An issue is the correct first public surface; membership must be checked before a substantive PR. |
| `LICENSE.md` | contribution license | W3C Community Final Specification Agreement material. | Experimental lab remains separately authored and does not imply upstream licensing acceptance. |
| `Makefile` | local/remote Bikeshed build | Uses local Bikeshed when available, otherwise the CSSWG Bikeshed service. Local lint exists only with a local binary. | Validate the frozen spec, but do not insert CCP code in the checkout. |
| `README.md` | explainer | Defines the imperative page API, lifecycle, cross-origin model, use cases, and non-goals. | Existing `document.modelContext.registerTool()` is the first experiment surface. |
| `declarative-api-explainer.md` | declarative proposal | Form-derived tools remain partly TBD and are not needed for a no-input read tool. | Declarative markup would add scope without evidence; exclude it. |
| `docs/service-workers.md` | supplemental worker proposal | Explores persistence, session IDs, message history, and context-window pressure outside the current normative document lifecycle. | Persistence questions exist, but they do not authorize a session/memory API. |
| `implementation-status.md` | implementation snapshot | Records experimental/origin-trial browser work; product support is version and configuration dependent. | Each surface must be probed and reported independently. |
| `index.bs` | normative specification source | Defines WebIDL, algorithms, lifecycle, origins, observations, security, and privacy. | The lab must conform to the existing tool contract and treat product ingestion as external. |
| `security-privacy-questionnaire.md` | TAG-style security/privacy analysis | Calls out document lifetime, BFCache/disconnected documents, origin boundaries, prompt injection, and browser-agent state. | Packet lifetime, origin validation, content minimization, and hostile-content tests are mandatory. |
| `w3c.json` | W3C metadata | Identifies WebML CG governance and contact metadata. | Community Group resolutions are meaningful project evidence, not personal approval. |

## Normative interface map

At the frozen revision:

- `Document` has a secure-context, same-object `modelContext` attribute (`index.bs` lines 585–587).
- `ModelContext` exposes `registerTool`, `getTools`, `executeTool`, and `toolchange` (`index.bs` lines 603–610).
- A tool has `name`, optional `title`, `description`, optional `inputSchema`, `execute`, and annotations (`index.bs` lines 1057–1077).
- The two current annotations are `readOnlyHint` and `untrustedContentHint` (`index.bs` lines 1068–1071, 1122–1126).
- Registration accepts `exposedTo` and a lifecycle `AbortSignal`; discovery accepts `fromOrigins`; execution accepts cancellation (`index.bs` lines 1145–1191).
- An empty `fromOrigins` list is same-origin only. The laboratory goes further by omitting `exposedTo` entirely and validating the packet’s `scope.origin` against the executing page.

## Lifecycle map

Registration, discovery, and execution are document-bound. The current algorithms clean up pending executions when the caller or target document is destroyed, while the latest merged change intentionally preserves an already in-flight execution when a tool is unregistered. The lab therefore distinguishes:

1. registration cancellation/unregistration;
2. execution cancellation;
3. document destruction/navigation;
4. validation of a returned packet at invocation time.

The Node suite models the first two and the registration side of document destruction. A real browser navigation probe remains required for user-agent behavior.

## Product/harness boundary

The page-observation section is explicitly non-normative. Observation content, additions beyond the tool map, absorption into a browser agent, and timing are implementation-defined (`index.bs` lines 1330–1406). The specification also says it does not prescribe MCP as the format used by the browser agent.

This is the architectural hinge of the study. WebMCP can expose a bounded packet. It cannot require Codex, Gemini-in-Chrome, Copilot-in-Edge, Antigravity, or another harness to store, deduplicate, compact, or forget it.

## Security findings

The source identifies prompt/output injection, malicious tool metadata, over-parameterization, private-browsing boundaries, and cross-origin state leakage. The same-origin state-transfer section is still a TODO at this revision (`index.bs` lines 1761–1765). `untrustedContentHint` is only a signal to the consumer, not sanitization.

Therefore the laboratory adds a stricter experimental contract: 8 KiB maximum, 24-hour maximum TTL, verified digest, exact origin, bounded arrays, no credentials or personal/school data, and rejection of common injection-shaped content. These are laboratory safeguards, not claims about the WebMCP standard.

## Build/process conclusion

The upstream checkout should remain specification-only. A future contribution sequence, if evidence supports it, is:

1. issue with reproducible Origin Trial evidence;
2. maintainer discussion and Community Group process where applicable;
3. a small documentation-only clarification if requested;
4. no WebIDL proposal unless the existing tool surface demonstrably fails and maintainers invite further design.
