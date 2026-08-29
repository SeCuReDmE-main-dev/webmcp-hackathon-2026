# QCG v2 release runbook

This runbook defines what a releasable QCG v2 build means. It does not authorize
a hosting mutation, provider call, QPU submission, Devpost submission, or spend.

The stable product address is
[https://qcg.securedme.ca/](https://qcg.securedme.ca/). The 2026-08-29 release
serves QCG directly over HTTPS and passed the live-origin acceptance gates.
Its archive SHA-256 is
`6d574985fbff4fe376395beae37f292889a5d187a9b81601eeb445d7e58c4d44`.

## 1. Release inputs

A release candidate must include:

- the QCG v2 source under `prototype/webmcp-qcg/`;
- the tracked `prototype/webmcp-qcg/package-lock.json`;
- the public sample at
  `prototype/webmcp-qcg/public/fixtures/qcg-bell-sample.qs`;
- the root [MIT license](../LICENSE) and
  [third-party notices](../THIRD_PARTY_NOTICES.md);
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

Expected results for the 2026-08-29 QCG v2 baseline:

- dependency installation completes from the lock file;
- 2 test files and 18 tests pass;
- TypeScript validation passes;
- Vite creates `prototype/webmcp-qcg/dist/`;
- the live official WebMCP smoke suite passes 2/2;
- `git diff --check` reports no whitespace errors.

Treat test counts as a baseline, not a reason to ignore newly added tests.

## 3. Artifact gate

The deployable static artifact is `prototype/webmcp-qcg/dist/`. Before any
upload, verify that it contains:

- `index.html`;
- the main JavaScript and CSS assets;
- the Q# Worker asset;
- the pinned Q# WebAssembly asset;
- `fixtures/qcg-bell-sample.qs`;
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
- a package manifest that verifies the eight expected release paths.

Do not upload manually over the live document root. Use the SecuredMe cPanel
Operator's explicit `plan -> confirmation -> apply` transaction with the exact
package hash and expected paths. The operator completed and verified that flow
for this release. A destructive rollback drill remains a separate maintenance
gate; the release procedure itself preserves a backup boundary. See the
[hosting baseline](../evidence/hosting/README.md) and the
[live acceptance receipt](../evidence/qa/LIVE_ORIGIN_ACCEPTANCE_RECEIPT_2026-08-29.md).

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

## 6. Rollback gate

Before promotion, identify the exact previous live state and a recoverable way
to restore it. If any stable-origin gate fails:

1. stop promotion;
2. restore the previous document-root state or routing target;
3. confirm that the host is no worse than the pre-release baseline;
4. retain the failed artifact and evidence hash for diagnosis;
5. do not mutate target evidence or receipts to make the failed run appear valid.

The current redirect is the pre-release baseline. A rollback plan is not proven
until the hosting operator has tested the actual promotion and restoration
mechanism.

## 7. Factual release claims

A passing build supports these claims:

- QCG v2 builds and its automated contracts pass in the recorded environment;
- the repository contains four progressively registered WebMCP tools;
- the only local execution fixture is the published bounded Bell sample;
- QPU submission is structurally disabled and counted as zero.

Do not claim stable deployment, native Chrome success, generalized Q# execution,
provider compatibility, quantum advantage, cost savings, scientific validity,
or external readiness from a build alone.

`ready_for_external_execution` is a preflight report state. It is not provider
availability, a quote, a credential check, a job submission, or authorization.

## 8. Open release blockers

The stable QCG release, headers, sample, WASM asset, human fallback and native
Chrome WebMCP smoke trace passed on 2026-08-29. Remaining release-adjacent gates
are:

1. refresh or revalidate target-profile evidence if either bundled profile
   expires before the final acceptance run;
2. repeat the live trace after any code or hosting change;
3. run a rollback drill during a separately authorized maintenance window.

Video production and final Devpost submission are separate author-controlled
gates and are outside this release runbook.
