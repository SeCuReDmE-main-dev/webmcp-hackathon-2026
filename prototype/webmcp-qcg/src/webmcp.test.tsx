import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import { QcgServices } from './services'
import { useQcgWebMcp } from './webmcp'
import type { QcgState, ToolName } from './types'

function Harness({ services }: { services: QcgServices }) {
  const [state, setState] = useState<QcgState>(services.snapshot())
  const { registrationStatus } = useQcgWebMcp(services, state, () => setState(services.snapshot()))
  return <output data-testid="registration-status">{registrationStatus}</output>
}

interface RegisteredTool {
  name: ToolName
  execute: (input: object, options: { signal: AbortSignal }) => Promise<unknown>
}

describe('WebMCP lifecycle', () => {
  it('registers stable tools and aborts registrations on cleanup without duplicates', async () => {
    const registrations: Array<{ name: ToolName; signal: AbortSignal }> = []
    const registerTool = vi.fn(async (tool: { name: ToolName }, options: { signal: AbortSignal }) => { registrations.push({ name: tool.name, signal: options.signal }) })
    Object.defineProperty(document, 'modelContext', { configurable: true, value: { registerTool } })
    const services = new QcgServices({ run: async (_signal, limits) => ({ bellInvariant: true, shotsRequested: limits.shots, shotsReturned: limits.shots, outcomeCounts: { '[Zero, Zero]': limits.shots } }) })
    const view = render(<Harness services={services} />)
    await waitFor(() => expect(registrations.map((entry) => entry.name)).toEqual(['inspect_quantum_experiment', 'evaluate_quantum_call']))
    view.unmount()
    expect(registrations.every((entry) => entry.signal.aborted)).toBe(true)
    delete (document as Document & { modelContext?: unknown }).modelContext
  })

  it('adds simulation only for a consented simulate_first state and exports when a packet exists', async () => {
    const registrations: RegisteredTool[] = []
    Object.defineProperty(document, 'modelContext', { configurable: true, value: { registerTool: vi.fn(async (tool: RegisteredTool) => { registrations.push(tool) }) } })
    const services = new QcgServices({ run: async (_signal, limits) => ({ bellInvariant: true, shotsRequested: limits.shots, shotsReturned: limits.shots, outcomeCounts: { '[Zero, Zero]': limits.shots } }) })
    const inspection = await services.inspect({ artifact_id: 'simulate-first' })
    await services.evaluate({ inspection_id: inspection.inspection_id, scientific_intent: 'Verify the bounded Bell correlation locally.', requested_limits: { shots: 16, timeout_ms: 2000, max_qubits: 2, target: 'local_simulator' } })
    services.grantConsent()
    const view = render(<Harness services={services} />)
    await waitFor(() => expect(registrations.map((tool) => tool.name)).toEqual([
      'inspect_quantum_experiment', 'evaluate_quantum_call', 'run_bounded_qsharp_simulation', 'export_quantum_evidence_report'
    ]))
    const result = await registrations.find((tool) => tool.name === 'run_bounded_qsharp_simulation')!.execute(
      { decision_id: services.snapshot().evaluation!.decision_id },
      { signal: new AbortController().signal }
    ) as { bell_invariant: boolean; counters: { external_provider_calls: number } }
    expect(result.bell_invariant).toBe(true)
    expect(result.counters.external_provider_calls).toBe(0)
    expect(services.snapshot().invocations[0].source).toBe('webmcp')
    view.unmount()
    delete (document as Document & { modelContext?: unknown }).modelContext
  })

  it('reports a registration failure instead of claiming native tools', async () => {
    Object.defineProperty(document, 'modelContext', { configurable: true, value: { registerTool: vi.fn(async () => { throw new Error('registration denied') }) } })
    const services = new QcgServices({ run: async (_signal, limits) => ({ bellInvariant: true, shotsRequested: limits.shots, shotsReturned: limits.shots, outcomeCounts: {} }) })
    const view = render(<Harness services={services} />)
    await waitFor(() => expect(screen.getByTestId('registration-status').textContent).toBe('error'))
    view.unmount()
    delete (document as Document & { modelContext?: unknown }).modelContext
  })
})
