# BleEeM handoff receipt — WP-LUNA-D3-EVIDENCE

Status: PASS with documented gaps  
Agent: Luna  
Checked date: 2026-08-28  
Scope: read-only research synthesis plus the three explicitly requested artifacts

## Artifacts

- `research/webmcp/devpost-resources.registry.v1.json` — exactly 39 unique Resource-tab URLs; one separately marked supplemental OpenAI Site tools URL.
- `research/webmcp/showcase-evidence.matrix.v1.md` — five-example confirmed/unknown/transfer/anti-pattern matrix.
- `docs/journal/webmcp-qcg.day-log.v1.jsonl` — append-only `webmcp-qcg.day-log.v1` D3-001 through D3-004 entries.

## Validation receipt

- Registry JSON parsed successfully.
- Registry URL uniqueness: 39/39 unique.
- Registry count field: 39.
- Supplemental URL excluded from Resource-tab count: true.
- Journal JSONL parsed successfully: 4/4 records; all records use `webmcp-qcg.day-log.v1`.
- Required journal IDs present exactly once: D3-001, D3-002, D3-003, D3-004.
- `project_id=1404828`, `submission_state=submission_draft`, `submitted=false` recorded.
- No claim of live WebMCP invocation proof.
- No code, README, HACKATHON_STATE/STATUS, Day 2 article, Devpost submission, or external state changed.

## Hashes

SHA-256 values are recorded for the three deliverables below; the receipt hash is reported in the handoff response to avoid a self-referential hash.

- registry: `46CB70C01602DA4BB39AF915FB0E0C2016CE47A87F45F24EC22FAB62F8D41417`
- matrix: `1CB9AEFA5153DC708D6E5567BF8350B23C7C4E2F11C1A0069CC3FBC13FF93D28`
- journal: `F0F94A8F4F6932392DE260FAD7CF6C5BEE13E58BEF7CAE1EAADB35E8A9A29281`

## Gaps

- Fieldwork exposes a capability count but no tool names or read/write split in the inspected surfaces.
- Showcase apps generally do not expose error/retry behavior or backend durability.
- Browser-side WebMCP tool invocation was not independently proven in this pass.
- Locked webinar selection: [How to build and debug WebMCP tools for browser agents](https://www.youtube.com/watch?v=5lJ0a6tdj-4), 399 seconds; focus timestamps 52, 160, 214, 287, 375.
