#!/usr/bin/env python3
"""Run one authorized, gated E2B campaign for the real QCG engine bundle.

The E2B API key is read from the process environment or an explicitly supplied
external env file. It is never uploaded, written to a receipt, or printed.
"""
from __future__ import annotations

import argparse
import asyncio
import json
import os
import statistics
import time
from dataclasses import asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from e2b import AsyncSandbox, CommandExitException
from e2b.sandbox.sandbox_api import SandboxQuery


GATE_COUNTS = {
    "e2b-warmup": 10,
    "e2b-intermediate": 50,
    "e2b-full": 100,
    "e2b-repeat": 100,
}


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def load_api_key(env_file: Path | None) -> str:
    key = os.environ.get("E2B_API_KEY", "").strip()
    if not key and env_file:
        for raw in env_file.read_text(encoding="utf-8-sig").splitlines():
            line = raw.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            name, value = line.split("=", 1)
            if name.strip() == "E2B_API_KEY":
                key = value.strip().strip('"').strip("'")
                break
    if not key:
        raise RuntimeError("E2B_API_KEY is unavailable.")
    return key


async def list_owned(api_key: str, slug: str) -> list[Any]:
    paginator = AsyncSandbox.list(
        query=SandboxQuery(metadata={"qcg_benchmark": slug}),
        limit=100,
        api_key=api_key,
    )
    items: list[Any] = []
    while paginator.has_next:
        items.extend(await paginator.next_items(api_key=api_key))
    return items


def metric_summary(samples: list[Any]) -> dict[str, Any]:
    if not samples:
        return {"samples": 0}
    return {
        "samples": len(samples),
        "cpu_count": max(sample.cpu_count for sample in samples),
        "cpu_used_pct_max": max(sample.cpu_used_pct for sample in samples),
        "mem_total_bytes": max(sample.mem_total for sample in samples),
        "mem_used_bytes_max": max(sample.mem_used for sample in samples),
        "disk_total_bytes": max(sample.disk_total for sample in samples),
        "disk_used_bytes_max": max(sample.disk_used for sample in samples),
    }


async def kill_all(entries: list[dict[str, Any]], api_key: str) -> list[dict[str, Any]]:
    async def kill(entry: dict[str, Any]) -> dict[str, Any]:
        sandbox = entry.get("sandbox")
        if sandbox is None:
            return {"sandbox_id": entry.get("sandbox_id"), "killed": False, "reason": "not_created"}
        try:
            killed = await sandbox.kill(api_key=api_key)
            return {"sandbox_id": sandbox.sandbox_id, "killed": bool(killed)}
        except Exception as exc:  # receipt carries a bounded class, never credentials
            return {"sandbox_id": sandbox.sandbox_id, "killed": False, "reason": type(exc).__name__}

    return await asyncio.gather(*(kill(entry) for entry in entries))


