import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { demoCards } from './catalog'
import { readReceipts, saveReceipt } from './receiptStore'
import { QcgServices } from './services'
import { useQcgWebMcp } from './webmcp'
import type { HumanChoice, QcgState, QuantumProfileId } from './types'
import { DebugLedger } from './debugLedger'
import { installQcgDevtoolsBridge } from './devtoolsBridge'
import { registerQcgDevtoolsTools } from './devtoolsTools'
import type { QcgDebugMessage } from './debugContracts'
import { ConsoleShell, type CompanionSetupMode } from './console/ConsoleShell'
import { ConsoleInspector, ConsoleViews, defaultImportedEvaluation, type ImportedEvaluationDraft } from './console/ConsoleViews'
import { QCG_THEME_STORAGE_KEY, type ConsoleView, type QcgTheme } from './console/contracts'
import { LOCAL_PROFILE_ID } from './targetProfiles'

function initialTheme(): QcgTheme { try { return window.localStorage.getItem(QCG_THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark' } catch { return 'dark' } }
function companionSetupMode(): CompanionSetupMode { return ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname) ? 'development' : 'production' }
function download(name: string, content: string, type: string): void { const url = URL.createObjectURL(new Blob([content], { type })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click(); URL.revokeObjectURL(url) }
function boundedOperationError(action: string, error: unknown): string {
  const message = error instanceof Error ? error.message.replace(/[\r\n\t]+/g, ' ').trim() : ''
  const publicMessage = /^(The quantum artifact|The selected [a-z0-9-]+ profile|A supported quantum profile|artifact_id|manifest_id|The artifact source|The selected demonstration artifact)/i.test(message)
    ? message.slice(0, 220)
    : 'The bounded operation could not be completed with the current inputs.'
  return `${action}: ${publicMessage}`
}

export default function App({ serviceOverride }: { serviceOverride?: QcgServices } = {}) {
  const services = useMemo(() => serviceOverride ?? new QcgServices(), [serviceOverride])
  const debugLedger = useMemo(() => new DebugLedger(), [])
  const [state, setState] = useState<QcgState>(services.snapshot())
  const [selected, setSelected] = useState(demoCards[3].id)
  const [artifactProfileId, setArtifactProfileId] = useState<QuantumProfileId>('qsharp-qdk')
  const [importedEvaluation, setImportedEvaluation] = useState<ImportedEvaluationDraft>(defaultImportedEvaluation)
  const [inspectedManifestId, setInspectedManifestId] = useState<string>()
  const [operationError, setOperationError] = useState<string>()
  const [operationAnnouncement, setOperationAnnouncement] = useState('')
  const [view, setView] = useState<ConsoleView>('inspector')
  const [theme, setTheme] = useState<QcgTheme>(initialTheme)
  const [busy, setBusy] = useState(false)
  const [storedReceipts, setStoredReceipts] = useState(0)
  const [debugSessionId] = useState(() => crypto.randomUUID())
  const [debugMessages, setDebugMessages] = useState<QcgDebugMessage[]>([])
  const [debugReady, setDebugReady] = useState(false)
  const [companionStatus, setCompanionStatus] = useState('Companion not requested')
  const [companionOpen, setCompanionOpen] = useState(false)
  const [companionSetupOpen, setCompanionSetupOpen] = useState(false)
  const [companionTriggerId, setCompanionTriggerId] = useState(() => crypto.randomUUID())
  const [actorFilter, setActorFilter] = useState('all')
  const [kindFilter, setKindFilter] = useState('all')
  const simulationController = useRef<AbortController | null>(null)
  const fixtureLoaded = useRef(false)
  const companionRequestRef = useRef<string | null>(null)
  const companionTimerRef = useRef<number | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state
  const refresh = useCallback(() => setState(services.snapshot()), [services])
  const { supported, toolNames, registrationStatus } = useQcgWebMcp(services, state, refresh)
  const toolNamesRef = useRef(toolNames)
  toolNamesRef.current = toolNames

  useEffect(() => () => simulationController.current?.abort(), [])
  useEffect(() => { try { window.localStorage.setItem(QCG_THEME_STORAGE_KEY, theme) } catch { /* optional browser storage */ } }, [theme])
  useEffect(() => { void debugLedger.openSession(debugSessionId).then(() => setDebugReady(true)).catch(() => setDebugReady(false)) }, [debugLedger, debugSessionId])
  useEffect(() => {
    if (!debugReady) return
    const removeBridge = installQcgDevtoolsBridge(() => stateRef.current, debugLedger, debugSessionId, { executeHumanDecision: async (input) => { await services.decide(input); refresh() }, getConsoleContext: () => ({ toolNames: toolNamesRef.current }) })
    const unregister = window.__QCG_DEVTOOLS_V1__ ? registerQcgDevtoolsTools(window.__QCG_DEVTOOLS_V1__, debugLedger) : () => undefined
    return () => { unregister(); removeBridge() }
  }, [debugLedger, debugReady, debugSessionId, refresh, services])
  const refreshDebug = useCallback(() => { void debugLedger.messages(debugSessionId).then(setDebugMessages).catch(() => setDebugMessages([])) }, [debugLedger, debugSessionId])
  useEffect(() => { if (debugReady) refreshDebug() }, [debugReady, refreshDebug])
  useEffect(() => debugLedger.subscribe(refreshDebug), [debugLedger, refreshDebug])
  useEffect(() => { const fixture = new URLSearchParams(window.location.search).get('eval_fixture'); if (!fixture || fixtureLoaded.current) return; fixtureLoaded.current = true; void services.loadDemoArtifact(fixture).then(({ card }) => { setSelected(card.id); setInspectedManifestId(undefined); setOperationError(undefined); refresh() }).catch((error) => { setOperationError(boundedOperationError('Demo load failed', error)); refresh() }) }, [refresh, services])
  useEffect(() => { void readReceipts().then((items) => setStoredReceipts(items.length)).catch(() => setStoredReceipts(0)) }, [])
  useEffect(() => { if (state.receipt) void saveReceipt(state.receipt).then(readReceipts).then((items) => setStoredReceipts(items.length)).catch(() => undefined) }, [state.receipt?.digest])
  useEffect(() => { if (!state.consent || state.consent.used) return; const wait = new Date(state.consent.expires_at).getTime() - Date.now(); if (wait <= 0) { refresh(); return }; const timer = window.setTimeout(refresh, wait + 20); return () => window.clearTimeout(timer) }, [refresh, state.consent?.consent_id, state.consent?.expires_at, state.consent?.used])
  useEffect(() => {
    const receive = (event: MessageEvent<unknown>) => {
      if (event.origin !== window.location.origin || !event.data || typeof event.data !== 'object') return
      const data = event.data as { channel?: unknown; type?: unknown; request_id?: unknown; status?: unknown; reason?: unknown }
      if (data.channel !== 'qcg-console-extension-control.v1') return
      if (data.type === 'companion_state') {
        if (data.status === 'side_panel') { setCompanionOpen(true); setCompanionStatus('Companion side panel opened') }
        if (data.status === 'side_panel_closed') { setCompanionOpen(false); setCompanionStatus('Companion side panel closed') }
        return
      }
      if (data.type !== 'open_companion_result' || data.request_id !== companionRequestRef.current) return
      if (companionTimerRef.current !== null) window.clearTimeout(companionTimerRef.current)
      companionTimerRef.current = null
      if (data.status === 'side_panel') { setCompanionOpen(true); setCompanionStatus('Companion side panel opened'); setCompanionSetupOpen(false) }
      else if (data.status === 'side_panel_closed') { setCompanionOpen(false); setCompanionStatus('Companion side panel closed'); setCompanionSetupOpen(false) }
      else if (data.status === 'companion_tab') { setCompanionStatus('Companion tab opened · side panel declined'); setCompanionSetupOpen(false) }
      else if (data.reason === 'extension_transport_failed') { setCompanionStatus('QCG Companion needs a reload'); setCompanionSetupOpen(true) }
      else { setCompanionStatus('Browser declined Companion opening'); setCompanionSetupOpen(true) }
      companionRequestRef.current = null
    }
    window.addEventListener('message', receive)
    return () => {
      window.removeEventListener('message', receive)
      if (companionTimerRef.current !== null) window.clearTimeout(companionTimerRef.current)
    }
  }, [])

  async function runDemo(): Promise<void> {
    setBusy(true); setOperationError(undefined); setInspectedManifestId(undefined)
    try {
      const { manifest, card } = await services.loadDemoArtifact(selected)
      const inspected = await services.inspect({ artifact_id: manifest.artifact_id })
      await services.evaluate({ manifest_id: inspected.manifest_id, target_profile_id: card.profileId, scientific_intent: card.scientificIntent, observable: card.observable, parameters: {}, requested_limits: card.requestedLimits })
      setView('decisions')
      setOperationAnnouncement('Demo preflight completed. Review the visible recommendation.')
    } catch (error) {
      setOperationError(boundedOperationError('Demo preflight failed', error)); setView('activity')
    } finally { refresh(); setBusy(false) }
  }
  async function importArtifact(file: File): Promise<void> {
    setBusy(true); setOperationError(undefined); setInspectedManifestId(undefined)
    try {
      const manifest = await services.importQuantumFile(file.name, new Uint8Array(await file.arrayBuffer()), artifactProfileId)
      setImportedEvaluation((current) => ({ ...current, maxQubits: Math.min(8, Math.max(1, manifest.compiler.estimated_qubits ?? current.maxQubits)) }))
      setView('inspector')
      setOperationAnnouncement('Artifact imported. Inspect it before evaluation.')
    } catch (error) {
      setOperationError(boundedOperationError('Import failed', error)); setView('inspector')
    } finally { refresh(); setBusy(false) }
  }
  async function inspectImported(): Promise<void> {
    const manifest = services.snapshot().manifest
    if (!manifest || manifest.provenance !== 'human_import') { setOperationError('Inspection requires the active human-imported artifact.'); setView('inspector'); return }
    setBusy(true); setOperationError(undefined)
    try {
      const inspected = await services.inspect({ artifact_id: manifest.artifact_id })
      setInspectedManifestId(inspected.manifest_id)
      setView('inspector')
      setOperationAnnouncement('Artifact inspection completed.')
    } catch (error) {
      setInspectedManifestId(undefined); setOperationError(boundedOperationError('Inspection failed', error)); setView('inspector')
    } finally { refresh(); setBusy(false) }
  }
  async function evaluateImported(): Promise<void> {
    const manifest = services.snapshot().manifest
    if (!manifest || manifest.provenance !== 'human_import') { setOperationError('Evaluation requires the active human-imported artifact.'); setView('inspector'); return }
    if (inspectedManifestId !== manifest.manifest_id) { setOperationError('Evaluate current import: inspect this manifest first.'); setView('inspector'); return }
    const limitsAreValid = Number.isInteger(importedEvaluation.shots) && importedEvaluation.shots >= 1 && importedEvaluation.shots <= 256 &&
      Number.isInteger(importedEvaluation.timeoutMs) && importedEvaluation.timeoutMs >= 500 && importedEvaluation.timeoutMs <= 15_000 &&
      Number.isInteger(importedEvaluation.maxQubits) && importedEvaluation.maxQubits >= 1 && importedEvaluation.maxQubits <= 8
    if (!limitsAreValid || importedEvaluation.scientificIntent.trim().length < 12 || importedEvaluation.observable.trim().length < 3) {
      setOperationError('Evaluate current import: complete the bounded intent, observable and numeric limits.'); setView('inspector'); return
    }
    setBusy(true); setOperationError(undefined)
    try {
      await services.evaluate({
        manifest_id: manifest.manifest_id,
        target_profile_id: importedEvaluation.targetProfileId,
        scientific_intent: importedEvaluation.scientificIntent,
        observable: importedEvaluation.observable,
        parameters: {},
        requested_limits: {
          shots: importedEvaluation.shots,
          timeout_ms: importedEvaluation.timeoutMs,
          max_qubits: importedEvaluation.maxQubits,
          target: importedEvaluation.targetProfileId === LOCAL_PROFILE_ID ? 'local_simulator' : 'external_reference',
        },
      })
      setView('decisions')
      setOperationAnnouncement('Evaluation completed. Review the visible recommendation.')
    } catch (error) {
      setOperationError(boundedOperationError('Evaluation failed', error)); setView('inspector')
    } finally { refresh(); setBusy(false) }
  }
  async function recordDecision(choice: HumanChoice, justification: string): Promise<void> { if (!state.recommendation) return; setBusy(true); try { await services.decide({ recommendation_id: state.recommendation.recommendation_id, choice, justification }); setView('receipts'); setOperationAnnouncement(`Human decision recorded: ${choice}.`) } catch { setView('decisions') } finally { refresh(); setBusy(false) } }
  async function runSimulation(): Promise<void> { if (!state.recommendation || !state.consent) return; setBusy(true); const controller = new AbortController(); simulationController.current = controller; try { await services.simulate({ recommendation_id: state.recommendation.recommendation_id }, controller.signal); setView('receipts'); setOperationAnnouncement('Bounded local simulation completed.') } catch { setView('activity') } finally { simulationController.current = null; refresh(); setBusy(false) } }
  function revokeConsent(): void { services.revokeConsent(); setOperationAnnouncement('One-time local simulation consent revoked.'); refresh() }
  function humanMessage(summary: string): void { void window.__QCG_DEVTOOLS_V1__?.appendHumanMessage({ summary }).then(refreshDebug).catch(() => undefined) }
  async function exportEvidence(format: 'json' | 'markdown'): Promise<void> { if (!state.receipt) return; setBusy(true); try { const result = await services.exportPacket({ receipt_id: state.receipt.receipt_id, format }); download(`webmcp-qcg-evidence.${format === 'json' ? 'json' : 'md'}`, result.content, format === 'json' ? 'application/json' : 'text/markdown'); setOperationAnnouncement(`Evidence ${format.toUpperCase()} export prepared.`) } finally { refresh(); setBusy(false) } }
  function openCompanion(): void {
    const requestId = companionTriggerId
    companionRequestRef.current = requestId
    setCompanionTriggerId(crypto.randomUUID())
    if (companionTimerRef.current !== null) window.clearTimeout(companionTimerRef.current)
    setCompanionSetupOpen(false)
    setCompanionStatus('Requesting companion…')
    companionTimerRef.current = window.setTimeout(() => {
      if (companionRequestRef.current !== requestId) return
      companionRequestRef.current = null
      companionTimerRef.current = null
      setCompanionStatus('QCG Companion extension not connected · load or reload it')
      setCompanionSetupOpen(true)
    }, 4000)
  }
  async function requestHandoff(intent: 'debug' | 'search' | 'find' | 'brainstorm' | 'decision'): Promise<string> {
    const result = await (window.__QCG_CONSOLE_V2__?.executeConsoleCommand({ schema_version: 'qcg-console-command.v1', session_id: debugSessionId, kind: 'gemini_manual_handoff_create', intent, prompt: `Prepare a bounded ${intent} handoff from the current QCG evidence.` }) ?? Promise.resolve({ message: 'The bounded bridge is not ready.' }))
    return result.message
  }

  return <ConsoleShell theme={theme} onThemeChange={setTheme} view={view} onViewChange={setView} supported={supported} toolCount={toolNames.length} registrationStatus={registrationStatus} sessionId={debugSessionId} companionStatus={companionStatus} companionOpen={companionOpen} companionTriggerId={companionTriggerId} companionSetupMode={companionSetupMode()} companionSetupOpen={companionSetupOpen} onOpenCompanion={openCompanion} onCloseCompanionSetup={() => setCompanionSetupOpen(false)} inspector={(navigate) => <ConsoleInspector state={state} debugMessages={debugMessages} sessionId={debugSessionId} onViewChange={navigate} />}>
    <ConsoleViews view={view} state={state} selected={selected} select={setSelected} artifactProfileId={artifactProfileId} setArtifactProfileId={setArtifactProfileId} busy={busy} runDemo={() => void runDemo()} importArtifact={(file) => void importArtifact(file)} inspectImported={() => void inspectImported()} importedEvaluation={importedEvaluation} updateImportedEvaluation={(patch) => setImportedEvaluation((current) => ({ ...current, ...patch }))} evaluateImported={() => void evaluateImported()} importedInspectionReady={Boolean(state.manifest?.provenance === 'human_import' && inspectedManifestId === state.manifest.manifest_id)} operationError={operationError} operationAnnouncement={operationAnnouncement} setView={setView} recordDecision={(choice, justification) => void recordDecision(choice, justification)} runSimulation={() => void runSimulation()} revokeConsent={revokeConsent} exportEvidence={(format) => void exportEvidence(format)} toolNames={toolNames} registrationStatus={registrationStatus} supported={supported} debugReady={debugReady} debugMessages={debugMessages} humanMessage={humanMessage} storedReceipts={storedReceipts} actorFilter={actorFilter} kindFilter={kindFilter} setFilters={(actor, kind) => { setActorFilter(actor); setKindFilter(kind) }} requestHandoff={requestHandoff} />
  </ConsoleShell>
}
