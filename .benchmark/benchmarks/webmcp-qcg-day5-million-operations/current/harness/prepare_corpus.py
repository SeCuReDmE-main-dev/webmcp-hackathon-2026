#!/usr/bin/env python3
"""Validate the frozen textual corpus and write a local execution plan.

This helper performs no E2B, HTTP, provider, QPU or subprocess work. It only
reads the manifest/config and corpus, then writes the requested plan JSON.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path


def read_json(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def digest_files(root: Path, paths: list[str], max_bytes: int) -> tuple[str, list[dict]]:
    records: list[dict] = []
    for relative in paths:
        path = root / relative
        if not path.is_file():
            raise ValueError(f"missing corpus item: {relative}")
        raw = path.read_bytes()
        if len(raw) > max_bytes:
            raise ValueError(f"item exceeds {max_bytes} bytes: {relative}")
        raw.decode("utf-8")
        records.append({"path": relative.replace("\\", "/"), "bytes": len(raw), "sha256": hashlib.sha256(raw).hexdigest()})
    canonical = "".join(f"{item['path']}:{item['sha256']}\n" for item in sorted(records, key=lambda item: item["path"]))
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest(), records


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--output", type=Path, default=None)
    args = parser.parse_args()
    root = args.root.resolve()
    manifest = read_json(root / "corpus-manifest.json")
    config = read_json(root / "config.json")
    paths = [item["path"] for item in manifest["profiles"] + manifest["decisions"]]
    corpus_digest, records = digest_files(root, paths, manifest["max_item_bytes"])
    engine = config["engine"]
    plan = {
        "schema_version": "qcg-preparation-plan.v1",
        "benchmark_slug": config["benchmark_slug"],
        "status": "prepared_not_executed",
        "e2b_launched": False,
        "http_canary_launched": False,
        "provider_calls": 0,
        "qpu_calls": 0,
        "payment_calls": 0,
        "corpus_digest": corpus_digest,
        "corpus_items": records,
        "expected_total_operations": engine["total_operations"],
        "operations_per_sandbox": engine["operations_per_sandbox"],
        "gates": config["gates"],
        "resource_profiles": config["resource_profiles"],
        "stop_conditions": config["stop_conditions"],
        "next_action": "Run the local validation gate only after explicit execution authorization; E2B remains unlaunched.",
    }
    output = args.output or (root / "results" / "preparation-plan.json")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(plan, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({"status": plan["status"], "corpus_digest": corpus_digest, "items": len(records), "output": str(output)}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
