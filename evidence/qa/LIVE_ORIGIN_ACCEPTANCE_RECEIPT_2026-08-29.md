# QCG v2 live-origin acceptance receipt

Date: 2026-08-29
Origin: <https://qcg.securedme.ca/>
Release archive SHA-256: `6d574985fbff4fe376395beae37f292889a5d187a9b81601eeb445d7e58c4d44`

## Deployment evidence

- The cPanel Operator completed its explicit `plan -> confirmation -> apply` flow.
- The isolated document root is `<CPANEL_HOME>/public_html/qcg.securedme.ca`.
- The operator verified all eight expected release paths after promotion.
- The stable origin returns HTTP `200` and no longer redirects to the main SecuredMe site.
- The public HTML differs from `securedme.ca` and matches the release manifest byte for byte.
- The Q# sample, worker bundle, JavaScript, CSS and pinned WASM asset match their local SHA-256 values.
- The WASM response uses `application/wasm`.
- `Origin-Agent-Cluster: ?1`, `Permissions-Policy: tools=(self)` and the bounded Content Security Policy are present on the live origin.

## Automated proof

- Vitest: `18/18` passing, including exact-versus-near reuse, false-ready regressions and explicit pre-use consent revocation.
- TypeScript and Vite production build: passing; `122` modules transformed.
- Official `webmcp-evals` smoke run against the live HTTPS origin: `2/2` steps passing.
- `inspect_quantum_experiment` returned the byte-derived Q# manifest.
- `evaluate_quantum_call` returned `simulate_first` with `BOUNDED_LOCAL_EVIDENCE_REQUIRED`.

## Native progressive-tool proof

The first live run exposed a startup race: the inspection tool could be discovered before the first WASM analysis finished. QCG now withholds artifact tools until an artifact manifest exists. The updated behavior passed the local and live official smoke runs.

After visible human acceptance:

- `run_bounded_qsharp_simulation` became discoverable;
- one native invocation returned `64` shots with the Bell invariant passing;
- `qpu_submissions` remained `0`;
- the one-time consent was consumed;
- the simulation tool disappeared;
- `export_quantum_evidence_report` remained available;
- Markdown export succeeded without raw Q#, private paths or secrets;
- the browser reported no console or page errors during the accepted path.

The release also models `ready`, `consent_required`, `authorized`, `expired`, `revoked` and `consumed` as separate authority states. A human can revoke an unused consent before simulation; the regression test confirms that this removes execution authority and produces zero simulator calls.

## Human fallback proof

A clean live page imported the checked-in `qcg-bell-sample.qs` through the file input. QCG produced artifact `artifact-602ec14b539c7ac01513b043`, compiled it with zero diagnostics, displayed the deterministic `simulate_first` recommendation, recorded an accepted human decision, ran the bounded local simulation and displayed receipt `receipt-recommendation602ec14b53`.

## Claim boundary

This receipt proves browser-local Q# preflight, one bounded simulation and evidence export on the retained origin. It proves no provider compatibility, QPU access, paid-job savings, quantum advantage or external execution authorization.
