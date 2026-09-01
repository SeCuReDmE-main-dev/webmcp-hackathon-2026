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
import { ConsoleShell } from './console/ConsoleShell'
import { ConsoleInspector, ConsoleViews } from './console/ConsoleViews'
import { QCG_THEME_STORAGE_KEY, sanitizedConsoleSnapshot, type ConsoleView, type QcgTheme } from './console/contracts'
import { createWebConsoleTransport } from './console/webTransport'

function initialTheme(): QcgTheme { try { return window.localStorage.getItem(QCG_THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark' } catch { return 'dark' } }
function download(name: string, content: string, type: string): void { const url = URL.createObjectURL(new Blob([content], { type })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click(); URL.revokeObjectURL(url) }

export default function App() {
  const services = useMemo(() => new QcgServices(), [])
  const debugLedger = useMemo(() => new DebugLedger(), [])
  const [state, setState] = useState<QcgState>(services.snapshot())
  const [selected, setSelected] = useState(demoCards[3].id)
  const [artifactProfileId, setArtifactProfileId] = useState<QuantumProfileId>('qsharp-qdk')
  const [view, setView] = useState<ConsoleView>('inspector')
  const [theme, setTheme] = useState<QcgTheme>(initialTheme)
  const [busy, setBusy] = useState(false)
  const [storedReceipts, setStoredReceipts] = useState(0)
  const [debugSessionId] = useState(() => crypto.randomUUID())
  const [debugMessages, setDebugMessages] = useState<QcgDebugMessage[]>([])
  const [debugReady, setDebugReady] = useState(false)
  const [companionStatus, setCompanionStatus] = useState('Companion not requested')
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
  useEffect(() => { const fixture = new URLSearchParams(window.location.search).get('eval_fixture'); if (!fixture || fixtureLoaded.current) return; fixtureLoaded.current = true; void services.loadDemoArtifact(fixture).then(({ card }) => { setSelected(card.id); refresh() }).catch(refresh) }, [refresh, services])
  useEffect(() => { void readReceipts().then((items) => setStoredReceipts(items.length)).catch(() => setStoredReceipts(0)) }, [])
  useEffect(() => { if (state.receipt) void saveReceipt(state.receipt).then(readReceipts).then((items) => setStoredReceipts(items.length)).catch(() => undefined) }, [state.receipt?.digest])
  useEffect(() => { if (!state.consent || state.consent.used) return; const wait = new Date(state.consent.expires_at).getTime() - Date.now(); if (wait <= 0) { refresh(); return }; const timer = window.setTimeout(refresh, wait + 20); return () => window.clearTimeout(timer) }, [refresh, state.consent?.consent_id, state.consent?.expires_at, state.consent?.used])
  useEffect(() => {
    const receive = (event: MessageEvent<unknown>) => {
      if (event.origin !== window.location.origin || !event.data || typeof event.data !== 'object') return
      const data = event.data as { channel?: unknown; type?: unknown; request_id?: unknown; status?: unknown; reason?: unknown }
      if (data.channel !== 'qcg-console-extension-control.v1' || data.type !== 'open_companion_result' || data.request_id !== companionRequestRef.current) return
      if (companionTimerRef.current !== null) window.clearTimeout(companionTimerRef.current)
      companionTimerRef.current = null
      if (data.status === 'side_panel') setCompanionStatus('Companion side panel opened')
      else if (data.status === 'companion_tab') setCompanionStatus('Companion tab opened · side panel declined')
      else if (data.reason === 'extension_transport_failed') setCompanionStatus('QCG Companion needs a reload')
      else setCompanionStatus('Browser declined Companion opening')
      companionRequestRef.current = null
    }
    window.addEventListener('message', receive)
    return () => {
      window.removeEventListener('message', receive)
      if (companionTimerRef.current !== null) window.clearTimeout(companionTimerRef.current)
    }
  }, [])

  async function runDemo(): Promise<void> { setBusy(true); try { const { manifest, card } = await services.loadDemoArtifact(selected); const inspected = await services.inspect({ artifact_id: manifest.artifact_id }); await services.evaluate({ manifest_id: inspected.manifest_id, target_profile_id: card.profileId, scientific_intent: card.scientificIntent, observable: card.observable, parameters: {}, requested_limits: card.requestedLimits }); setView('decisions') } catch { setView('activity') } finally { refresh(); setBusy(false) } }
  async function importArtifact(file: File): Promise<void> { setBusy(true); try { await services.importQuantumFile(file.name, new Uint8Array(await file.arrayBuffer()), artifactProfileId); setView('inspector') } catch { setView('activity') } finally { refresh(); setBusy(false) } }
  async function inspectImported(): Promise<void> { if (!state.manifest) return; setBusy(true); try { await services.inspect({ artifact_id: state.manifest.artifact_id }); setView('decisions') } catch { setView('activity') } finally { refresh(); setBusy(false) } }
  async function recordDecision(choice: HumanChoice, justification: string): Promise<void> { if (!state.recommendation) return; setBusy(true); try { await services.decide({ recommendation_id: state.recommendation.recommendation_id, choice, justification }); setView('receipts') } catch { setView('decisions') } finally { refresh(); setBusy(false) } }
  async function runSimulation(): Promise<void> { if (!state.recommendation || !state.consent) return; setBusy(true); const controller = new AbortController(); simulationController.current = controller; try { await services.simulate({ recommendation_id: state.recommendation.recommendation_id }, controller.signal); setView('receipts') } catch { setView('activity') } finally { simulationController.current = null; refresh(); setBusy(false) } }
  function revokeConsent(): void { services.revokeConsent(); refresh() }
  function humanMessage(summary: string): void { void window.__QCG_DEVTOOLS_V1__?.appendHumanMessage({ summary }).then(refreshDebug).catch(() => undefined) }
  async function exportEvidence(format: 'json' | 'markdown'): Promise<void> { if (!state.receipt) return; setBusy(true); try { const result = await services.exportPacket({ receipt_id: state.receipt.receipt_id, format }); download(`webmcp-qcg-evidence.${format === 'json' ? 'json' : 'md'}`, result.content, format === 'json' ? 'application/json' : 'text/markdown') } finally { refresh(); setBusy(false) } }
  function openCompanion(): void {
    const requestId = companionTriggerId
    companionRequestRef.current = requestId
    setCompanionTriggerId(crypto.randomUUID())
    if (companionTimerRef.current !== null) window.clearTimeout(companionTimerRef.current)
    setCompanionStatus('Requesting companion…')
    companionTimerRef.current = window.setTimeout(() => {
      if (companionRequestRef.current !== requestId) return
      companionRequestRef.current = null
      companionTimerRef.current = null
      setCompanionStatus('QCG Companion extension not connected · load or reload it')
    }, 4000)
  }
  async function requestHandoff(intent: 'debug' | 'search' | 'find' | 'brainstorm' | 'decision'): Promise<string> {
    const result = await (window.__QCG_CONSOLE_V2__?.executeConsoleCommand({ schema_version: 'qcg-console-command.v1', session_id: debugSessionId, kind: 'gemini_manual_handoff_create', intent, prompt: `Prepare a bounded ${intent} handoff from the current QCG evidence.` }) ?? Promise.resolve({ message: 'The bounded bridge is not ready.' }))
    return result.message
  }

  const webTransport = useMemo(() => createWebConsoleTransport(() => sanitizedConsoleSnapshot(stateRef.current, debugSessionId, debugLedger.storageMode, 'web', { toolNames, invocations: stateRef.current.invocations }), (command) => window.__QCG_CONSOLE_V2__?.executeConsoleCommand(command) ?? Promise.resolve({ schema_version: 'qcg-console-command-result.v1', accepted: false, status: 'rejected', message: 'The bounded bridge is not ready.' })), [debugLedger.storageMode, debugSessionId, toolNames])
  void webTransport
  return <ConsoleShell theme={theme} onThemeChange={setTheme} view={view} onViewChange={setView} supported={supported} toolCount={toolNames.length} registrationStatus={registrationStatus} sessionId={debugSessionId} companionStatus={companionStatus} companionTriggerId={companionTriggerId} onOpenCompanion={openCompanion} inspector={(navigate) => <ConsoleInspector state={state} debugMessages={debugMessages} sessionId={debugSessionId} onViewChange={navigate} />}>
    <ConsoleViews view={view} state={state} selected={selected} select={setSelected} artifactProfileId={artifactProfileId} setArtifactProfileId={setArtifactProfileId} busy={busy} runDemo={() => void runDemo()} importArtifact={(file) => void importArtifact(file)} inspectImported={() => void inspectImported()} setView={setView} recordDecision={(choice, justification) => void recordDecision(choice, justification)} runSimulation={() => void runSimulation()} revokeConsent={revokeConsent} exportEvidence={(format) => void exportEvidence(format)} toolNames={toolNames} registrationStatus={registrationStatus} supported={supported} debugReady={debugReady} debugMessages={debugMessages} humanMessage={humanMessage} storedReceipts={storedReceipts} actorFilter={actorFilter} kindFilter={kindFilter} setFilters={(actor, kind) => { setActorFilter(actor); setKindFilter(kind) }} requestHandoff={requestHandoff} />
  </ConsoleShell>
}
