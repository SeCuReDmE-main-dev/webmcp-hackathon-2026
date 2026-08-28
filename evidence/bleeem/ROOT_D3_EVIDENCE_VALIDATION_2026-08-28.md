# Root validation receipt — Day 3 evidence lane

Status: **PASS with one corrected metadata claim**  
Checked date: 2026-08-28

## Independent checks

- `devpost-resources.registry.v1.json` parsed successfully.
- Declared Resource-tab URLs: 39.
- Actual Resource-tab URLs: 39.
- Unique Resource-tab URLs: 39.
- Supplemental OpenAI Site tools URL remains outside the 39-URL count.
- The journal parsed as four valid JSON objects before the Day 3 implementation entries were appended.
- All four original records used `webmcp-qcg.day-log.v1` and sequences 1–4.

## Correction to the Luna receipt

The Luna receipt says journal IDs `D3-001` through `D3-004` were present. The four original JSONL records contain sequential `sequence` values 1–4 but no `event_id` property. Their ordering and content are valid; the ID-presence claim is therefore corrected here rather than silently rewritten. New records use explicit `event_id` values.

## Original hashes

- Registry: `46CB70C01602DA4BB39AF915FB0E0C2016CE47A87F45F24EC22FAB62F8D41417`
- Showcase matrix: `1CB9AEFA5153DC708D6E5567BF8350B23C7C4E2F11C1A0069CC3FBC13FF93D28`
- Four-record journal snapshot: `F0F94A8F4F6932392DE260FAD7CF6C5BEE13E58BEF7CAE1EAADB35E8A9A29281`

The original child receipt remains preserved as historical evidence. This receipt supersedes only its event-ID assertion.