async def main_async(args: argparse.Namespace) -> int:
    root = args.root.resolve()
    config = load_json(root / "config.json")
    plan = load_json(root / "results" / "preparation-plan.json")
    baseline = load_json(args.baseline.resolve())
    bundle = args.bundle.resolve()
    if not bundle.is_file():
        raise RuntimeError(f"QCG engine bundle is missing: {bundle}")

    api_key = load_api_key(args.env_file.resolve() if args.env_file else None)
    slug = config["benchmark_slug"]
    seed = int(config["engine"]["seed"])
    operations = int(args.operations or config["engine"]["operations_per_sandbox"])
    expected_count = GATE_COUNTS[args.gate]
    count = int(args.count or expected_count)
    if count != expected_count and not args.allow_count_override:
        raise RuntimeError(f"{args.gate} requires {expected_count} sandboxes; received {count}.")
    if operations != int(config["engine"]["operations_per_sandbox"]) and not args.allow_count_override:
        raise RuntimeError("The published gate requires the configured operations_per_sandbox.")

    existing = await list_owned(api_key, slug)
    if existing:
        states = [{"sandbox_id": item.sandbox_id, "state": str(item.state)} for item in existing]
        raise RuntimeError(f"Owned QCG sandboxes already exist; apply their kill plan first: {states}")

    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    run_id = args.run_id or f"{args.gate}-{stamp}"
    output_dir = (args.output_dir or (root / "results" / run_id)).resolve()
    output_dir.mkdir(parents=True, exist_ok=False)
    bundle_bytes = bundle.read_bytes()
    if api_key.encode("utf-8") in bundle_bytes:
        raise RuntimeError("Secret scan refused the bundle.")

    plan_receipt = {
        "schema_version": "qcg-e2b-campaign-plan.v1",
        "run_id": run_id,
        "gate": args.gate,
        "sandboxes": count,
        "operations_per_sandbox": operations,
        "target_operations": count * operations,
        "corpus_digest": plan["corpus_digest"],
        "template": args.template,
        "network": "disabled",
        "created_at": utc_now(),
        "dry_run": bool(args.dry_run),
        "provider_calls": 0,
        "qpu_calls": 0,
        "payment_calls": 0,
    }
    (output_dir / "campaign-plan.json").write_text(json.dumps(plan_receipt, indent=2) + "\n", encoding="utf-8")
    if args.dry_run:
        print(json.dumps(plan_receipt, indent=2))
        return 0

    provision_sem = asyncio.Semaphore(args.provision_concurrency)
    entries: list[dict[str, Any]] = []

    async def provision(index: int) -> dict[str, Any]:
        last_error = "unattempted"
        for attempt in (1, 2):
            sandbox = None
            try:
                async with provision_sem:
                    sandbox = await AsyncSandbox.create(
                        template=args.template,
                        timeout=args.timeout_seconds,
                        metadata={
                            "qcg_benchmark": slug,
                            "qcg_run_id": run_id,
                            "qcg_gate": args.gate,
                            "qcg_index": str(index),
                        },
                        allow_internet_access=False,
                        api_key=api_key,
                        request_timeout=60,
                    )
                    info = await sandbox.get_info(api_key=api_key)
                    await sandbox.files.write(
                        "/home/user/qcg-decision-engine-runner.mjs",
                        bundle_bytes,
                        request_timeout=60,
                    )
                    node = await sandbox.commands.run("node --version", timeout=30)
                if node.exit_code != 0:
                    raise RuntimeError("node_runtime_unavailable")
                return {
                    "index": index,
                    "sandbox": sandbox,
                    "sandbox_id": sandbox.sandbox_id,
                    "info": info,
                    "node_version": node.stdout.strip()[:64],
                    "attempt": attempt,
                }
            except Exception as exc:
                last_error = type(exc).__name__
                if sandbox is not None:
                    try:
                        await sandbox.kill(api_key=api_key)
                    except Exception:
                        pass
                if attempt == 1:
                    await asyncio.sleep(1.0)
        return {"index": index, "sandbox": None, "sandbox_id": None, "error": last_error, "attempt": 2}

    provisioned = await asyncio.gather(*(provision(index) for index in range(count)))
    entries.extend(provisioned)
    ready = [entry for entry in entries if entry.get("sandbox") is not None]
    if len(ready) != count:
        kills = await kill_all(ready, api_key)
        summary = {
            **plan_receipt,
            "status": "blocked",
            "phase": "provision",
            "ready": len(ready),
            "failures": [{"index": item["index"], "error": item.get("error")} for item in entries if item.get("sandbox") is None],
            "kill_results": kills,
        }
        (output_dir / "campaign-summary.json").write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
        print(json.dumps(summary, indent=2))
        return 2

    started = time.perf_counter()

    async def execute(entry: dict[str, Any]) -> dict[str, Any]:
        index = int(entry["index"])
        sandbox = entry["sandbox"]
        command = (
            "node /home/user/qcg-decision-engine-runner.mjs "
            f"--operations {operations} --seed {seed} --sandbox-index {index} "
            f"--gate {args.gate} --corpus-digest {plan['corpus_digest']} "
            "--output /home/user/qcg-result.json"
        )
        try:
            command_result = await sandbox.commands.run(command, timeout=args.command_timeout_seconds)
            raw = await sandbox.files.read("/home/user/qcg-result.json", format="text", request_timeout=60)
            if api_key in raw:
                raise RuntimeError("secret_exposure")
            result = json.loads(raw)
            info = entry["info"]
            metrics = await sandbox.get_metrics(api_key=api_key)
            result["run_id"] = f"{run_id}-{index:03d}"
            result["sandbox_id"] = sandbox.sandbox_id
            result["execution"] = {
                **result.get("execution", {}),
                "environment": "e2b",
                "node_version": entry["node_version"],
                "template_id": info.template_id,
                "cpu_count": info.cpu_count,
                "memory_mb": info.memory_mb,
                "internet_access": False,
                "provision_attempt": entry["attempt"],
                "command_exit_code": command_result.exit_code,
                "metrics": metric_summary(metrics),
            }
            if command_result.exit_code != 0:
                result["status"] = "fail"
                result["error_count"] = max(1, int(result.get("error_count", 0)))
            path = output_dir / f"e2b-{args.gate}-{index:03d}.json"
            path.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
            return result
        except Exception as exc:
            diagnostic: dict[str, Any] = {}
            if isinstance(exc, CommandExitException):
                safe_stderr = (exc.stderr or "").replace(api_key, "[REDACTED]")[-1200:]
                safe_stdout = (exc.stdout or "").replace(api_key, "[REDACTED]")[-1200:]
                diagnostic = {
                    "command_exit_code": int(exc.exit_code),
                    "stderr_tail": safe_stderr,
                    "stdout_tail": safe_stdout,
                }
            failure = {
                "schema_version": "qcg-benchmark-result.v1",
                "benchmark_slug": slug,
                "run_id": f"{run_id}-{index:03d}",
                "gate": args.gate,
                "sandbox_id": sandbox.sandbox_id,
                "seed": seed,
                "corpus_digest": plan["corpus_digest"],
                "operations": 0,
                "elapsed_ms": 0,
                "status": "fail",
                "error_count": 1,
                "unauthorized_effects": 0,
                "error_class": type(exc).__name__,
                "diagnostic": diagnostic,
            }
            (output_dir / f"e2b-{args.gate}-{index:03d}.json").write_text(json.dumps(failure, indent=2) + "\n", encoding="utf-8")
            return failure

    try:
        results = await asyncio.gather(*(execute(entry) for entry in ready))
    finally:
        kill_results = await kill_all(ready, api_key)

    wall_seconds = time.perf_counter() - started
    survivors = await list_owned(api_key, slug)
    completed_operations = sum(int(result.get("operations", 0)) for result in results if result.get("status") == "pass")
    errors = sum(int(result.get("error_count", 0)) for result in results)
    unauthorized = sum(int(result.get("unauthorized_effects", 0)) for result in results)
    missing_receipts = sum(int(result.get("checks", {}).get("receipt_missing", 0)) for result in results)
    digest_failures = sum(int(result.get("checks", {}).get("receipt_digest_mismatches", 0)) for result in results)
    decision_mismatches = sum(int(result.get("checks", {}).get("expected_decision_mismatches", 0)) for result in results)
    p95_values = [float(result["latency_ms"]["p95"]) for result in results if result.get("status") == "pass" and "latency_ms" in result]
    p95_limit = float(baseline["latency_ms"]["p95"]) * float(config["stop_conditions"]["p95_baseline_multiplier_gt"])
    error_rate = errors / max(1, count * operations)
    stop_reasons: list[str] = []
    if completed_operations != count * operations:
        stop_reasons.append("operation_coverage")
    if error_rate > float(config["stop_conditions"]["error_rate_gt"]):
        stop_reasons.append("error_rate")
    if unauthorized:
        stop_reasons.append("unauthorized_effect")
    if missing_receipts:
        stop_reasons.append("receipt_loss")
    if digest_failures:
        stop_reasons.append("receipt_digest")
    if decision_mismatches:
        stop_reasons.append("decision_mismatch")
    if p95_values and max(p95_values) > p95_limit:
        stop_reasons.append("p95_baseline_multiplier")
    if survivors:
        stop_reasons.append("sandbox_cleanup")

    reproducibility: dict[str, Any] = {"checked": False}
    if args.gate == "e2b-repeat":
        if not args.compare_dir:
            stop_reasons.append("repeat_comparison_missing")
        else:
            prior_files = sorted(args.compare_dir.resolve().glob("e2b-e2b-full-*.json"))
            prior = {int(load_json(path).get("execution", {}).get("sandbox_index", -1)): load_json(path) for path in prior_files}
            mismatched: list[int] = []
            for result in results:
                index = int(result.get("execution", {}).get("sandbox_index", -1))
                if index not in prior or result.get("checks", {}).get("operation_digest") != prior[index].get("checks", {}).get("operation_digest"):
                    mismatched.append(index)
            reproducibility = {"checked": True, "prior_results": len(prior), "mismatched_indices": mismatched}
            if mismatched:
                stop_reasons.append("operation_digest_reproducibility")

    summary = {
        "schema_version": "qcg-e2b-campaign-summary.v1",
        "run_id": run_id,
        "gate": args.gate,
        "status": "pass" if not stop_reasons else "fail",
        "sandboxes_requested": count,
        "sandboxes_completed": sum(1 for result in results if result.get("status") == "pass"),
        "operations": completed_operations,
        "target_operations": count * operations,
        "wall_seconds": wall_seconds,
        "aggregate_throughput_ops_per_second": completed_operations / wall_seconds if wall_seconds else 0,
        "latency_ms": {
            "p95_min": min(p95_values) if p95_values else None,
            "p95_median": statistics.median(p95_values) if p95_values else None,
            "p95_max": max(p95_values) if p95_values else None,
            "stop_limit": p95_limit,
        },
        "error_rate": error_rate,
        "unauthorized_effects": unauthorized,
        "missing_receipts": missing_receipts,
        "receipt_digest_mismatches": digest_failures,
        "decision_mismatches": decision_mismatches,
        "reproducibility": reproducibility,
        "stop_reasons": sorted(set(stop_reasons)),
        "kill_results": kill_results,
        "surviving_owned_sandboxes": [{"sandbox_id": item.sandbox_id, "state": str(item.state)} for item in survivors],
        "cost_usd": None,
        "cost_note": "The E2B SDK used by this campaign exposes runtime metrics, not an invoice total. No cost value is inferred.",
        "provider_calls": 0,
        "qpu_calls": 0,
        "payment_calls": 0,
        "completed_at": utc_now(),
    }
    (output_dir / "campaign-summary.json").write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(summary, indent=2))
    return 0 if summary["status"] == "pass" else 2


