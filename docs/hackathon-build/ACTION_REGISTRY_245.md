# WebMCP-QCG final action registry — Actions 175–245

This registry preserves Actions 1–148 and the historical redesign work. It records the final 71-action release plan without rewriting earlier receipts. Every action uses `Ground → Execute → Validate → Output → Receipt` and becomes `DONE` only when its evidence gate passes.

| ID | Owner | Status | Action | Acceptance evidence |
|---:|---|---|---|---|
| 175 | Luna | DONE | Capture branch, HEAD, remotes, tags, versions and worktree state | `docs/evidence/ACTIONS_175_182_G0_BASELINE_2026-09-02.md` |
| 176 | Luna | DONE | Classify every current path without deleting user work | G0 baseline path classification |
| 177 | Sol | DONE | Freeze standalone QCG scope and human authority | `docs/decisions/2026-09-02-final-qcg-release-scope-and-authority.md` |
| 178 | Sol | DONE | Classify Gemini findings | `docs/evidence/GEMINI_FINDING_DISPOSITION_2026-09-02.md` |
| 179 | Luna | DONE | Register Actions 175–245 | This file contains exactly 71 action rows |
| 180 | Luna | DONE | Build initial claim/source manifest | G0 baseline evidence manifest |
| 181 | Sol | DONE | Record DAG, owners, timeouts and release conditions | G0 baseline execution contract |
| 182 | Sol | DONE | Close checkpoint G0 | G0 baseline records `G0_PASS` |
| 183 | Terra | DONE | Test concurrent simulation against one consent | `docs/evidence/ACTIONS_183_199_G1_SURGERY_2026-09-02.md` |
| 184 | Sol | DONE | Formalize differential WebMCP registration | G1 receipt and per-tool registry contract |
| 185 | Terra | DONE | Implement per-tool registration controllers | G1 receipt and lifecycle proof |
| 186 | Terra | DONE | Test stable inspect/evaluate registrations | G1 receipt; 87-test clean suite |
| 187 | Terra | DONE | Test conditional simulation/export lifecycle | G1 receipt; 87-test clean suite |
| 188 | Terra | DONE | Add accessible operation announcements | G1 receipt and DOM proof |
| 189 | Terra | DONE | Test success/error announcements | G1 receipt and accessibility tests |
| 190 | Terra | DONE | Narrow body/stack/trace sanitization | G1 receipt and sanitizer diff |
| 191 | Terra | DONE | Test all sanitization layers | G1 receipt and three-layer tests |
| 192 | Terra | DONE | Complete Markdown decision evidence | G1 receipt and export diff |
| 193 | Terra | DONE | Test Markdown decisions | G1 receipt and decision export tests |
| 194 | Terra | DONE | Handle blocked IndexedDB upgrades | G1 receipt and storage diff |
| 195 | Terra | DONE | Test IndexedDB block and recovery | G1 receipt and storage tests |
| 196 | Terra | DONE | Add sanitized Worker error codes | G1 receipt and Worker contract |
| 197 | Terra | DONE | Test Worker error categories | G1 receipt and Worker tests |
| 198 | Terra | DONE | Replace demo prefix inference with explicit provenance | G1 receipt and catalog/service diff |
| 199 | Sol | DONE | Close adversarial checkpoint G1 | `docs/evidence/ACTIONS_183_199_G1_SURGERY_2026-09-02.md` |
| 200 | Luna | DONE | Capture pre-fix three-surface visual state | `evidence/runtime/visual-qa-2026-09-02/BEFORE_MATRIX.md` |
| 201 | Terra | DONE | Open Companion from trusted page click | `docs/evidence/ACTIONS_200_213_G2_REAL_BROWSER_2026-09-02.md` |
| 202 | Terra | DONE | Make `Open Companion` a real open/close toggle with confirmed page state | G2 real-browser receipt |
| 203 | Terra | DONE | Validate extension-action fallback and reconnection | G2 extension and lifecycle receipt |
| 204 | Terra | DONE | Validate low-glare Light contrast | G2 receipt and Companion contrast gate |
| 205 | Terra | DONE | Expose functional Access controls in Companion | G2 Access interaction proof |
| 206 | Terra | DONE | Harmonize button hover/focus boundaries | G2 visual/accessibility matrix |
| 207 | Terra | DONE | Keep site navigation operable beside Companion | G2 public-browser navigation proof |
| 208 | Terra | DONE | Bind Web/F12/side panel to one tab/session | G2 transport receipt |
| 209 | Terra | DONE | Recover after reload/navigation/worker suspension | G2 lifecycle receipt |
| 210 | Sol + Jean-Sébastien | DONE | Demonstrate Codex–Gemini–human relay | G2 sanitized relay receipt |
| 211 | Terra | DONE | Prove agents cannot exercise human authority | G2 negative-test receipt |
| 212 | Luna | DONE | Run responsive/accessibility browser matrix | `evidence/runtime/visual-qa-2026-09-02/AFTER_MATRIX.md` |
| 213 | Sol | DONE | Close real-browser checkpoint G2 | `docs/evidence/ACTIONS_200_213_G2_REAL_BROWSER_2026-09-02.md` |
| 214 | Sol + Luna | DONE | Finalize four-season README narrative | `docs/evidence/ACTIONS_214_219_DOCUMENTATION_2026-09-02.md` |
| 215 | Sol | DONE | Explain with/without WebMCP | Documentation receipt and README review |
| 216 | Luna | DONE | Finalize illustrated Companion installation | Documentation receipt and local image-path QA |
| 217 | Sol | DONE | Refresh security, limits and recovery docs | Documentation receipt and claim audit |
| 218 | Luna | DONE | Record Gemini judge and Day 7 decisions | Documentation receipt; public-safe trace and bounded dispositions |
| 219 | Sol | DONE | Refresh Devpost draft without submission | Documentation receipt; `NOT_SUBMITTED`, parity unproven |
| 220 | Terra | DONE | Rebuild production/development Companion ZIPs | `docs/evidence/ACTIONS_220_225_G3_RELEASE_CANDIDATE_2026-09-02.md` |
| 221 | Luna | DONE | Hash and compare Companion ZIPs | G3 receipt and `evidence/releases/QCG_COMPANION_0.2.4_SHA256.txt` |
| 222 | Terra | DONE | Run full application suite | G3 receipt; 13 files and 88 tests pass |
| 223 | Terra | DONE | Run five Companion gates | G3 receipt; all five gates pass in both worktrees |
| 224 | Terra | DONE | Run fresh-copy install/test/build and budgets | G3 receipt; clean install, zero vulnerabilities and bundle budgets pass |
| 225 | Sol | DONE | Close release-candidate checkpoint G3 | G3 receipt records `G3_PASS` |
| 226 | Luna | DONE | Build deployment manifest and rollback procedure | `docs/evidence/ACTION_226_DEPLOYMENT_MANIFEST_AND_ROLLBACK_2026-09-02.md` |
| 227 | Sol | DONE | Create final candidate commit | `docs/evidence/ACTIONS_227_232_PUBLICATION_PARITY_2026-09-02.md` |
| 228 | Sol | DONE | Push main and verify remote SHA | Publication/parity receipt; repaired runtime `938da49` exactly matched `origin/main` at promotion |
| 229 | Sol | DONE | Verify public visibility and branch protection | Publication/parity receipt; public repository and minimal branch safeguards |
| 230 | Sol | DONE | Deploy identical Vercel candidate | Publication/parity receipt; exact bytes, SPA routing, seven headers and host-config non-disclosure |
| 231 | Sol | DONE | Deploy identical cPanel candidate | Publication/parity receipt; R2 plan/apply, `24/24 PASS` and `8/8` Chrome image decode |
| 232 | Luna | DONE | Compare GitHub, packages and deployments | Publication/parity receipt; candidate and public-byte parity chain |
| 233 | Sol | DONE | Create and push `v0.1.0-hackathon` | `docs/evidence/ACTIONS_233_236_TAG_ARCHIVE_ZENODO_2026-09-02.md` |
| 234 | Luna | DONE | Generate Zenodo source archive and SHA-256 | Tag/archive receipt; SHA `7B7198…3D00` |
| 235 | Sol | FAILED | Publish reserved software DOI | Zenodo transport incident; reserved draft remains empty and unpublished |
| 236 | Luna | RUNNING | Synchronize citation and resolve DOI badge | Citation is synchronized; badge remains explicitly pending until Action 235 succeeds |
| 237 | Luna | RUNNING | Capture final product path | Current official inspect/evaluate smoke `2/2`; human consent, simulation, export and final screenshot set pending |
| 238 | Sol + Jean-Sébastien | PENDING | Rehearse sub-three-minute storyboard | Timed rehearsal receipt |
| 239 | Jean-Sébastien + Sol | BLOCKED_BY_AUTHOR | Record, edit and publish human-voice video | Public video URL |
| 240 | Sol | PENDING | Complete Devpost fields without submission | Rendered draft review |
| 241 | Sol + Jean-Sébastien | PENDING | Finalize Summer article and traces | Author-approved package |
| 242 | Terra | PENDING | Prove separate FNP-QNN Companion adapter | FNP receipt |
| 243 | Terra | PENDING | Prove separate Gateway snapshot producer | Gateway receipt |
| 244 | Sol + Luna | PENDING | Audit first 70 actions | `70/71 DONE` report |
| 245 | Jean-Sébastien | BLOCKED_BY_AUTHOR | Decide submission and freeze public surfaces | Devpost submission receipt or explicit no-submit record |

## Status rule

`BLOCKED_BY_AUTHOR` is not a defect. It marks an irreversible publication or submission decision reserved to Jean-Sébastien. No agent may change these actions to `DONE` without direct action-time approval.
