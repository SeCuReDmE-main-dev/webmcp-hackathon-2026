# QCG console redesign screenshot receipt template

Use one receipt per captured state. This template is evidence scaffolding; replace
every placeholder before treating a receipt as proof. Do not include credentials,
private local paths or unredacted page content.

## Receipt metadata

- Receipt ID: `<unique-id>`
- Captured at: `<ISO-8601 timestamp with timezone>`
- Branch: `redesign/qcg-console`
- Commit: `<full git commit>`
- Surface: `<workbench-console | extension-side-panel | qcg-devtools-panel>`
- Theme: `<dark | light>`
- Seasonal token set: `<autumn | winter | spring | summer>`
- Viewport: `<width>x<height>`
- State: `<empty | loading | active | completed | cancelled | error | recovery>`
- Operator: `Jean-Sébastien Beaulieu`

## Before capture

- Artifact label: `<sanitized artifact label>`
- Before file name: `<reviewed filename>`
- Before byte count: `<integer>`
- Before SHA-256: `<64-hex digest>`
- Before source/commit: `<source identifier>`
- Before notes: `<what is being compared>`

## After capture

- After file name: `<reviewed filename>`
- After byte count: `<integer>`
- After SHA-256: `<64-hex digest>`
- After source/commit: `<source identifier>`
- After notes: `<observed visual and interaction change>`

## Contract checks

- [ ] Five product tabs and their semantic order are preserved.
- [ ] Four quantum tools and four collaboration tools remain the public surface.
- [ ] Human authority and the locked `external — human controlled` stage remain visible.
- [ ] No `Execute` command, provider selector, QPU claim or synthetic metric appears.
- [ ] Keyboard navigation, landmarks, focus, contrast and reduced motion were checked.
- [ ] No secret, credential, private path or unbounded page content appears in the image or notes.
- [ ] The screenshot represents the selected state rather than an inferred state.

## Result

- Verdict: `<pass | needs-review | fail>`
- Reviewer: `<name>`
- Review notes: `<bounded evidence and follow-up>`
