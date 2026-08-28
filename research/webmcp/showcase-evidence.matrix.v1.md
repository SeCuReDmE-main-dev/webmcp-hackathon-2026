# WebMCP showcase evidence matrix

Checked: 2026-08-28. Official showcase pages and live apps were inspected read-only. Confirmed facts come from rendered page/app state. No live WebMCP invocation is claimed as proven; the browser runtime did not expose callable WebMCP execution during this pass.

| Example | Confirmed facts | Explicit unknowns | Transferable pattern | Anti-pattern risk |
|---|---|---|---|---|
| [Margin Editor](https://developers.openai.com/showcase/margin-editor) · [live](https://margin-local-docs.openai.chatgpt.site) | Notes and comments share one visible editor. 10 tools: 3 read, 7 write. Agent comments retain a separate identity. Local-device storage, no hosted copy/sync/analytics/real-time collaboration. | Error/retry behavior; durability beyond the device; confirmation policy for ordinary edits. | Identity-aware comments; exact-quote collaboration; explicit local persistence boundary. | Treating agent edits as human edits; assuming local storage is durable or synchronized. |
| [Fieldwork // 12](https://developers.openai.com/showcase/ko-field-beat-machine) · [live](https://fieldwork-beat-machine.openai.chatgpt.site) | Visible 12-voice, 16-step sequencer with groove, sound, tempo, save/load, and WAV export state. Showcase says 3 tool capabilities. Agent compose/groove/sound loop is described. | Tool names, read/write split, ownership/provenance, overwrite rules, error/retry behavior, persistence semantics. | Keep agent changes in the canonical sequencer so a person can immediately listen and refine. | Exposing only a count (“3 capabilities”) without a discoverable contract or ownership boundary. |
| [WanderNote](https://developers.openai.com/showcase/wandernote) · [live](https://wandernote.openai.chatgpt.site) | Notion context, destination/dates/preferences, hourly itinerary, map, comments/dismissals, and PDF export are visible. 11 tools: 4 read-only, 7 mutating. Agent suggestions are labelled; human edits are protected. | Backend persistence and failure/retry behavior; live invocation outcome. | Read state before proposing; preserve protected edits; synchronize itinerary and derived map. | Letting a broad update overwrite human itinerary edits or hide source attribution. |
| [Sunday Table](https://developers.openai.com/showcase/sunday-table) · [live](https://sundaytable.openai.chatgpt.site) | 14 meal slots, recipes, preferences, checked groceries, and consolidated aisle list share visible state. 12 tools: 3 read-only, 9 mutating. Agent meals/recipes are distinct from human-protected content; atomic weekly planning is described. | Error/retry behavior; backend durability; live invocation outcome. | Ownership-aware writes plus atomic multi-slot updates and automatically coherent derived groceries. | Mutating meals without protecting human entries or updating derived groceries transactionally. |
| [Paperie](https://developers.openai.com/showcase/paperie) · [live](https://paperie-webmcp-greeting-cards.openai.chatgpt.site) | Recipient context, messages, artwork, template, size, envelope, preview, quantity, and price are visible. 13 tools: 2 read-only, 11 mutating. Review checkpoint explicitly blocks payment/order/printing without human confirmation; demo order is non-transactional. | Error/retry behavior; real production checkout integration; live invocation outcome. | Separate preparation from irreversible side effects; expose current state, price, and final human checkpoint. | Combining agent preparation and purchase, or implying a demo confirmation is a real order. |

## Cross-example invariants

- A canonical visible state is the collaboration surface.
- Read-before-write, field/object ownership, and derived-view coherence are the strongest repeated patterns.
- Empty states are actionable; inspectability is provided by tool manifests and visible current state.
- Hosted deployment is commonly described as Codex and Sites, but implementation durability is not established by showcase copy alone.

## QCG transfer candidates

1. Publish a machine-readable tool manifest with read-only and mutating classification.
2. Make preflight state, ownership/provenance, and conflict rejection explicit.
3. Keep human and agent changes visibly attributable in the same canonical state.
4. Use atomic updates where several QCG views must remain coherent.
5. Put irreversible effects behind a distinct review/confirmation boundary.
6. Ship explicit empty, loading, and recoverable error states and an activity/inspection surface.

## Sources

- [Devpost Resources](https://webmcp.devpost.com/resources)
- [OpenAI Site tools / WebMCP guidance](https://developers.openai.com/codex/webmcp)
- The five official showcase and live-app URLs linked in the matrix.
