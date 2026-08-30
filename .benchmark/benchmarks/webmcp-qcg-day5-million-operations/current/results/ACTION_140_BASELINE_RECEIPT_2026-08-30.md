# Action 140 — local decision-engine baseline receipt

Recorded: 2026-08-30. Scope: QCG decision engine only. HTTP canary, E2B, provider, QPU, payment and deployment calls: **0**.

## Runner

The Node/Linux SSR bundle imports the repository's `QcgServices` and `demoCards`. Each operation runs the actual load-demo-artifact, inspect, evaluate and receipt-construction flow. A deterministic in-process analyzer replaces the browser Worker solely for this engine benchmark; no quantum program is compiled or simulated during these measurements.

The runner records expected-decision mismatches, effect mismatches, missing receipts, receipt digest mismatches, per-operation latency percentiles, decision counts, throughput and a deterministic operation digest.

## Windows local results

| Receipt | Operations | p50 / p95 / p99 ms | Throughput ops/s | Status |
| --- | ---: | ---: | ---: | --- |
| `windows-local.json` | 1,000 | 1.55 / 4.14 / 11.28 | 497.65 | pass |
| `windows-local-repeat.json` | 1,000 | 1.19 / 2.32 / 3.64 | 743.29 | pass |
| `windows-local-10000.json` | 10,000 | 1.46 / 2.50 / 4.37 | 626.88 | pass |

The two 1,000-operation passes used the same seed (`20260830`), sandbox index (`0`) and frozen corpus digest (`caaa67b6…ab60ca76`). Their operation digests are identical:

`916dc89468a3ce2ffd2932897c77e3c6d7b71ff0e712a87f284003ed0af4c795`

All three Windows receipts report zero expected-decision mismatches, unauthorized-effect mismatches, missing receipts and receipt digest mismatches. The 10,000-operation receipt matches the planned per-sandbox workload scale; it is a local baseline, not an E2B result.

## Multipass Ubuntu baseline

The VM `qcg-day5-baseline-20260830` was created with Ubuntu 24.04 LTS and requested limits of 2 vCPU, 4 GiB RAM and 20 GiB disk. It remained without SSH/IP and Multipass reported an unknown state; direct Hyper-V inspection was denied by the current Windows authorization policy. No Node command or benchmark operation ran in that VM.

`multipass-ubuntu-baseline-blocked.json` preserves this as a blocked, zero-operation receipt. No Linux throughput is claimed. Stalled Multipass CLI clients created by this task were terminated; the Multipass service and VM were not force-modified.

## Aggregation

`aggregate.json` accepts all four result receipts: three passing Windows runs plus one blocked Ubuntu receipt. It records 12,000 completed engine operations, 1.2% of the planned one-million-operation campaign, with no cost observation.