def parser() -> argparse.ArgumentParser:
    default_root = Path(__file__).resolve().parents[1]
    result = argparse.ArgumentParser(description=__doc__)
    result.add_argument("--root", type=Path, default=default_root)
    result.add_argument("--bundle", type=Path, default=default_root / "harness" / "bundle" / "qcg-decision-engine-runner.js")
    result.add_argument("--baseline", type=Path, default=default_root / "results" / "windows-local-10000.json")
    result.add_argument("--gate", choices=sorted(GATE_COUNTS), required=True)
    result.add_argument("--count", type=int)
    result.add_argument("--operations", type=int)
    result.add_argument("--allow-count-override", action="store_true")
    result.add_argument("--template", default="base")
    result.add_argument("--timeout-seconds", type=int, default=600)
    result.add_argument("--command-timeout-seconds", type=int, default=300)
    result.add_argument("--provision-concurrency", type=int, default=20)
    result.add_argument("--env-file", type=Path)
    result.add_argument("--run-id")
    result.add_argument("--output-dir", type=Path)
    result.add_argument("--compare-dir", type=Path)
    result.add_argument("--dry-run", action="store_true")
    return result


def main() -> int:
    return asyncio.run(main_async(parser().parse_args()))


if __name__ == "__main__":
    raise SystemExit(main())
