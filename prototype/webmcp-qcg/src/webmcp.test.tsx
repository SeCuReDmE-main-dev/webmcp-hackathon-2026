import { act, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useCallback, useState } from 'react'
import { QcgServices, type ArtifactAnalyzer, type Simulator } from './services'
import { useQcgWebMcp } from './webmcp'
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

interface RegisteredTool {
  name: ToolName
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
  it('keeps artifact tools undiscoverable until a human loads Q#', async () => {
    const registerTool = vi.fn(async () => undefined)
    Object.defineProperty(document, 'modelContext', { configurable: true, value: { registerTool } })
    const services = new QcgServices(simulator, Date.now, analyzer)
    const view = render(<Harness services={services} />)
    await waitFor(() => expect(screen.getByTestId('registration-status').textContent).toBe('registered'))
    expect(registerTool).not.toHaveBeenCalled()
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
    await services.loadDemoArtifact('simulate-first')
    const view = render(<Harness services={services} />)
    await waitFor(() => expect(registrations.map((entry) => entry.name)).toEqual([
      'inspect_quantum_experiment',
      'evaluate_quantum_call'
    ]))
    view.unmount()
    expect(registrations.every((entry) => entry.signal.aborted)).toBe(true)
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
})
