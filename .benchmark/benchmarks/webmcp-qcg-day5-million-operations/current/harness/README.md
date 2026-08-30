# Preparation and aggregation helpers

`prepare_corpus.py` validates UTF-8 corpus items, computes a stable SHA-256 corpus digest and writes `results/preparation-plan.json`. It never launches a sandbox or workload.

`aggregate_results.py` reads local `qcg-benchmark-result.v1` JSON files, rejects mismatched benchmark/seed/digest/effect fields, and writes a summary. It never launches a workload and never calls a provider.

`qcg-decision-engine-runner.ts` is the Action 140 executable runner. Its SSR bundle imports the actual `QcgServices` and `demoCards` source. It uses deterministic in-process analyzer/simulator boundaries so it measures intake, inspection, recommendation and receipt construction, without a browser Worker, provider, QPU or network request.

Examples:

```powershell
python .benchmark/benchmarks/webmcp-qcg-day5-million-operations/current/harness/prepare_corpus.py
python .benchmark/benchmarks/webmcp-qcg-day5-million-operations/current/harness/aggregate_results.py
```

Build and run the Node/Linux bundle from `prototype/webmcp-qcg`:

```powershell
npx vite build --config ..\..\.benchmark\benchmarks\webmcp-qcg-day5-million-operations\current\harness\vite.qcg-benchmark.config.mjs --ssr ..\..\.benchmark\benchmarks\webmcp-qcg-day5-million-operations\current\harness\qcg-decision-engine-runner.ts --outDir ..\..\.benchmark\benchmarks\webmcp-qcg-day5-million-operations\current\harness\bundle --emptyOutDir
node ..\..\.benchmark\benchmarks\webmcp-qcg-day5-million-operations\current\harness\bundle\qcg-decision-engine-runner.js --operations 1000 --seed 20260830 --sandbox-index 0 --gate local-validation --corpus-digest <digest> --output ..\..\.benchmark\benchmarks\webmcp-qcg-day5-million-operations\current\results\windows-local.json
```

The first command is a local preparation check. The second reports `no_data` until a separately authorized run supplies result JSON files. There is no E2B adapter in this scaffold.

## Authorized E2B gates

`run_e2b_campaign.py` is the only E2B launcher in this benchmark. It reads the
API key from the current process or an explicitly supplied external env file,
lists existing QCG sandboxes before creation, disables sandbox internet,
uploads only the autonomous engine bundle, runs one gated campaign, captures
resource metrics and kills every created sandbox in `finally`.

Dry-run the 10-sandbox gate:

```powershell
& '<SETTINGS_WORKSPACE>/.venv/Scripts/python.exe' `
  .benchmark/benchmarks/webmcp-qcg-day5-million-operations/current/harness/run_e2b_campaign.py `
  --gate e2b-warmup --env-file '<SETTINGS_WORKSPACE>/.env' --dry-run
```

Remove `--dry-run` only after the local 10,000-operation receipt passes. The
script refuses count changes unless `--allow-count-override` is explicit. It
never uploads the env file or API key and never contacts a quantum provider.

## Action 140 execution record

The explicitly authorized local Windows baseline uses 1,000 operations, seed `20260830`, sandbox index `0` and the frozen corpus digest from `results/preparation-plan.json`. It writes `results/windows-local.json`.

The explicitly authorized Multipass attempt requested Ubuntu 24.04 LTS with 2 vCPU, 4 GiB RAM and 20 GiB disk. It is represented by `results/multipass-ubuntu-baseline-blocked.json`: the VM did not obtain SSH/IP, so zero operations ran and no Linux throughput is claimed. No package installation, E2B, HTTP canary, provider, QPU or payment operation is part of this harness.
