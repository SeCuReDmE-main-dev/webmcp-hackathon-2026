/**
 * Node-only deterministic benchmark runner for the actual QCG service/catalog flow.
 * It deliberately injects bounded local doubles for the browser Worker boundary:
 * this measures intake -> inspect -> evaluate -> receipt construction, not WASM or QPU work.
 */
import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { demoCards } from '../../../../../prototype/webmcp-qcg/src/catalog'
import { digest } from '../../../../../prototype/webmcp-qcg/src/crypto'
import { QcgServices, type ArtifactAnalyzer, type Simulator } from '../../../../../prototype/webmcp-qcg/src/services'

const SLUG = 'webmcp-qcg-day5-million-operations'
const SCHEMA = 'qcg-benchmark-result.v1'

interface Arguments {
  operations: number
  seed: number
  sandboxIndex: number
  gate: string
  corpusDigest: string
  output: string
}

const parseNumber = (value: string | undefined, fallback: number, name: string): number => {
  if (value === undefined) return fallback
  const parsed = Number(value)
  if (!Number.isSafeInteger(parsed) || parsed < 0) throw new Error(`${name} must be a non-negative safe integer.`)
  return parsed
}

function argumentsFrom(argv: string[]): Arguments {
  const values = new Map<string, string>()
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index]
    const value = argv[index + 1]
    if (!key?.startsWith('--') || value === undefined) throw new Error('Arguments must be supplied as --name value pairs.')
    values.set(key.slice(2), value)
  }
  const corpusDigest = values.get('corpus-digest') ?? ''
  if (!/^[a-f0-9]{64}$/.test(corpusDigest)) throw new Error('--corpus-digest must be a SHA-256 hex digest.')
  const output = values.get('output')
  if (!output) throw new Error('--output is required.')
  const operations = parseNumber(values.get('operations'), 1000, 'operations')
  if (operations < 1) throw new Error('operations must be at least 1.')
  return {
    operations,
    seed: parseNumber(values.get('seed'), 20260830, 'seed'),
    sandboxIndex: parseNumber(values.get('sandbox-index'), 0, 'sandbox-index'),
    gate: values.get('gate') ?? 'local-validation',
    corpusDigest,
    output
  }
}

function xorshift32(seed: number): () => number {
  let state = (seed >>> 0) || 0x9e3779b9
  return () => {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    return state >>> 0
  }
}

function percentile(sorted: number[], value: number): number {
  if (sorted.length === 0) return 0
  return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * value) - 1)]
}

const analyzer: ArtifactAnalyzer = {
  async analyze(source) {
    const valid = source.includes('ResetAll')
    return { valid, diagnosticCount: valid ? 0 : 1, diagnostics: valid ? [] : ['Bounded deterministic analyzer diagnostic.'] }
  }
}

const simulator: Simulator = {
  async run(_signal, limits) {
    return { bellInvariant: true, shotsRequested: limits.shots, shotsReturned: limits.shots, outcomeCounts: { '[Zero, Zero]': limits.shots } }
  }
}

async function main(): Promise<void> {
  const args = argumentsFrom(process.argv.slice(2))
  const random = xorshift32(args.seed ^ args.sandboxIndex)
  const latencies: number[] = []
  const decisionCounts: Record<string, number> = {}
  const operationEvidence: Array<{ card: string; expected: string; actual: string; receipt: string }> = []
  let mismatches = 0
  let unauthorizedEffects = 0
  let receiptFailures = 0
  let digestFailures = 0
  let errors = 0

  for (let operation = 0; operation < args.operations; operation += 1) {
    const card = demoCards[random() % demoCards.length]
    const now = () => Date.parse('2026-08-30T12:00:00.000Z') + (args.sandboxIndex * args.operations + operation) * 10
    const services = new QcgServices(simulator, now, analyzer)
    const started = performance.now()
    try {
      const { manifest } = await services.loadDemoArtifact(card.id)
      const inspected = await services.inspect({ artifact_id: manifest.artifact_id })
      const recommendation = await services.evaluate({
        manifest_id: inspected.manifest_id,
        target_profile_id: card.profileId,
        scientific_intent: card.scientificIntent,
        observable: card.observable,
        parameters: {},
        requested_limits: card.requestedLimits
      })
      const receipt = services.snapshot().receipt
      const expectedReceiptDigest = receipt
        ? await digest({
            manifest: receipt.manifest,
            target_profile: receipt.target_profile,
            recommendation: receipt.recommendation,
            human_decision: receipt.human_decision,
            simulation: receipt.simulation,
            effects: receipt.effects
          })
        : ''
      const effects = services.snapshot().effects
      if (recommendation.decision !== card.expectedDecision) mismatches += 1
      if (!receipt || receipt.digest !== expectedReceiptDigest) digestFailures += 1
      if (!receipt) receiptFailures += 1
      if (effects.qpu_submissions !== 0 || effects.local_simulations !== 0 || effects.inspections !== 1 || effects.evaluations !== 1) unauthorizedEffects += 1
      decisionCounts[recommendation.decision] = (decisionCounts[recommendation.decision] ?? 0) + 1
      operationEvidence.push({ card: card.id, expected: card.expectedDecision, actual: recommendation.decision, receipt: receipt?.digest ?? 'missing' })
    } catch {
      errors += 1
    }
    latencies.push(performance.now() - started)
  }

  const elapsedMs = latencies.reduce((sum, latency) => sum + latency, 0)
  const sorted = [...latencies].sort((left, right) => left - right)
  const operationDigest = createHash('sha256').update(JSON.stringify(operationEvidence)).digest('hex')
  const result = {
    schema_version: SCHEMA,
    benchmark_slug: SLUG,
    run_id: `local-${args.gate}-${args.sandboxIndex}-${args.seed}`,
    gate: args.gate,
    sandbox_id: `local-${args.sandboxIndex}`,
    seed: args.seed,
    corpus_digest: args.corpusDigest,
    operations: args.operations,
    elapsed_ms: elapsedMs,
    status: errors === 0 && mismatches === 0 && unauthorizedEffects === 0 && receiptFailures === 0 && digestFailures === 0 ? 'pass' : 'fail',
    error_count: errors,
    unauthorized_effects: unauthorizedEffects,
    engine_only: true,
    http_canary_included: false,
    execution: { runtime: 'node', platform: process.platform, arch: process.arch, sandbox_index: args.sandboxIndex, deterministic_worker_boundary: true },
    latency_ms: { p50: percentile(sorted, 0.5), p95: percentile(sorted, 0.95), p99: percentile(sorted, 0.99), min: sorted[0] ?? 0, max: sorted.at(-1) ?? 0 },
    throughput_ops_per_second: elapsedMs === 0 ? 0 : args.operations / (elapsedMs / 1000),
    decision_counts: decisionCounts,
    checks: {
      expected_decision_mismatches: mismatches,
      unauthorized_effect_mismatches: unauthorizedEffects,
      receipt_missing: receiptFailures,
      receipt_digest_mismatches: digestFailures,
      operation_digest: operationDigest
    }
  }
  mkdirSync(dirname(args.output), { recursive: true })
  writeFileSync(args.output, `${JSON.stringify(result, null, 2)}\n`, 'utf8')
  console.log(JSON.stringify(result, null, 2))
  if (result.status !== 'pass') process.exitCode = 1
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Benchmark runner failed.')
  process.exitCode = 1
})
