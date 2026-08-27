# Sources and evidence registry

Access date for live sources: 2026-08-20.

| ID | Source | Type | Use | Integrity/status |
|---|---|---|---|---|
| S01 | `../webmcp_case_study` at `fca7462d703c628f4cf110ddadd51e8e5b52a579` | canonical source checkout | WebIDL, algorithms, security, docs, workflows | clean; matches origin and upstream |
| S02 | `01_sources/repository/tracked_file_inventory.json` | generated inventory | 14 tracked files, SHA-256, sizes, lines | reproducible via `tools/inventory_repository.py` |
| S03 | `01_sources/github/history_manifest.json` | GitHub reconciliation | 166 issues, 79 PRs, 0 missing | `reconciled: true` |
| S04 | `01_sources/github/raw/*.json` | GitHub raw evidence | bodies, comments, events, timelines, reviews, commits | 245 immutable per-object exports |
| S05 | `02_reconnaissance/github_history_analysis/entry_evaluations.jsonl` | derived analysis | per-entry seven-part evaluation | deterministic triage; high-signal threads manually read |
| S06 | [Chrome WebMCP imperative API](https://developer.chrome.com/docs/ai/webmcp/imperative-api) | official Chrome docs | current `document.modelContext`, annotations, signals, discovery, origin exposure | updated 2026-08-18 |
| S07 | [Prompt API specification](https://webmachinelearning.github.io/prompt-api/) | W3C CG draft | conceptual usage/window comparison only | draft dated 2026-08-11 |
| S08 | [Antigravity UI automation codelab](https://codelabs.developers.google.com/agentic-ui-automation-with-antigravity) | official Google codelab | confirms built-in Browser Agent uses CDP; does not mention WebMCP | CDP capability kept separate |
| S09 | [WebMCP issue #29](https://github.com/webmachinelearning/webmcp/issues/29) | canonical discussion | memory/resource/read-only-tool question and evidence request | open, unassigned at export |
| S10 | [WebMCP issue #231](https://github.com/webmachinelearning/webmcp/issues/231) | canonical discussion | product/harness boundary and invited documentation clarification | open, unassigned at export |
| S11 | [WebMCP issue #232](https://github.com/webmachinelearning/webmcp/issues/232) | canonical proposal | sessions/compaction comparison | open, no comments at export |
| S12 | user-provided EPP group extract | private supplied evidence | proves group access and visible WebMCP announcements | SHA-256 `5B295D5887D4B8B90D8194117837576C8A5CA92DA04C451F11D3272084C526BB`; not published |
| S13 | `STUDY_CASE_FOUNDATION_PROCESS.md` | local governance | organisation and lifecycle | SHA-256 `C966E8A7995B34D340C7D4D425559AED3107A5581E1E7318757BF0502A6A30E8` |
| S14 | prior French professional article | local editorial precedent | voice structure only; no copied prose | SHA-256 `6BB1BEC94A56CF7549A424E745410E01C486FC62DFF3D520A4D6160B23CC0CBC` |
| S15 | Commonly/III/Dakera/Swarm live checkouts | local code evidence | CCP invariant comparison | exact branches/revisions recorded in `02_CCP_FIT_ANALYSIS.md` |
| S16 | `06_experiments/ccp_webmcp_lab/results` | experimental evidence | tests, byte baselines, browser probes | generated locally; status-specific |
| S17 | `output/research/2026-08-20-webmcp-ccp-60-source-brief.md` | primary-source research corpus | 30 theory sources and 30 coding/test sources mapped to chapters and sessions | 60 distinct URLs; no secondary sources |
| S18 | [WebMCP Origin Trial registration](https://developer.chrome.com/origintrials/#/view_trial/4163014905550602241) | official Chrome trial registry | confirms trial identity, milestone range, and localhost enrollment | registered for `http://localhost:8787`; token excluded from artifacts |
| S19 | `output/research/2026-08-20-webmcp-ccp-9x69-research-architecture.md` | research architecture | nine master questions plus sixty source-bound research angles | exact coverage M01–M09, R01–R60, T01–T30 and C01–C30 |
| S20 | `article ecrit/.../2026-08-20-webmcp-ccp-context-continuity/recherche/` | editorial research pack | canonical matrix, ChatGPT prompt, Gemini prompt and result-capture template | `READY_FOR_DEEP_RESEARCH`; secrets and future results excluded |

## Evidence labels

- `source_fact`: directly present in a primary source or raw export.
- `observation`: produced by a controlled local test.
- `inference`: interpretation connecting sources or observations.
- `proposal`: an unaccepted design choice.

The issue and articles must not collapse these labels. In particular, EPP membership is not proof that a local origin is enrolled in the WebMCP Origin Trial, CDP control is not WebMCP discovery, and a draft is not an opened issue.
