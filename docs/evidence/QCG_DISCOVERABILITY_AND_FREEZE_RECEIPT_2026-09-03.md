# QCG discoverability hardening and freeze receipt — 2026-09-03

Status: `PASS — FREEZE CANDIDATE`

## Ground

- Repository: `SeCuReDmE-main-dev/webmcp-hackathon-2026`.
- Runtime commit: `bdf1d653cf48bb5aa543c139ea64a25b67e6a2aa`.
- Canonical application: <https://qcg.securedme.ca/>.
- Secondary source deployment: <https://webmcp-qcg.vercel.app/>.
- The immutable hackathon tag and DOI remain unchanged.

## Execute

- Corrected native WebMCP registration for implementations whose
  `registerTool()` returns synchronously.
- Made all four QCG tools discoverable at page load while preserving service
  guards and human-only authority.
- Added typed output schemas and the existing 5,000-byte UTF-8 truncation
  alternative to every tool.
- Documented the provenance of `manifest_id`, `recommendation_id` and
  `receipt_id` at the exact handoff where each downstream tool needs it.
- Allowed inspection to omit `artifact_id` when a person has already loaded the
  current artifact in the same browser session.
- Returned the evaluation receipt identifier so the evidence chain can be
  exported without inventing an ID.
- Integrated `@nekuda/webmcp-sdk` 0.5.0 with stable QCG tool keys and the
  existing native output schemas.
- Enabled derived registration/reliability telemetry while explicitly
  disabling authenticated verbatim tracking of tool inputs and results.

## Validate

- Vitest: `106/106 PASS` across 13 files.
- TypeScript and Vite production build: `PASS`, 134 modules.
- `npm audit`: zero vulnerabilities.
- Companion 0.2.5: `5/5 PASS` for validation, trusted open/close, lifecycle,
  low-glare Light theme and package/source parity.
- Clean clone at the exact runtime commit: `npm ci`, 106 tests and production
  build all pass.
- Canonical cPanel deployment matches the AgentLane-enabled local distribution
  on all `27/27` package paths.
- Public canonical JavaScript: `assets/index-rNzhcItW.js`.
- cPanel immutable package:
  `qcg-console-bdf1d65-agentlane-docroot-r2.zip`, SHA-256
  `54D2C8E501B221A555B8D8347AAD5E27BE1D16422021B798BD4AE193B66EDA9A`.
- cPanel plan `bd7cba0fac2308d9b2ae9254` verified all 27 package paths and retained rollback
  backup `/home/xacm7978/public_html/qcg.securedme.ca.backup-bd7cba0fac2308d9b2ae9254`.
- Vercel deploys the same source commit and current QCG behavior, but its
  environment does not contain the AgentLane publishing key. It therefore
  intentionally lacks AgentLane telemetry and is not byte-identical to the
  canonical cPanel build.

## External discoverability

- The nekuda Chrome Workbench observes `WebMCP · 4` on the public page.
- webmcp.com detects four tools on one page and grades the implementation
  `B+ / Good`, improved from `B-`.
- Its report confirms precise constrained input/output schemas, clear chained
  ID handoff and explicit consent/no-hardware guarantees.
- Its sole remaining observation is QCG's deliberately narrow scope and single
  bounded Bell simulation fixture. This is an accepted product boundary, not a
  defect to disguise with artificial pages or unbounded execution.
- The public canonical page registers all four tools successfully in the
  AgentLane workbench.
- Directory publication remains an external queue state labelled
  `Listing underway`.

## AgentLane validation

- AgentLane detects all four production tools as ready for deployment.
- The integration uses derived telemetry only; authenticated verbatim tracking
  is disabled so raw scientific intent, inputs and results are not sent through
  that channel.
- Journey `96ea72ad-659a-49b9-abe5-a6208596467c` was created to test
  discoverability, identifier handoffs and controlled refusal without human
  consent.
- Runs `0981a16c-6230-4fad-a3f5-9be666557ad1` and
  `7413fc70-9627-4e73-bd17-dd1eae730181` both stopped on an AgentLane
  infrastructure error before browser start: zero steps and zero tool calls.
  The platform explicitly reported that the site required no corrective
  change. Further retries were stopped rather than mutating QCG around an
  external incident.

## Final author decision

Devpost submission `1158343` remains attached to
<https://youtu.be/WV8XMHzt84Y>. The submitted safety video is `00:05:57`, which
exceeds the stated three-minute demo limit. On 2026-09-03 Jean-Sébastien decided
not to produce a replacement and explicitly accepted that compliance risk.
Action 239 is therefore `NOT_PURSUED_BY_AUTHOR`, not falsely marked complete.

## Receipt

`QCG_DISCOVERABILITY_HARDENING_PASS_FREEZE_CANDIDATE`

No further canonical product mutation is required. Freeze after this receipt
and the state documents are committed, pushed and rechecked against
`origin/main`. Adding the publishing key to Vercel remains an optional,
separately authorized parity operation because it transmits a secret to a
second hosting provider.
