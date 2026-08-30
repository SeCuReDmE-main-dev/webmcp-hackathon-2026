# WebMCP-QCG Day 5 benchmark report

## Outcome

The gated E2B Professional campaign passed. QCG completed 2,600,000 deterministic decision/evidence operations across 260 successful sandboxes. The two million-operation passes used 100 concurrent sandboxes and produced 100/100 matching operation digests by sandbox index.

This result measures the QCG decision engine. It does not measure quantum-hardware execution, quantum advantage, or provider performance.

## Frozen method

- seed: `20260830`;
- frozen corpus digest: `caaa67b6e614626ab2e0e17fd34138bee0711b4c206980fe9336eec0ab60ca76`;
- 10,000 operations per sandbox;
- E2B template observed: 2 vCPU, 512 MB RAM, Node.js v20.9.0;
- sandbox internet access: disabled;
- stop limit: p95 greater than 4.9964 ms, error rate above 0.5%, any unauthorized effect, receipt loss, digest mismatch, decision mismatch, secret exposure, or surviving sandbox;
- provider, QPU and payment calls: zero.

## Engine results

| Gate | Sandboxes | Operations | Wall time | Aggregate throughput | Maximum sandbox p95 |
|---|---:|---:|---:|---:|---:|
| Warm-up | 10 | 100,000 | 12.174 s | 8,214.19 ops/s | 1.575 ms |
| Intermediate | 50 | 500,000 | 42.522 s | 11,758.65 ops/s | 1.748 ms |
| Full | 100 | 1,000,000 | 34.161 s | 29,273.02 ops/s | 1.711 ms |
| Repeat | 100 | 1,000,000 | 57.112 s | 17,509.32 ops/s | 1.745 ms |

Every passing gate recorded zero errors, unauthorized effects, missing receipts, receipt-digest mismatches, decision mismatches and surviving QCG sandboxes. The full/repeat digest comparison matched all 100 indices.

Aggregate throughput varies because it includes a concurrent hosted scheduling envelope. The digest and authority invariants carry the primary proof; throughput remains an observed implementation metric rather than a universal capacity claim.

## Diagnostic trail

Two zero-operation diagnostic attempts preceded the passing warm-up. Both cleaned up every sandbox. They revealed that Node 20 interpreted the ESM bundle as CommonJS because the remote filename ended in `.js`. Uploading the unchanged bundle as `.mjs` resolved the issue. The failed receipts remain in the evidence set.

## Public HTTP canary

The public canary is a separate delivery experiment:

- target: `https://qcg.securedme.ca/`;
- schedule: 1, 2 and 5 RPS for 10 seconds each;
- 80/80 responses: HTTP 200;
- errors and timeouts: zero;
- p50: 19.295 ms;
- p95: 30.825 ms;
- p99/max: 342.538 ms;
- stop limit: 1,500 ms p95.

These values describe HTTP delivery of the stable site. They are never combined with QCG engine throughput.

## Cost and resource boundary

The E2B SDK returned runtime metrics without an invoice total. Campaign cost is therefore `unknown`; the report does not infer spending from the account-credit screenshot. The full campaign used the observed base template only. The optional 1/2/4/8-vCPU sensitivity matrix remains unexecuted because it requires separately built templates and is not needed to prove deterministic correctness.

The Windows local baseline passed. The requested Multipass Ubuntu VM was created with 2 vCPU, 4 GiB RAM and 20 GiB disk but did not obtain a usable SSH/IP path, so it produced zero benchmark operations. That blocked comparator is retained honestly and does not weaken the two passing 100-sandbox E2B proofs.

## Evidence

- `results/day5-campaign-aggregate.json`
- `results/e2b-warmup-20260830T190254Z/campaign-summary.json`
- `results/e2b-intermediate-20260830T190335Z/campaign-summary.json`
- `results/e2b-full-20260830T190520Z/campaign-summary.json`
- `results/e2b-repeat-20260830T190708Z/campaign-summary.json`
- `results/http-canary-20260830T191121Z.json`
- `results/ACTION_140_BASELINE_RECEIPT_2026-08-30.md`

The machine-readable aggregate includes SHA-256 hashes for every selected campaign receipt.
