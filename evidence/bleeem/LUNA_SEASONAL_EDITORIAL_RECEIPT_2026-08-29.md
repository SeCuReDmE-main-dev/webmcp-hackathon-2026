# Luna seasonal editorial receipt — 2026-08-29

## Scope

Actions 101–104, the documentation/asset portion of 115–116, and Action 117 editorial drafting were completed in the shared workspace. This receipt covers the permitted documentation, Stitch triage, provenance record, new Winter article directory and mirrored Winter manuscript draft. No prototype code, companion extension, README, action registry, Autumn source, cover, monograph, Devpost content, Git history or remote was intentionally edited by this lane.

## Exact outputs

| Output | SHA-256 |
| --- | --- |
| `docs/design/DESIGN.md` | `D218E1AA51D2FC2DFAE75694ED54D04E0A246F5196D317E303D361B31045089A` |
| `docs/design/STITCH_PROMPT.md` | `E77D843CBA95C40A75ECEC4344EEADF554C5EA5D3D7F86CFEA5EE67902EEADEE` |
| `docs/design/STITCH_ASSET_TRIAGE.md` | `60A8F1FC02631B6B5B63A41D23E99009F18172107510F3B4E135A61CDCDD7942` |
| `article ecrit/journalisme_professionnel/10_articles/2026-08-29-webmcp-qcg-day-3-4-winter/research/PROVENANCE_MANIFEST.md` | `DE2E8DE7EEA1B58520235296B427FCC2865B35B231FF73BC781BF6DD80E90801` |
| `article ecrit/journalisme_professionnel/10_articles/2026-08-29-webmcp-qcg-day-3-4-winter/manuscript/WINTER_GATE_DAY_3_4_EN_DRAFT.md` | `FD7D2030ECD7B82757B509ECBB13E47D032EC995C94A9F0742D08CC7833F0AD5` |
| `docs/journal/WINTER_GATE_DAY_3_4_EN_DRAFT.md` | `FD7D2030ECD7B82757B509ECBB13E47D032EC995C94A9F0742D08CC7833F0AD5` |

New Winter directories:

```text
2026-08-29-webmcp-qcg-day-3-4-winter/
├── asset/
│   ├── cover/frontcover/anglais/
│   ├── cover/backcover/anglais/
│   ├── infographique/anglais/
│   └── interface/{desktop,mobile}/
├── research/PROVENANCE_MANIFEST.md
├── manuscript/
└── qa/
```

The reconciled introduction reports the current 34/34 engineering checkpoint. The complete Action 117 draft is mirrored locally and in the repository public-draft path. Both copies contain the canonical Codex research-partner disclosure exactly once, use first-person singular narrative and contain zero `cannot` or `does not` constructions. Final publication remains Jean-Sébastien’s author gate.

## Stitch custody and triage QA

- Raw archive preserved locally at `asset/.stitch/stitch_webmcp_quantum_call_gate.zip` and excluded from Git.
- Archive size: 110,473,513 bytes.
- Archive SHA-256: `3C87306793E161F864701A5E0D7561539A17A6D58B035F5BFCDBCF4E5040FF92`.
- Archive inventory: 113 `screen.png` entries, 58 generated HTML entries, 2 JSON entries, 308 total entries.
- Archive inspection validated PNG signatures and dimensions for all 113 screens without extracting or copying them.
- `git check-ignore -v` confirms `asset/.stitch/*.zip` ignores the raw archive.
- The triage manifest contains exactly 113 numbered screen entries: 9 adopt/reference redraws, 91 visual references, 13 rejects. Raw screens and generated HTML were not copied to public/article folders.
- No asset was copied; therefore no copied-asset hash pair or public destination exists. The archive hash above is the provenance anchor.

## Product-truth QA

- Canonical design specifies exactly four themes: Spring, Summer, Autumn and Winter.
- DevTools collaboration is documented as a separate inspection/provenance architecture, not a fifth theme or sixth tab.
- Canonical app contract remains five tabs, four progressive tools, five hypotheses and five decisions.
- The first two WebMCP tools become discoverable only after a valid human-loaded artifact exists; design and Stitch wording now match the executable registration lifecycle.
- Design and Stitch instructions explicitly prohibit fake metrics, generated-HTML publication, an `Execute` control, provider/QPU claims and invented dates.
- Gate rails, evidence cube, provenance labels, desktop/tablet/mobile states, full empty/partial/active/completed/cancelled/error/recovery states and accessibility requirements are documented.
- Existing Autumn source path is recorded as untouched in the Winter provenance manifest; covers and monograph are reserved to Jean-Sébastien.

## Runtime verification

From `prototype/webmcp-qcg`, the current seasonal/DevTools receipt records `npm test -- --run` completed successfully: 6 test files passed, 34 tests passed. `npm run build` passed with 127 modules transformed. This receipt records the engineering result only; it does not expand product claims.

No commit or push was performed by this lane.
