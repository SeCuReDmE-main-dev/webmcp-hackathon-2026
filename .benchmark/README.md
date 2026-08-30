# WebMCP-QCG Day 5 benchmark workspace

This indexed workspace contains the reproducible Day 5 benchmark for the QCG decision engine. The authorized campaign completed its 10-, 50-, 100- and repeated 100-sandbox gates. The separate capped public canary also passed.

## Active entry

`benchmarks/webmcp-qcg-day5-million-operations/`

The main scenario is one million deterministic engine evaluations: 100 sandboxes × 10,000 operations. It passed twice with 100/100 operation-digest matches. Including warm-up and intermediate gates, 2.6 million operations completed across 260 successful sandboxes. The E2B Professional account screenshot supplied by the author establishes observed account capacity and credits; it is an account UI observation, not a billing API receipt or measured campaign cost.

## Safety boundary

The E2B launcher is the only script authorized to create sandboxes. It checks for prior QCG sandboxes, disables network access, uploads only the autonomous engine bundle, records bounded receipts, destroys every sandbox in `finally` and verifies zero survivors. It never uploads the API key or env file and never contacts a quantum provider.

Q# and OpenQASM are the two executable local profiles in the product plan. The remaining eight profiles are static inspection profiles: they may produce bounded findings and capability facts, but they never simulate, submit or imply provider readiness.

## Engine versus HTTP canary

The engine benchmark measures deterministic decision work, receipt construction, digest reproducibility and orchestration overhead. The cPanel canary measures only public HTTP delivery under `1 → 2 → 5 RPS` with hard bounds. HTTP latency, CDN behavior and hosting errors are reported separately from engine throughput.

## Layout

The active benchmark contains the frozen corpus, schemas, launchers, validation rules, per-sandbox receipts, the public-canary receipt and `results/day5-campaign-aggregate.json`.
