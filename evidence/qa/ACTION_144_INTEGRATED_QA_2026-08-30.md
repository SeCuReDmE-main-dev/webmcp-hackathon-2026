# Action 144 — integrated QA receipt

Date: 2026-08-30
Scope: current Day 5 working tree; validation only. No deployment, submission,
commit, tag, product-behaviour change, or browser reopening was performed.

## Ground

- Repository: `<REPO_ROOT>`
- Baseline `HEAD`: `237d208b26fdee93de6642d6018ce9b7778a90a6` on `main`
- The worktree intentionally contained integrated, uncommitted Day 5 changes.
- Prior F12/MCP proof remains preserved in
  `evidence/qa/ACTION_127_F12_MCP_COLLABORATION_2026-08-30.md`; it was not
  reopened for this bounded QA action.

## Source-worktree validation

Commands, run from `prototype/webmcp-qcg`:

```powershell
npm test
npm run build
```

`npm run build` passed:

```text
tsc --noEmit && vite build
129 modules transformed
dist/assets/index-SmY9IX0e.js     358.61 kB
dist/assets/index-D-RGuMk1.css     13.11 kB
```

The source-worktree `npm test` process did not produce a Vitest summary within
the 30-second command observation window and was terminated as a QA-owned
process. This is a worktree/runtime observation, not a test failure claim.
The same test command in the clean copied tree below completed successfully.

Targeted source-worktree tests also completed before that observation:

| Command scope | Result |
| --- | --- |
| `src/a2aDay5.test.ts` | 3/3 passed |
| `src/debugContracts.test.ts` | 8/8 passed |
| `src/devtoolsTools.test.ts` | 2/2 passed |
| `src/devtoolsBridge.test.ts` | 3/3 passed |
| `src/season.test.ts` | 3/3 passed |
| `src/services.test.ts` | 18/18 passed |

## Clean copied-tree validation

To validate uncommitted Day 5 state without changing `main`, I created a new,
explicit file copy at:

```text
<TEMP_ROOT>/qcg-action144/worktree-copy-verified
```

The copy was constructed from:

```powershell
git -C <REPO_ROOT> ls-files -co --exclude-standard
```

It copied 548 tracked/candidate files from the current worktree, preserving
uncommitted Day 5 files. Volatile `.tmp`, application `node_modules`, and
generated `dist` were deliberately excluded so the copy would be a clean
install test rather than a copy of a running browser profile or build output.

Commands, run in the copied `prototype/webmcp-qcg` directory:

```powershell
npm ci
npm test
npm run build
```

Results:

| Gate | Result |
| --- | --- |
| clean install | passed; 108 packages added; audit reported 0 vulnerabilities |
| full Vitest suite | passed; 7 files, 41 tests |
| TypeScript + Vite production build | passed; 129 modules transformed |

The successful clean-tree suite is the reproducible test result for the
current integrated Day 5 source snapshot.

## Integrity and exposure checks

Commands:

```powershell
git diff --check
rg -l -e '<credential/private-key patterns>' -g '!.tmp/**' -g '!**/node_modules/**' -g '!**/dist/**' .
rg -l -e '<local-path patterns>' -g '!.tmp/**' -g '!**/node_modules/**' -g '!**/dist/**' .
```

- `git diff --check` exited 0: no whitespace errors. Git emitted only existing
  LF-to-CRLF advisory messages for modified files.
- Credential/private-key pattern scan returned no candidate files.
- Local-path scan found two pre-existing documentation/evidence locations:
  `docs/design/DESIGN.md` and
  `evidence/hosting/qcg-securedme-ca-baseline-2026-08-29.json`. These require
  a release-editor review if strict public portability is required, but were
  not modified in this QA action and no secret value was emitted.

## Blockers and release posture

1. No functional test blocker was reproduced in the clean tree: all 41 tests
   and the production build pass there.
2. The shared source worktree can leave a full `npm test` running past the
   bounded observation window; this should be investigated only if it recurs
   outside concurrent integration activity. It does not invalidate the clean
   clone result.
3. This action intentionally did not reopen F12, deploy, submit, tag, or
   change any release/editorial/graphics material.
