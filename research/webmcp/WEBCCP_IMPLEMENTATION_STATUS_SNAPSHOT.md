# Implementation status

| Workstream | State | Evidence |
|---|---|---|
| Upstream synchronization | complete | source checkout at exact `fca7462` |
| Tracked-file reconnaissance | complete | `01_WEBMCP_RECONNAISSANCE.md` and repository inventory |
| Complete GitHub export | complete | 166 issues + 79 PRs reconciled; 245 raw objects and 245 entry evaluations |
| CCP contract and validator | complete for lab v1 | schema, runtime validator, tool adapter, deterministic fixtures |
| Automated laboratory tests | complete through Annex A | 120/120 passing; tokenizer cache, counters, router, scoring, quotas and trial contracts included |
| Chrome page-side activation/execution | complete | Chrome 151, flag Default, valid `Origin-Trial` header; tool registered and page hook invoked |
| Chrome agent discovery/execution | completed with bounded evidence | page activation remains distinct from product discovery; chapter 7 ledger preserved |
| Edge native panel | completed for chapter 7 | reported separately from adapters and unsupported paths |
| ChatGPT/Chrome panel | completed for chapter 7 | reported separately from native provider evidence |
| Antigravity browser agent | Annex A partial | 17/25 attempted, 9 native completions; progressive pilot failed native gate |
| Maintainer issue | complete draft only | readiness decision `PAUSE`; publication is explicitly gated |
| Specification PR | prohibited | wait for favorable maintainer signal |
| French editorial | final local and Drive-native package | nine chapters + Annex A + one conclusion; no public publication |
| Annex A context efficiency | `PARTIAL` | CCP-only mean reduction 25.08% proxy tokens / 26.98% bytes; combined 50% hypothesis not validated |
| Private maintainer contact | draft only | prepared but not sent; asks which existing issue can use the evidence |

No unexposed token consumption will be estimated. A missing product counter is recorded as `non_observable`.

The initial negative Chrome probe remains historical evidence: at that time the server did not deliver an `Origin-Trial` header. It is superseded for page activation by the chapter 6 flag-off result, not deleted.
