# QCG console redesign decision ledger

Append-only public record for the redesign branch. Add a new dated entry; do not
rewrite or delete an accepted entry. This ledger records design and boundary
decisions, not unverified runtime outcomes.

## Entry 0001 — authorize a presentation redesign under a frozen engine

- Timestamp: 2026-08-30T16:20:30-04:00 (America/Toronto)
- Owner: Jean-Sébastien Beaulieu
- Branch: `redesign/qcg-console`
- Baseline HEAD: `50e7de43bfbf2d2d11397ffa9339273f0c486329`
- Evidence: 41/41 tests passed and the TypeScript/Vite build succeeded at the recorded baseline; see the Day 5 closeout and the redesign ADR.
- Selected: redesign layout, tokens and presentation across the existing workbench, extension side panel and QCG DevTools panel.
- Rejected: new tools, profiles, execution backends, provider integrations, authority actions or product-state changes.
- Impact: implementation may improve legibility while preserving one engine contract and one authority model.
- Proof/status: **Accepted; documentation contract recorded. Source implementation and deployment remain separately gated.**

## Entry 0002 — accessibility is a direct-use surface, not an agent substitute

- Timestamp: 2026-08-30T17:13:37-04:00 (America/Toronto)
- Owner: Jean-Sébastien Beaulieu
- Evidence: the existing SecuredMe access-console direction; Michał Kulikowski's article, `A more accessible web might be the Agentic Web's most overlooked gain`; the local QCG console source.
- Selected: add a browser-local QCG access panel for text size, stronger contrast, reduced motion, underlined controls and reset; add skip navigation and preserve semantic labels, keyboard access, human-readable history and receipts.
- Rejected: treating WebMCP as a replacement for an accessible UI, claiming automated conformance, using decorative toggles without functional state, or asking the same agent to be the sole verifier of its own action.
- Architectural impact: direct human use and delegated agent use remain complementary paths over the same bounded application state. Preferences remain local and outside evidence receipts.
- Editorial impact: the article can explain that better roles, names, states and receipts primarily improve human access, while browser agents benefit from the same reliable structure.
- Proof/status: **Implemented locally; runtime, responsive, keyboard and accessibility validation remain open.**

## Entry 0003 — make every visible control change a real surface

- Timestamp: 2026-08-30T17:23:58-04:00 (America/Toronto)
- Owner: Jean-Sébastien Beaulieu
- Evidence: local runtime inspection of all seven navigation views; contextual links in the right inspector; desktop and mobile captures under `evidence/browser/qcg-console-redesign/`.
- Selected: every left-rail item changes the centre workbench; desktop keeps the right inspector persistent; tablet and mobile use an explicit drawer; contextual inspector actions navigate to the matching centre view and close the drawer on small screens.
- Rejected: decorative tabs, ephemeral desktop context, clickable effect counters without an action, or a right panel whose labels do not affect the workbench.
- Architectural impact: navigation is now one explicit state shared by the console shell and its contextual inspector. Responsive presentation changes placement, not meaning.
- Editorial impact: the article can describe the redesign as a move from visual promise to operational clarity: each label now exposes a real function or is presented as read-only evidence.
- Proof/status: **Implemented and locally validated across seven views at 1440 px and 412 px.**

## Entry 0004 — use colour as a semantic accent and preserve non-colour meaning

- Timestamp: 2026-08-30T17:23:58-04:00 (America/Toronto)
- Owner: Jean-Sébastien Beaulieu
- Evidence: author direction requesting more cyan in Dark and more green in Light; final local captures and contrast-focused runtime checks.
- Selected: cyan marks active technical state in Dark; emerald marks active state and primary action in Light; gold identifies human authority; text, headings, borders and labels preserve meaning independently of colour.
- Rejected: colour-only status, spectacular gradients, decorative seasonal scenes inside the product, and one palette forced across both themes.
- Architectural impact: semantic tokens vary by theme while DOM, tools, decisions and accessible names remain identical.
- Editorial impact: the interface gains life without turning proof into decoration. Colour supports the hierarchy while receipts, labels and human authority carry the claim.
- Proof/status: **Implemented locally; final captures have SHA-256 receipts in `QCG_CONSOLE_RUNTIME_QA_2026-08-30.md`.**

## Entry 0005 — close the accessibility validation loop without claiming certification

- Timestamp: 2026-08-30T17:26:30-04:00 (America/Toronto)
- Owner: Jean-Sébastien Beaulieu
- Evidence: 51/51 automated tests, successful TypeScript/Vite build, local keyboard and responsive runtime checks, and the access-panel capture.
- Selected: retain browser-local preferences, explicit reset, Escape dismissal, skip navigation, semantic form controls and a disclaimer that the panel supports direct use without certifying conformance.
- Rejected: presenting an overlay as WCAG certification or moving accessibility settings into evidence receipts.
- Architectural impact: preferences modify presentation only and stay outside the quantum decision, consent and evidence contracts.
- Editorial impact: the article can distinguish a useful accessibility mechanism from an accessibility claim, and connect clearer human interaction to clearer agent navigation.
- Proof/status: **Locally validated; independent manual assistive-technology review remains a release gate rather than a completed claim.**

## Entry 0006 — accept the current console and advance to Vercel synchronization

- Timestamp: 2026-08-30T17:30:00-04:00 (America/Toronto)
- Owner: Jean-Sébastien Beaulieu
- Evidence: author review of the current Dark, Light and Access states; 51/51 tests; successful production build; runtime QA receipt.
- Selected: accept the current console as the Day 5 visual baseline, defer the next graphics and user-experience refinement to tomorrow, and synchronize this validated artifact to a Vercel preview while keeping `qcg.securedme.ca` as the canonical stable address.
- Rejected: reopening product features tonight, replacing cPanel before deployment parity is verified, or presenting a temporary Vercel hostname as the canonical product URL.
- Architectural impact: the same production artifact advances to hosting validation. Vercel is a preview/proof surface; cPanel remains the stable public surface until a separate parity and promotion receipt succeeds.
- Editorial impact: this marks the transition from design iteration to deployment coherence. The article can distinguish acceptance of a working baseline from tomorrow's graphic refinement.
- Proof/status: **Author accepted the current state; Vercel synchronization is now authorized and cPanel remains unchanged.**

## Entry 0007 — synchronize one accepted artifact to the stable Vercel address

- Timestamp: 2026-08-30T17:41:11-04:00 (America/Toronto)
- Owner: Jean-Sébastien Beaulieu
- Evidence: GitHub deployment `6171585797`; Vercel production deployment URL `https://webmcp-5znk6npof-ffed.vercel.app`; stable project domain `https://webmcp-qcg.vercel.app/`; exact remote/local SHA-256 comparisons in `QCG_VERCEL_SYNC_RECEIPT_2026-08-30.md`.
- Selected: fast-forward the accepted commit to `main`, allow the linked Vercel project to deploy it, keep `webmcp-qcg.vercel.app` as the stable Vercel validation address, and preserve `qcg.securedme.ca` as the canonical product address.
- Rejected: using an expiring anonymous preview, publishing a branch-specific hostname as canonical, disabling preview protection without need, or mutating cPanel during this step.
- Architectural impact: production Vercel and the accepted local build now share exact HTML, JavaScript and CSS bytes. Hosting roles remain explicit: Vercel validates the candidate; cPanel remains the canonical retained release until its own promotion gate.
- Editorial impact: the article gains a concrete deployment-coherence receipt rather than a visual similarity claim.
- Proof/status: **Vercel production synchronized and public; HTTP 200, expected title, required WebMCP headers and exact asset hashes verified. cPanel unchanged.**

