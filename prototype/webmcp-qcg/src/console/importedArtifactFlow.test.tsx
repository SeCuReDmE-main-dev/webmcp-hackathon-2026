import { useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { bellProgram } from '../catalog'
import { QcgServices, type ArtifactAnalyzer, type Simulator } from '../services'
import { LOCAL_PROFILE_ID } from '../targetProfiles'
import type { QcgState, QuantumProfileId } from '../types'
import { ConsoleShell } from './ConsoleShell'
import { ConsoleViews, defaultImportedEvaluation, type ImportedEvaluationDraft } from './ConsoleViews'
import type { ConsoleView } from './contracts'
import { initialState } from '../types'

class ValidAnalyzer implements ArtifactAnalyzer {
  async analyze() {
    return { valid: true, diagnosticCount: 0, diagnostics: [] }
  }
}

class UnusedSimulator implements Simulator {
  async run(_signal: AbortSignal, limits: { shots: number }) {
    return {
      bellInvariant: true,
      shotsRequested: limits.shots,
      shotsReturned: limits.shots,
      outcomeCounts: { '[Zero, Zero]': limits.shots },
    }
  }
}

function ImportedArtifactHarness({ services }: { services: QcgServices }) {
  const [state, setState] = useState<QcgState>(services.snapshot())
  const [view, setView] = useState<ConsoleView>('inspector')
  const [profile, setProfile] = useState<QuantumProfileId>('qsharp-qdk')
  const [draft, setDraft] = useState<ImportedEvaluationDraft>(defaultImportedEvaluation)
  const [inspectedManifestId, setInspectedManifestId] = useState<string>()
  const [busy, setBusy] = useState(false)
  const refresh = () => setState(services.snapshot())

  async function importArtifact(file: File) {
    setBusy(true)
    await services.importQuantumFile(file.name, new Uint8Array(await file.arrayBuffer()), profile)
    setInspectedManifestId(undefined)
    refresh(); setBusy(false)
  }
  async function inspectImported() {
    setBusy(true)
    const manifest = services.snapshot().manifest!
    const inspected = await services.inspect({ artifact_id: manifest.artifact_id })
    setInspectedManifestId(inspected.manifest_id)
    refresh(); setBusy(false)
  }
  async function evaluateImported() {
    setBusy(true)
    const manifest = services.snapshot().manifest!
    await services.evaluate({
      manifest_id: manifest.manifest_id,
      target_profile_id: draft.targetProfileId,
      scientific_intent: draft.scientificIntent,
      observable: draft.observable,
      parameters: {},
      requested_limits: {
        shots: draft.shots,
        timeout_ms: draft.timeoutMs,
        max_qubits: draft.maxQubits,
        target: draft.targetProfileId === LOCAL_PROFILE_ID ? 'local_simulator' : 'external_reference',
      },
    })
    refresh(); setView('decisions'); setBusy(false)
  }

  return <ConsoleShell theme="dark" onThemeChange={() => undefined} view={view} onViewChange={setView} supported={false} toolCount={0} registrationStatus="unsupported" sessionId="test-session" companionStatus="not connected" companionTriggerId="test-trigger" onOpenCompanion={() => undefined} inspector={() => null}>
    <ConsoleViews
      view={view} state={state} selected="simulate-first" select={() => undefined} artifactProfileId={profile} setArtifactProfileId={setProfile} busy={busy}
      runDemo={() => { throw new Error('Console evaluate must not run a demonstration card.') }} importArtifact={(file) => { void importArtifact(file) }} inspectImported={() => { void inspectImported() }}
      importedEvaluation={draft} updateImportedEvaluation={(patch) => setDraft((current) => ({ ...current, ...patch }))} evaluateImported={() => { void evaluateImported() }} importedInspectionReady={state.manifest?.manifest_id === inspectedManifestId}
      setView={setView} recordDecision={() => undefined} runSimulation={() => undefined} revokeConsent={() => undefined} exportEvidence={() => undefined}
      toolNames={[]} registrationStatus="unsupported" supported={false} debugReady={false} debugMessages={[]} humanMessage={() => undefined} storedReceipts={0}
      actorFilter="all" kindFilter="all" setFilters={() => undefined} requestHandoff={async () => 'not used'}
    />
  </ConsoleShell>
}

describe('human imported-artifact flow', () => {
  it('announces completed operations politely and operation errors as assertive alerts', () => {
    render(<ConsoleViews
      view="inspector" state={initialState()} selected="simulate-first" select={() => undefined} artifactProfileId="qsharp-qdk" setArtifactProfileId={() => undefined} busy={false}
      runDemo={() => undefined} importArtifact={() => undefined} inspectImported={() => undefined} importedEvaluation={defaultImportedEvaluation} updateImportedEvaluation={() => undefined} evaluateImported={() => undefined} importedInspectionReady={false}
      operationAnnouncement="Artifact inspection completed." operationError="Import failed: bounded input required." setView={() => undefined} recordDecision={() => undefined} runSimulation={() => undefined} revokeConsent={() => undefined} exportEvidence={() => undefined}
      toolNames={[]} registrationStatus="unavailable" supported={false} debugReady={false} debugMessages={[]} humanMessage={() => undefined} storedReceipts={0} actorFilter="all" kindFilter="all" setFilters={() => undefined} requestHandoff={async () => 'not used'}
    />)
    expect(screen.getByText('Artifact inspection completed.').getAttribute('aria-live')).toBe('polite')
    const error = screen.getByRole('alert')
    expect(error.getAttribute('aria-live')).toBe('assertive')
    expect(error.textContent).toContain('Import failed')
  })

  it('imports, inspects and evaluates the active manifest without replacing it with a demo', async () => {
    const user = userEvent.setup()
    const services = new QcgServices(
      new UnusedSimulator(),
      () => Date.parse('2026-09-02T12:00:00.000Z'),
      new ValidAnalyzer(),
    )
    render(<ImportedArtifactHarness services={services} />)

    const file = new File([bellProgram], 'human-bell.qs', { type: 'text/plain' })
    if (!file.arrayBuffer) Object.defineProperty(file, 'arrayBuffer', { value: async () => new TextEncoder().encode(bellProgram).buffer })
    await user.upload(screen.getByLabelText('Quantum artifact file'), file)

    expect(await screen.findByText('human-bell.qs')).toBeTruthy()
    expect((screen.getByRole('button', { name: 'Inspect import first' }) as HTMLButtonElement).disabled).toBe(true)

    await user.click(screen.getByRole('button', { name: 'Inspect import' }))
    const evaluate = await screen.findByRole('button', { name: 'Evaluate current import' })
    await waitFor(() => expect((evaluate as HTMLButtonElement).disabled).toBe(false))
    await user.click(evaluate)

    expect(await screen.findByRole('heading', { name: 'Decisions' })).toBeTruthy()
    await waitFor(() => expect(services.snapshot().recommendation?.decision).toBe('simulate_first'))
    const afterForm = services.snapshot()
    expect(afterForm.manifest).toMatchObject({ file_name: 'human-bell.qs', provenance: 'human_import' })
    expect(afterForm.recommendation?.manifest_id).toBe(afterForm.manifest?.manifest_id)
    expect(afterForm.recommendation?.requested_limits.target).toBe('local_simulator')

    await user.click(screen.getAllByRole('button', { name: 'Console' })[0])
    await user.type(screen.getByLabelText('Command'), 'evaluate')
    await user.click(screen.getByRole('button', { name: 'Run bounded command' }))

    await waitFor(() => expect(services.snapshot().effects.evaluations).toBe(2))
    expect(services.snapshot().manifest).toMatchObject({ file_name: 'human-bell.qs', provenance: 'human_import' })
  })
})
