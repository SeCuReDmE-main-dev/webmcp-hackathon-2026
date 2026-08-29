# Public artifact scan

Date: 2026-08-29
Scope: modified and newly created public repository artifacts

## Results

- Markdown files checked for relative links: `73`.
- Relative links resolved: `26`.
- Broken relative links: `0`.
- Strong credential/private-path families checked: API tokens, private keys, cPanel secrets, Zenodo tokens and private Windows paths.
- Credential/private-path hit groups after sanitization: `0`.
- Untracked files larger than 10 MB after `.gitignore` rules: `0`.
- `git diff --check`: passing.
- JSON files in the working change set: `9` valid, `0` invalid.
- Public URL receipt: `55` checked, `0` unresolved.

The local Stitch source archive remains preserved under `asset/.stitch/` and is intentionally ignored because it exceeds GitHub's 100 MB object limit. Only reviewed export assets should enter Git history.

## Boundaries

The secret scan uses pattern matching and does not replace repository-host secret scanning. External source URLs can change after this receipt; source claims remain governed by the dated source registry.