## Entry 0008 — promote the accepted console to the canonical cPanel origin

- Timestamp: 2026-08-30T17:48:53-04:00 (America/Toronto)
- Owner: Jean-Sébastien Beaulieu
- Evidence: `QCG_CPANEL_LIVE_DEPLOYMENT_RECEIPT_2026-08-30.md`; cPanel plan `9b9525b7738d052dd825c12f`; immutable package SHA-256 `371A206716FCFCD71699285CCE51A8BB8AA7368B2615505397328DCC86E02269`; canonical browser smoke at `https://qcg.securedme.ca/`.
- Selected: promote the exact author-accepted artifact through the SecuredMe cPanel Operator, retain an identified rollback backup, verify every expected remote path, compare all content-bearing public files by SHA-256, and exercise the Q# Bell preflight without recording a human decision.
- Rejected: manual live-root upload, deleting the previous release, treating visual similarity as parity, impersonating the author's decision, or claiming a fresh native-agent invocation from a human-interface smoke.
- Architectural impact: cPanel now serves the accepted QCG Console as the canonical product origin; Vercel remains the validation surface. The release retains a rollback boundary and the same frozen engine, authority model and tool counts.
- Editorial impact: this closes the design and implementation deployment phase with verifiable receipts while leaving the Day 5 article open for Jean-Sébastien's writing, graphics and publication decisions.
- Proof/status: **Canonical deployment PASS; 14/14 expected paths verified, 12/12 public content hashes exact, required headers present, Bell inspection/evaluation passed, human decision pending, local simulations 0 and QPU submissions 0.**

## Entry format for future additions

Use a new numbered entry with timestamp and timezone, owner, evidence, selected and
rejected options, architectural impact, editorial impact and proof/status. Preserve
the original wording of earlier entries.
