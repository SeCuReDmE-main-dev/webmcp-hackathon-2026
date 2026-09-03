import { act, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useCallback, useState } from 'react'
import { exportOutput } from './contracts'
import { QcgServices, type ArtifactAnalyzer, type Simulator } from './services'
import { boundedWebMcpResponse, useQcgWebMcp, WEBMCP_RESPONSE_BUDGET_BYTES } from './webmcp'
import type { QcgState, ToolName } from './types'

const analyzer: ArtifactAnalyzer = {
  analyze: async (source) => ({
    valid: source.includes('ResetAll'),
    diagnosticCount: source.includes('ResetAll') ? 0 : 1,
    diagnostics: source.includes('ResetAll') ? [] : ['Q# compiler reported 1 bounded diagnostic.']
  })
}
const simulator: Simulator = {
  run: async (_signal, limits) => ({
    bellInvariant: true,
    shotsRequested: limits.shots,
    shotsReturned: limits.shots,
    outcomeCounts: { '[Zero, Zero]': limits.shots }
  })
}

function Harness({ services }: { services: QcgServices }) {
  const [state, setState] = useState<QcgState>(services.snapshot())
  const refresh = useCallback(() => setState(services.snapshot()), [services])
  const { registrationStatus } = useQcgWebMcp(services, state, refresh)
  return <output data-testid="registration-status">{registrationStatus}</output>
}

function SnapshotHarness({ services, state }: { services: QcgServices; state: QcgState }) {
  const refresh = useCallback(() => undefined, [])
  const { registrationStatus } = useQcgWebMcp(services, state, refresh)
  return <output data-testid="registration-status">{registrationStatus}</output>
}

interface RegisteredTool {
  name: ToolName
  description: string
  inputSchema: Record<string, unknown>
  outputSchema: Record<string, unknown>
  execute: (input: object, options: { signal: AbortSignal }) => Promise<unknown>
}

async function prepareConsentedSimulation(services: QcgServices) {
  const { manifest, card } = await services.loadDemoArtifact('simulate-first')
  const inspected = await services.inspect({ artifact_id: manifest.artifact_id })
  const recommendation = await services.evaluate({
    manifest_id: inspected.manifest_id,
    target_profile_id: card.profileId,
    scientific_intent: card.scientificIntent,
    observable: card.observable,
    parameters: {},
    requested_limits: card.requestedLimits
  })
  await services.decide({
    recommendation_id: recommendation.recommendation_id,
    choice: 'accepted',
    justification: 'I approve one bounded local simulation.'
  })
}

