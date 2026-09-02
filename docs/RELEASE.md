# QCG v3 release runbook

This runbook defines what a releasable QCG v3 build means. It does not authorize
a hosting mutation, provider call, QPU submission, Devpost submission, or spend.

The stable product address is
[https://qcg.securedme.ca/](https://qcg.securedme.ca/). The author-approved
2026-09-02 release candidate is served directly over HTTPS. Its immutable cPanel
package SHA-256 is
`C4FE4BB205F58B52ECDC30D73855ADF16E29A62EF578A275103632E3D47C4D50`.

Repaired runtime candidate `938da498312edab8dd41c12f4b9558865993c833`
exactly matches `origin/main`. Canonical cPanel and the synchronized
Vercel secondary each passed the 24-path deployment manifest. This closes
Actions 227–232. The public source tag and hash-validated archive were created
later; Zenodo publication is still blocked at archive transfer. This does not
publish a video, complete the human portion of Action 237 or submit Devpost.

## 1. Release inputs

A release candidate must include:

- the QCG v3 source under `prototype/webmcp-qcg/`;
- the tracked `prototype/webmcp-qcg/package-lock.json`;
- the public sample at
  `prototype/webmcp-qcg/public/fixtures/qcg-bell-sample.qs`;
- the OpenQASM sample at
  `prototype/webmcp-qcg/public/fixtures/qcg-bell-sample.qasm`;
- the root [MIT license](../LICENSE) and
  [third-party notices](../THIRD_PARTY_NOTICES.md);
- the optional Companion source and its production/development manifests under
  `companion/qcg-devtools-extension/` when Companion is part of the release;
- current, sourced target-profile snapshots whose expiry extends through the
  release-validation window.

The root `LICENSE` is tracked and is the repository's machine-detectable project
license. Do not replace it with a README-only license statement.

## 2. Build gate

Run from the repository root with no development server or test watcher holding
`node_modules` open:

```powershell
Set-Location prototype/webmcp-qcg
npm ci
npm test
npm run build
npm run eval:live
Set-Location ../..
git diff --check
```

Recorded results for the 2026-09-02 G3 candidate:

- dependency installation completes from the lock file;
- 88 application tests pass across 13 files;
- TypeScript validation passes;
- Vite creates `prototype/webmcp-qcg/dist/`;
- all 5 Companion gates pass;
- `npm audit` reports zero vulnerabilities;
- `git diff --check` reports no whitespace errors.

The live official `webmcp-evals@0.0.4` inspection/evaluation smoke passes 2/2
on the exact repaired public runtime. Action 237 retains the human-controlled
consent, local simulation and evidence-export portion. Treat all counts as
recorded baselines, not a reason to ignore newly added tests.

## 3. Artifact gate

The deployable static artifact is `prototype/webmcp-qcg/dist/`. Before any
upload, verify that it contains:

- `index.html`;
- the main JavaScript and CSS assets;
- the Q# Worker asset;
- the pinned Q# WebAssembly asset;
- `fixtures/qcg-bell-sample.qs` and `fixtures/qcg-bell-sample.qasm`;
- `_headers`.

The artifact must be immutable for validation: compute and record a hash before
staging, and validate the same bytes that will be promoted. Never include
`.env`, credentials, provider tokens, private evidence, `node_modules`, or local
browser data.

## 4. Hosting and header gate

The static host must return these application headers on the QCG origin:

```text
Origin-Agent-Cluster: ?1
Permissions-Policy: tools=(self)
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

The first two headers are also represented in `prototype/webmcp-qcg/vercel.json`;
the complete static-host set is in `prototype/webmcp-qcg/public/_headers`.
Deployment-specific translation is the host operator's responsibility.

The current cPanel release uses:

- live document root: `public_html/qcg.securedme.ca`;
- an operator-controlled candidate and backup boundary;
- a package manifest that verifies the 24 expected release paths.

Do not upload manually over the live document root. Use the SecuredMe cPanel
Operator's explicit `plan -> confirmation -> apply` transaction with the exact
package hash and expected paths. The operator completed and verified that flow
for this release. A destructive rollback drill remains a separate maintenance
gate; the release procedure itself preserves a backup boundary. See the
[hosting baseline](../evidence/hosting/README.md) and the
[publication and deployment parity receipt](evidence/ACTIONS_227_232_PUBLICATION_PARITY_2026-09-02.md).

The synchronized Vercel secondary also passes 24/24 manifest checks, exact SPA
fallback at `/decisions`, seven policy headers, correct WASM/ZIP MIME types and
host-configuration non-disclosure. cPanel remains the canonical origin.

## 5. Stable-origin acceptance gate

After an authorized deployment, verify the stable origin itself, not a local or
expiring preview:

1. `https://qcg.securedme.ca/` returns the QCG application with no redirect to
   another product.
2. HTTPS is valid for the stable hostname.
3. All four required response headers are present.
4. `/fixtures/qcg-bell-sample.qs` returns the checked-in sample.
5. The human fallback completes import, inspect, evaluate, decision, local Bell
   simulation, receipt export, and activity review.
6. A WebMCP-capable in-app browser discovers the initial two tools and the
   progressive tools at their correct gates.
7. External Chrome is tested after enabling
   `chrome://flags/#enable-webmcp-testing` and restarting Chrome, when that flag
   is available in the installed build.
8. The accepted `simulate_first` path consumes one-use consent and completes the
   bounded local Worker run.
9. JSON and Markdown exports contain no raw Q#, local path, secret, credential,
   or provider diagnostic.
10. QPU submissions remain `0`; no provider, paid, or remote quantum job occurs.

Record browser version, timestamp, stable URL, artifact hash, header values,
tool discovery order, human consent event, simulation result, and zero-QPU
counter in a dated evidence receipt.

## 6. Recovery and rollback gate

Before promotion, exercise local recovery paths: a blocked IndexedDB upgrade,
page reload/navigation, Companion port replacement, side-panel/F12 reopen and
extension-worker suspension must recover to a fresh correlated session or a
cleared waiting state. Recovery must not reuse consent or restore a stale tool.

Before promotion, identify the exact previous live state and a recoverable way
to restore it. If any stable-origin gate fails:

1. stop promotion;
2. restore the previous document-root state or routing target;
3. confirm that the host is no worse than the pre-release baseline;
4. retain the failed artifact and evidence hash for diagnosis;
5. do not mutate target evidence or receipts to make the failed run appear valid.

The operator retained the identified previous-build backup during the earlier
promotion. A
rollback plan remains unproven until a separately authorized maintenance drill
tests the actual restoration mechanism.

## 7. Factual release claims

A passing build supports these claims:

- QCG v3 builds and its automated contracts pass in the recorded environment;
- the repository contains four progressively registered WebMCP tools;
- the local execution fixtures are the published bounded Q# and OpenQASM Bell samples;
- QPU submission is structurally disabled and counted as zero.

Do not claim stable deployment, native Chrome success, generalized Q# execution,
provider compatibility, quantum advantage, cost savings, scientific validity,
or external readiness from a build alone.

`ready_for_external_execution` is a preflight report state. It is not provider
availability, a quote, a credential check, a job submission, or authorization.

## 8. Open release blockers

The QCG v3 console, headers, samples, WASM asset, Companion packages and bounded
human preflight are published with a closed source/package/hosting parity chain.
Remaining release-adjacent gates are:

1. refresh or revalidate target-profile evidence if either bundled profile
   expires before the final acceptance run;
2. complete the human-controlled remainder of Action 237: consent, local
   simulation and export trace on the promoted public bytes;
3. retry upload of the already tagged and hash-validated source archive after
   Zenodo transport recovers, then publish/synchronize the reserved software
   DOI;
4. run a rollback restoration drill during a separately authorized maintenance
   window if operational proof beyond the retained backup boundary is required.

Video production and final Devpost submission are separate author-controlled
gates and are outside this release runbook.
