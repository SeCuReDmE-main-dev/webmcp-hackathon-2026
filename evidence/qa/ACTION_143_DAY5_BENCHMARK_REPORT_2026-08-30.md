# Action 143 — Day 5 consolidated benchmark receipt

Date: 2026-08-30
Status: PASS

## Engine proof

- Passing gates: 10, 50, 100 and repeated 100 sandboxes.
- Successful sandboxes: 260.
- Validated operations: 2,600,000.
- Full pass: 1,000,000 operations.
- Repeated full pass: 1,000,000 operations.
- Digest reproducibility: 100/100 sandbox indices.
- Unauthorized effects, lost receipts, digest mismatches, decision mismatches and surviving sandboxes: zero.
- Provider calls, QPU calls and payment calls: zero.

## Delivery proof

- 80 requests at 1, 2 and 5 RPS.
- 80 HTTP 200 responses.
- Errors and timeouts: zero.
- p95: 30.825 ms against a 1,500 ms stop limit.

## Interpretation boundary

The E2B campaign measures the deterministic QCG decision/evidence engine. The HTTP canary measures only delivery of the stable cPanel site. No claim about quantum-hardware speed, quantum advantage, provider economics or universal framework execution follows from these results.

The E2B SDK did not return a billing receipt. Cost remains unknown and is not inferred from the account-credit balance.

Machine-readable authority: `.benchmark/benchmarks/webmcp-qcg-day5-million-operations/current/results/day5-campaign-aggregate.json`.