describe('WebMCP v2 lifecycle', () => {
  it('registers AgentLane metrics without sending verbatim QCG tool input', async () => {
    vi.stubEnv('VITE_AGENTLANE_PUBLISHING_KEY', 'wmk_test_agentlane_key_12345678901234567890')
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 202 }))
    const registrations: RegisteredTool[] = []
    Object.defineProperty(document, 'modelContext', {
      configurable: true,
      value: { registerTool: vi.fn(async (tool: RegisteredTool) => { registrations.push(tool) }) }
    })
    const services = new QcgServices(simulator, Date.now, analyzer)
    const { manifest, card } = await services.loadDemoArtifact('simulate-first')
    const view = render(<Harness services={services} />)
    await waitFor(() => expect(registrations).toHaveLength(4))

    for (const tool of registrations) {
      expect(tool.outputSchema).toMatchObject({ anyOf: expect.any(Array) })
    }
    let inspected: { manifest_id: string } | undefined
    await act(async () => {
      inspected = await registrations[0].execute(
        { artifact_id: manifest.artifact_id },
        { signal: new AbortController().signal }
      ) as { manifest_id: string }
    })
    const privacyCanary = 'private-human-intent-must-not-leave-qcg'
    await act(async () => {
      await registrations[1].execute({
        manifest_id: inspected!.manifest_id,
        target_profile_id: card.profileId,
        scientific_intent: privacyCanary,
        observable: card.observable,
        parameters: {},
        requested_limits: card.requestedLimits
      }, { signal: new AbortController().signal })
    })
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled())
    const emittedBodies = fetchSpy.mock.calls
      .map(([, init]) => typeof init?.body === 'string' ? init.body : '')
      .join('\n')
    expect(emittedBodies).not.toContain(privacyCanary)
    expect(fetchSpy.mock.calls.every(([url]) => String(url).includes('/v1/telemetry'))).toBe(true)

    view.unmount()
    delete (document as Document & { modelContext?: unknown }).modelContext
    fetchSpy.mockRestore()
    vi.unstubAllEnvs()
  })

  it('measures the 5000-byte response budget in UTF-8 for accents and emoji', () => {
    const accentWithin = { content: 'é'.repeat(2493) }
    const accentOver = { content: 'é'.repeat(2494) }
    const emojiWithin = { content: '🙂'.repeat(1246) }
    const emojiOver = { content: '🙂'.repeat(1247) }
    const bytes = (value: object) => new TextEncoder().encode(JSON.stringify(value)).byteLength

    expect(bytes(accentWithin)).toBeLessThanOrEqual(WEBMCP_RESPONSE_BUDGET_BYTES)
    expect(bytes(accentOver)).toBeGreaterThan(WEBMCP_RESPONSE_BUDGET_BYTES)
    expect(bytes(emojiWithin)).toBeLessThanOrEqual(WEBMCP_RESPONSE_BUDGET_BYTES)
    expect(bytes(emojiOver)).toBeGreaterThan(WEBMCP_RESPONSE_BUDGET_BYTES)
    expect(boundedWebMcpResponse(accentWithin)).toBe(accentWithin)
    expect(boundedWebMcpResponse(emojiWithin)).toBe(emojiWithin)
    expect(boundedWebMcpResponse(accentOver)).toEqual({
      truncated: true,
      summary: 'The result exceeds the WebMCP response budget. Review the visible QCG receipt.',
      budget_bytes: 5000
    })
    expect(boundedWebMcpResponse(emojiOver)).toMatchObject({ truncated: true, budget_bytes: 5000 })
  })

  it('validates a larger internal export before returning a typed WebMCP truncation notice', () => {
    const output = exportOutput.parse({
      export_id: 'export-large',
      receipt_id: 'receipt-large',
      format: 'json',
      digest: 'a'.repeat(64),
      summary: 'A bounded internal evidence export.',
      content: 'é'.repeat(5500)
    })
    expect(output.content).toHaveLength(5500)
    expect(boundedWebMcpResponse(output)).toMatchObject({ truncated: true, budget_bytes: 5000 })
  })

  it('registers all four guarded quantum tools when the native API returns void', async () => {
    const registerTool = vi.fn((_tool: RegisteredTool) => undefined)
    Object.defineProperty(document, 'modelContext', { configurable: true, value: { registerTool } })
    const services = new QcgServices(simulator, Date.now, analyzer)
    const view = render(<Harness services={services} />)
    await waitFor(() => expect(screen.getByTestId('registration-status').textContent).toBe('registered'))
    expect(registerTool.mock.calls.map(([tool]) => tool.name)).toEqual([
      'inspect_quantum_experiment',
      'evaluate_quantum_call',
      'run_bounded_local_simulation',
      'export_quantum_evidence_report'
    ])
    expect(registerTool.mock.calls[0]?.[0]).toMatchObject({ annotations: {
      readOnlyHint: true, destructiveHint: false, untrustedContentHint: true
    } })
    for (const [tool] of registerTool.mock.calls) {
      expect(tool.outputSchema).toMatchObject({ anyOf: expect.any(Array) })
      expect(JSON.stringify(tool.outputSchema)).toContain('required')
    }
    expect(registerTool.mock.calls[0]?.[0].description).toContain('manifest_id for evaluate_quantum_call')
    expect(registerTool.mock.calls[1]?.[0].description).toContain('recommendation_id')
    expect(registerTool.mock.calls[3]?.[0].description).toContain('receipt_id')
    expect(registerTool.mock.calls[0]?.[0].inputSchema).toMatchObject({ required: [] })
    view.unmount()
    delete (document as Document & { modelContext?: unknown }).modelContext
  })

  it('supports identifier-free inspection and returns every downstream chaining identifier', async () => {
    const registrations: RegisteredTool[] = []
    Object.defineProperty(document, 'modelContext', {
      configurable: true,
      value: { registerTool: vi.fn((tool: RegisteredTool) => { registrations.push(tool) }) }
    })
    const services = new QcgServices(simulator, Date.now, analyzer)
    const { card } = await services.loadDemoArtifact('simulate-first')
    const view = render(<Harness services={services} />)
    await waitFor(() => expect(registrations).toHaveLength(4))

    const inspected = await registrations[0].execute({}, { signal: new AbortController().signal }) as { manifest_id: string }
    const evaluated = await registrations[1].execute({
      manifest_id: inspected.manifest_id,
      target_profile_id: card.profileId,
      scientific_intent: card.scientificIntent,
      observable: card.observable,
      parameters: {},
      requested_limits: card.requestedLimits
    }, { signal: new AbortController().signal }) as { recommendation_id: string; receipt_id: string }

    expect(evaluated.recommendation_id).toMatch(/^recommendation-/)
    expect(evaluated.receipt_id).toMatch(/^receipt-/)
    view.unmount()
    delete (document as Document & { modelContext?: unknown }).modelContext
  })

  it('registers stable tools and aborts every registration on cleanup', async () => {
    const registrations: Array<{ name: ToolName; signal: AbortSignal }> = []
    const registerTool = vi.fn(async (tool: { name: ToolName }, options: { signal: AbortSignal }) => {
      registrations.push({ name: tool.name, signal: options.signal })
    })
    Object.defineProperty(document, 'modelContext', { configurable: true, value: { registerTool } })
    const services = new QcgServices(simulator, Date.now, analyzer)
    const view = render(<Harness services={services} />)
    await waitFor(() => expect(registrations.map((entry) => entry.name)).toEqual([
      'inspect_quantum_experiment',
      'evaluate_quantum_call',
      'run_bounded_local_simulation',
      'export_quantum_evidence_report'
    ]))
    view.unmount()
    expect(registrations.every((entry) => entry.signal.aborted)).toBe(true)
    delete (document as Document & { modelContext?: unknown }).modelContext
  })

  it('keeps all tool identities and controllers stable while workflow state changes', async () => {
    const registrations: Array<{ tool: RegisteredTool; signal: AbortSignal }> = []
    Object.defineProperty(document, 'modelContext', {
      configurable: true,
      value: { registerTool: vi.fn(async (tool: RegisteredTool, options: { signal: AbortSignal }) => { registrations.push({ tool, signal: options.signal }) }) }
    })
    const services = new QcgServices(simulator, Date.now, analyzer)
    const { manifest, card } = await services.loadDemoArtifact('simulate-first')
    const view = render(<SnapshotHarness services={services} state={services.snapshot()} />)
    await waitFor(() => expect(registrations.map(({ tool }) => tool.name)).toEqual([
      'inspect_quantum_experiment', 'evaluate_quantum_call',
      'run_bounded_local_simulation', 'export_quantum_evidence_report'
    ]))
    const initial = [...registrations]

    const inspected = await services.inspect({ artifact_id: manifest.artifact_id })
    const recommendation = await services.evaluate({
      manifest_id: inspected.manifest_id, target_profile_id: card.profileId, scientific_intent: card.scientificIntent,
      observable: card.observable, parameters: {}, requested_limits: card.requestedLimits
    })
    view.rerender(<SnapshotHarness services={services} state={services.snapshot()} />)
    await services.decide({ recommendation_id: recommendation.recommendation_id, choice: 'accepted', justification: 'I approve one bounded local simulation.' })
    view.rerender(<SnapshotHarness services={services} state={services.snapshot()} />)
    services.revokeConsent()
    view.rerender(<SnapshotHarness services={services} state={services.snapshot()} />)
    await waitFor(() => expect(registrations).toHaveLength(4))
    expect(initial.every(({ signal }) => !signal.aborted)).toBe(true)
    view.unmount()
    expect(initial.every(({ signal }) => signal.aborted)).toBe(true)
    delete (document as Document & { modelContext?: unknown }).modelContext
  })

  it('does not claim registration before every discovery tool finishes registering', async () => {
    let releaseSimulation: (() => void) | undefined
    const simulationRegistration = new Promise<void>((resolve) => { releaseSimulation = resolve })
    const registerTool = vi.fn(async (tool: RegisteredTool) => {
      if (tool.name === 'run_bounded_local_simulation') await simulationRegistration
    })
    Object.defineProperty(document, 'modelContext', { configurable: true, value: { registerTool } })
    const services = new QcgServices(simulator, Date.now, analyzer)
    const view = render(<SnapshotHarness services={services} state={services.snapshot()} />)
    await waitFor(() => expect(registerTool.mock.calls.map(([tool]) => tool.name)).toContain('run_bounded_local_simulation'))
    expect(screen.getByTestId('registration-status').textContent).toBe('registering')
    releaseSimulation!()
    await waitFor(() => expect(screen.getByTestId('registration-status').textContent).toBe('registered'))
    view.unmount()
    delete (document as Document & { modelContext?: unknown }).modelContext
  })

  it('adds simulation only after accepted consent and consumes it through the shared service', async () => {
    const registrations: RegisteredTool[] = []
    Object.defineProperty(document, 'modelContext', {
      configurable: true,
      value: { registerTool: vi.fn(async (tool: RegisteredTool) => { registrations.push(tool) }) }
    })
    const services = new QcgServices(simulator, Date.now, analyzer)
    await prepareConsentedSimulation(services)
    const view = render(<Harness services={services} />)
    await waitFor(() => expect(registrations.map((tool) => tool.name)).toEqual([
      'inspect_quantum_experiment',
      'evaluate_quantum_call',
      'run_bounded_local_simulation',
      'export_quantum_evidence_report'
    ]))
    const snapshot = services.snapshot()
    let result: unknown
    await act(async () => {
      result = await registrations.find((tool) => tool.name === 'run_bounded_local_simulation')!.execute(
        {
          recommendation_id: snapshot.recommendation!.recommendation_id
        },
        { signal: new AbortController().signal }
      )
    })
    expect((result as { bell_invariant: boolean }).bell_invariant).toBe(true)
    expect((result as { effects: { qpu_submissions: number } }).effects.qpu_submissions).toBe(0)
    expect(services.snapshot().consent?.used).toBe(true)
    expect(services.snapshot().invocations[0].source).toBe('webmcp')
    view.unmount()
    delete (document as Document & { modelContext?: unknown }).modelContext
  })

  it('reports registration failure instead of claiming native tools', async () => {
    Object.defineProperty(document, 'modelContext', {
      configurable: true,
      value: { registerTool: vi.fn(async () => { throw new Error('registration denied') }) }
    })
    const services = new QcgServices(simulator, Date.now, analyzer)
    await services.loadDemoArtifact('simulate-first')
    const view = render(<Harness services={services} />)
    await waitFor(() => expect(screen.getByTestId('registration-status').textContent).toBe('error'))
    view.unmount()
    delete (document as Document & { modelContext?: unknown }).modelContext
  })

  it('does not let a later successful registration hide a sibling failure', async () => {
    let releaseEvaluate: (() => void) | undefined
    const evaluatePending = new Promise<void>((resolve) => { releaseEvaluate = resolve })
    Object.defineProperty(document, 'modelContext', {
      configurable: true,
      value: {
        registerTool: vi.fn(async (tool: { name: ToolName }) => {
          if (tool.name === 'inspect_quantum_experiment') throw new Error('registration denied')
          await evaluatePending
        })
      }
    })
    const services = new QcgServices(simulator, Date.now, analyzer)
    await services.loadDemoArtifact('simulate-first')
    const view = render(<Harness services={services} />)
    await waitFor(() => expect(screen.getByTestId('registration-status').textContent).toBe('error'))
    releaseEvaluate!()
    await act(async () => { await evaluatePending })
    expect(screen.getByTestId('registration-status').textContent).toBe('error')
    view.unmount()
    delete (document as Document & { modelContext?: unknown }).modelContext
  })
})
