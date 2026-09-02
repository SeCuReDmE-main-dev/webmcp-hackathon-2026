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
| 201 | Terra | PENDING | Open Companion from trusted page click | Chrome proof |
| 202 | Terra | PENDING | Make `Open Companion` a real open/close toggle with confirmed page state | Chrome proof |
| 203 | Terra | PENDING | Validate extension-action fallback and reconnection | Extension receipt |
| 204 | Terra | PENDING | Validate low-glare Light contrast | Contrast receipt |
| 205 | Terra | PENDING | Expose functional Access controls in Companion | Browser proof |
| 206 | Terra | PENDING | Harmonize button hover/focus boundaries | Visual/accessibility proof |
| 207 | Terra | PENDING | Keep site navigation operable beside Companion | Browser proof |
| 208 | Terra | PENDING | Bind Web/F12/side panel to one tab/session | Transport receipt |
| 209 | Terra | PENDING | Recover after reload/navigation/worker suspension | Lifecycle receipt |
| 210 | Sol + Jean-Sébastien | PENDING | Demonstrate Codex–Gemini–human relay | Sanitized conversation receipt |
| 211 | Terra | PENDING | Prove agents cannot exercise human authority | Negative-test receipt |
| 212 | Luna | PENDING | Run responsive/accessibility browser matrix | QA matrix |
| 213 | Sol | PENDING | Close real-browser checkpoint G2 | G2 receipt |
| 214 | Sol + Luna | PENDING | Finalize four-season README narrative | README review |
| 215 | Sol | PENDING | Explain with/without WebMCP | README review |
| 216 | Luna | PENDING | Finalize illustrated Companion installation | Install QA receipt |
| 217 | Sol | PENDING | Refresh security, limits and recovery docs | Claim audit |
| 218 | Luna | PENDING | Record Gemini judge and Day 7 decisions | Public/private trace receipts |
| 219 | Sol | PENDING | Refresh Devpost draft without submission | Draft state receipt |
| 220 | Terra | PENDING | Rebuild production/development Companion ZIPs | Package receipt |
| 221 | Luna | PENDING | Hash and compare Companion ZIPs | SHA-256 manifest |
| 222 | Terra | PENDING | Run full application suite | Test receipt |
| 223 | Terra | PENDING | Run five Companion gates | Extension receipt |
| 224 | Terra | PENDING | Run fresh-copy install/test/build and budgets | Clean-copy receipt |
| 225 | Sol | PENDING | Close release-candidate checkpoint G3 | G3 receipt |
| 226 | Luna | PENDING | Build deployment manifest and rollback procedure | Deployment manifest |
| 227 | Sol | PENDING | Create final candidate commit | Commit receipt |
| 228 | Sol | PENDING | Push main and verify remote SHA | Remote receipt |
| 229 | Sol | PENDING | Verify public visibility and branch protection | GitHub receipt |
| 230 | Sol | PENDING | Deploy identical Vercel candidate | Vercel receipt |
| 231 | Sol | PENDING | Deploy identical cPanel candidate | cPanel receipt |
| 232 | Luna | PENDING | Compare GitHub, packages and deployments | Parity receipt |
| 233 | Sol | PENDING | Create and push `v0.1.0-hackathon` | Tag receipt |
| 234 | Luna | PENDING | Generate Zenodo source archive and SHA-256 | Archive manifest |
| 235 | Sol | BLOCKED_BY_AUTHOR | Publish reserved software DOI | Public Zenodo record |
| 236 | Luna | PENDING | Synchronize citation and resolve DOI badge | Citation receipt |
| 237 | Luna | PENDING | Capture final product path | Final screenshot set |
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
