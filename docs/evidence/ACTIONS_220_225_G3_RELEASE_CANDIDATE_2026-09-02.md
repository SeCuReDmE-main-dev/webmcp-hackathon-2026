# Actions 220–225 — G3 release-candidate receipt

Status: `G3_PASS`

Date: 2026-09-02 (America/Toronto)

Candidate base: `499177947da16b2a942ce909b91233a2795c5667` plus the
documented G1, G2 and G3 working-tree overlay

Validation copy:
`C:\Users\jeans\AppData\Local\Temp\webmcp-qcg-final-validation-20260902-045822`

## Ground

- Actions 175–219 are closed by their dated receipts.
- The release candidate remains QCG-only: eight WebMCP tools, Web/F12/Companion
  surfaces, bounded local Bell fixtures, human authority, and no QPU or provider
  execution.
- Companion packages must be installable artifacts whose runtime bytes match
  the validated extension sources in a fresh Windows checkout.

## Execute

1. Rebuilt production and development Companion 0.2.4 packages from the
   current source, including the five identity assets and the novice install
   guide.
2. Synchronized each package across both public locations used by the project.
3. Added deterministic LF checkout rules for Companion text files while
   retaining icons as binary files.
4. Extended package-parity QA to validate both public package locations.
5. Created a detached validation worktree from the base commit, overlaid every
   current candidate path, and verified SHA-256 equality for the overlay.
6. Ran dependency install, application tests, production build and all five
   Companion gates in that validation copy.

## Validate

### Action 220 — packages

- Production: `qcg-console-companion-0.2.4.zip`, 104,895 bytes.
- Development: `qcg-console-companion-dev-0.2.4.zip`, 104,912 bytes.
- Each archive contains only the 16 declared runtime files.
- Root and `public/downloads/` copies are byte-identical.

### Action 221 — package hashes

- Production SHA-256:
  `D69B3DEE68C6DF5A28D526B5A8616CC0148CA58EA7B40F5159F2D193D4216916`
- Development SHA-256:
  `33EACB2CBD3475E86E86EFD899F2540E5FD5DD7B0F0F99E6E3726BC246BBD35B`
- Canonical manifest:
  `evidence/releases/QCG_COMPANION_0.2.4_SHA256.txt`.

### Action 222 — application suite

- Vitest: 13 files passed, 88 tests passed.
- No failed, skipped or quarantined test was used to obtain this result.

### Action 223 — five Companion gates

1. MV3 manifests, restricted hosts, command allowlist and bridge fallback:
   `PASS`.
2. Trusted-click open/close handshake: `PASS`.
3. Snapshot lifecycle, same-tab binding and stale-state cleanup: `PASS`.
4. Low-glare Light luminance and contrast gates: `PASS`.
5. Production/development package parity in both public locations: `PASS`.

### Action 224 — fresh-copy and budgets

- Node: `v24.18.1`; npm: `11.16.0`; Git: `2.51.0.windows.1`.
- `npm ci`: 108 packages installed, 109 audited, zero vulnerabilities.
- Production build: 131 modules transformed.
- Application JavaScript: 388.34 kB, below the 400 kB limit.
- Application CSS: 18.84 kB, below the 60 kB limit.
- QDK WebAssembly: 6,066.57 kB, tracked separately as required.
- Final build hashes:
  - `index.html`:
    `01D8DF74F16809A57C0E1E773D35EE6F8F124E5B49728BBF43BDCD6861E95EF0`
  - `assets/index-DKPA35Cf.js`:
    `4BDBAAEE3C2EF8F8E9118D71D11D375ABC0DF623D4F0D51B9313AC156D3146F7`
  - `assets/index-76lOak0k.css`:
    `8EC7C940518E4BB5AA68DB15E3DE89103D400BF48FBB85052EC179EDB9A23198`

### Security and repository hygiene

- `git diff --check`: `PASS`.
- Tracked environment/private-key filename scan: zero matches.
- Secret-signature scan found one deliberate adversarial test fixture in
  `snapshotLifecycle.test.mjs`; it is a synthetic `sk-...` value paired with
  fake local paths and exists specifically to prove sanitization. No usable
  credential was found.
- The pending reserved Zenodo DOI remains explicitly labeled pending; its
  public resolution is an Action 235–236 gate, not a G3 claim.

## Anomaly and correction

The first clean-copy Companion run failed package parity even though the main
working tree had passed. Root cause: nondeterministic Windows line endings and
a documentation change made after package generation. The candidate was not
released. Text checkout rules were made explicit, both packages were rebuilt,
both public locations were synchronized, and the clean-copy gate then passed.
This is the expected G3 feedback-loop behavior.

## Output

- Immutable candidate inputs are ready for the final commit.
- Build output is ready for deployment packaging.
- Companion packages and hashes are ready for publication.
- GitHub, Vercel, cPanel, tag and Zenodo actions remain downstream and are not
  claimed by this receipt.

## Receipt

`G3_PASS` — Actions 220–225 are complete. The candidate may proceed to the
publication-technical DAG at Action 226.

No Devpost submission, video publication, software DOI publication, provider
execution, QPU execution or spending decision occurred in this checkpoint.
