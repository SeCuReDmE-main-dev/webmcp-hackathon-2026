import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { bellProgram, demoCards } from './catalog'
import { saveReceipt, readReceipts } from './receiptStore'
import { QcgServices } from './services'
import { EXTERNAL_PROFILE_ID, LOCAL_PROFILE_ID } from './targetProfiles'
import { useQcgWebMcp } from './webmcp'
import type { HumanChoice, QcgState } from './types'
import { DebugLedger } from './debugLedger'
import { installQcgDevtoolsBridge } from './devtoolsBridge'
import { registerQcgDevtoolsTools } from './devtoolsTools'
import type { QcgDebugMessage } from './debugContracts'
import { qcgSeasons, readWindowQcgSeason, saveWindowQcgSeason, type QcgSeason } from './season'

const tabs = ['Experiment', 'Agent Review', 'Human Decision', 'Evidence Receipt', 'Activity'] as const
type Tab = (typeof tabs)[number]

function download(name: string, content: string, type: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = name
  anchor.click()
  URL.revokeObjectURL(url)
}

function shortHash(value?: string): string {
  return value ? `${value.slice(0, 12)}…${value.slice(-8)}` : '—'
}

export default function App() {
  const services = useMemo(() => new QcgServices(), [])
  const debugLedger = useMemo(() => new DebugLedger(), [])
  const [state, setState] = useState<QcgState>(services.snapshot())
  const [selected, setSelected] = useState(demoCards[3].id)
  const selectedCard = demoCards.find((card) => card.id === selected)!
  const [activeTab, setActiveTab] = useState<Tab>('Experiment')
  const [intent, setIntent] = useState(selectedCard.scientificIntent)
  const [observable, setObservable] = useState(selectedCard.observable)
  const [profileId, setProfileId] = useState(selectedCard.profileId)
  const [shots, setShots] = useState(selectedCard.requestedLimits.shots)
  const [timeoutMs, setTimeoutMs] = useState(selectedCard.requestedLimits.timeout_ms)
  const [maxQubits, setMaxQubits] = useState(selectedCard.requestedLimits.max_qubits)
  const [justification, setJustification] = useState('')
  const [busy, setBusy] = useState(false)
  const [storedReceipts, setStoredReceipts] = useState(0)
  const [season, setSeason] = useState<QcgSeason>(() => readWindowQcgSeason(window))
  const [debugSessionId] = useState(() => crypto.randomUUID())
  const [debugMessages, setDebugMessages] = useState<QcgDebugMessage[]>([])
  const [debugReady, setDebugReady] = useState(false)
  const [debugActorFilter, setDebugActorFilter] = useState('all')
  const [debugKindFilter, setDebugKindFilter] = useState('all')
  const [humanDebugSummary, setHumanDebugSummary] = useState('')
  const [debugError, setDebugError] = useState('')
  const simulationController = useRef<AbortController | null>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const seasonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const evalFixtureLoaded = useRef(false)
  const stateRef = useRef(state)
  stateRef.current = state
  const refresh = useCallback(() => setState(services.snapshot()), [services])
  const { supported, toolNames, registrationStatus } = useQcgWebMcp(services, state, refresh)

  useEffect(() => () => simulationController.current?.abort(), [])
  useEffect(() => { saveWindowQcgSeason(window, season) }, [season])
  useEffect(() => {
    void debugLedger.openSession(debugSessionId).then(() => setDebugReady(true)).catch(() => setDebugReady(false))
  }, [debugLedger, debugSessionId])
  useEffect(() => {
    if (!debugReady) return
    const removeBridge = installQcgDevtoolsBridge(() => stateRef.current, debugLedger, debugSessionId)
    const unregister = window.__QCG_DEVTOOLS_V1__ ? registerQcgDevtoolsTools(window.__QCG_DEVTOOLS_V1__, debugLedger) : () => undefined
    return () => { unregister(); removeBridge() }
  }, [debugLedger, debugReady, debugSessionId])
  const refreshDebugMessages = useCallback(() => {
    void debugLedger.messages(debugSessionId).then(setDebugMessages).catch(() => setDebugMessages([]))
  }, [debugLedger, debugSessionId])
  useEffect(() => { if (debugReady) refreshDebugMessages() }, [debugReady, refreshDebugMessages])
  useEffect(() => debugLedger.subscribe(refreshDebugMessages), [debugLedger, refreshDebugMessages])
  useEffect(() => {
    const fixture = new URLSearchParams(window.location.search).get('eval_fixture')
    if (!fixture || evalFixtureLoaded.current) return
    evalFixtureLoaded.current = true
    void services.loadDemoArtifact(fixture)
      .then(({ card }) => {
        setSelected(card.id)
        setIntent(card.scientificIntent)
        setObservable(card.observable)
        setProfileId(card.profileId)
        setShots(card.requestedLimits.shots)
        setTimeoutMs(card.requestedLimits.timeout_ms)
        setMaxQubits(card.requestedLimits.max_qubits)
        refresh()
      })
      .catch(() => refresh())
  }, [services, refresh])
  useEffect(() => {
    void readReceipts().then((receipts) => setStoredReceipts(receipts.length)).catch(() => setStoredReceipts(0))
  }, [])
  useEffect(() => {
    if (!state.receipt) return
    void saveReceipt(state.receipt)
      .then(() => readReceipts())
      .then((receipts) => setStoredReceipts(receipts.length))
      .catch(() => undefined)
  }, [state.receipt?.digest])
  useEffect(() => {
    if (!state.consent || state.consent.used) return
    const delay = new Date(state.consent.expires_at).getTime() - Date.now()
    if (delay <= 0) {
      refresh()
      return
    }
    const timer = window.setTimeout(refresh, delay + 20)
    return () => window.clearTimeout(timer)
  }, [state.consent?.consent_id, state.consent?.used, state.consent?.expires_at, refresh])

  function chooseCard(cardId: string): void {
    const card = demoCards.find((candidate) => candidate.id === cardId)!
    setSelected(card.id)
    setIntent(card.scientificIntent)
    setObservable(card.observable)
    setProfileId(card.profileId)
    setShots(card.requestedLimits.shots)
    setTimeoutMs(card.requestedLimits.timeout_ms)
    setMaxQubits(card.requestedLimits.max_qubits)
  }

  async function evaluateManifest(manifestId: string): Promise<void> {
    await services.evaluate({
      manifest_id: manifestId,
      target_profile_id: profileId,
      scientific_intent: intent,
      observable,
      parameters: {},
      requested_limits: {
        shots,
        timeout_ms: timeoutMs,
        max_qubits: maxQubits,
        target: profileId === EXTERNAL_PROFILE_ID ? 'external_reference' : 'local_simulator'
      }
    })
  }

  async function runDemo(): Promise<void> {
    setBusy(true)
    try {
      const { manifest, card } = await services.loadDemoArtifact(selected)
      const inspected = await services.inspect({ artifact_id: manifest.artifact_id })
      setIntent(card.scientificIntent)
      setObservable(card.observable)
      setProfileId(card.profileId)
      await services.evaluate({
        manifest_id: inspected.manifest_id,
        target_profile_id: card.profileId,
        scientific_intent: card.scientificIntent,
        observable: card.observable,
        parameters: {},
        requested_limits: card.requestedLimits
      })
      setActiveTab('Agent Review')
    } catch {
      setActiveTab('Activity')
    } finally {
      refresh()
      setBusy(false)
    }
  }

  async function importArtifact(file: File): Promise<void> {
    setBusy(true)
    try {
      await services.importQsharpFile(file.name, new Uint8Array(await file.arrayBuffer()))
      setProfileId(LOCAL_PROFILE_ID)
      setIntent('Review the imported Q# artifact and choose the minimum justified next action.')
      setObservable('compile_validity')
      setActiveTab('Experiment')
    } catch {
      setActiveTab('Activity')
    } finally {
      refresh()
      setBusy(false)
    }
  }

  async function inspectImported(): Promise<void> {
    if (!state.manifest) return
    setBusy(true)
    try {
      const inspected = await services.inspect({ artifact_id: state.manifest.artifact_id })
      await evaluateManifest(inspected.manifest_id)
      setActiveTab('Agent Review')
    } catch {
      setActiveTab('Activity')
    } finally {
      refresh()
      setBusy(false)
    }
  }

  async function recordDecision(choice: HumanChoice): Promise<void> {
    if (!state.recommendation) return
    setBusy(true)
    try {
      await services.decide({
        recommendation_id: state.recommendation.recommendation_id,
        choice,
        justification
      })
      setActiveTab(choice === 'accepted' && state.recommendation.decision === 'simulate_first' ? 'Human Decision' : 'Evidence Receipt')
    } catch {
      setActiveTab('Human Decision')
    } finally {
      refresh()
      setBusy(false)
    }
  }

  async function runSimulation(): Promise<void> {
    if (!state.recommendation || !state.consent) return
    setBusy(true)
    const controller = new AbortController()
    simulationController.current = controller
    try {
      await services.simulate({
        recommendation_id: state.recommendation.recommendation_id
      }, controller.signal)
      setActiveTab('Evidence Receipt')
    } catch {
      setActiveTab('Activity')
    } finally {
      simulationController.current = null
      refresh()
      setBusy(false)
    }
  }

  function revokeConsent(): void {
    try {
      services.revokeConsent()
    } finally {
      refresh()
    }
  }

  async function appendHumanDebugMessage(): Promise<void> {
    if (!humanDebugSummary.trim() || !window.__QCG_DEVTOOLS_V1__) return
    try {
      await window.__QCG_DEVTOOLS_V1__.appendHumanMessage({ summary: humanDebugSummary.trim() })
      setHumanDebugSummary('')
      setDebugError('')
      refreshDebugMessages()
    } catch (error) {
      setDebugError(error instanceof Error ? error.message : 'The collaboration message could not be recorded.')
      setActiveTab('Activity')
    }
  }

  async function exportEvidence(format: 'json' | 'markdown'): Promise<void> {
    if (!state.receipt) return
    setBusy(true)
    try {
      const result = await services.exportPacket({ receipt_id: state.receipt.receipt_id, format })
      download(
        `webmcp-qcg-evidence.${format === 'json' ? 'json' : 'md'}`,
        result.content,
        format === 'json' ? 'application/json' : 'text/markdown'
      )
    } finally {
      refresh()
      setBusy(false)
    }
  }

  function onTabKeyDown(index: number, event: React.KeyboardEvent<HTMLButtonElement>): void {
    let next = index
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = tabs.length - 1
    else return
    event.preventDefault()
    setActiveTab(tabs[next])
    tabRefs.current[next]?.focus()
  }

  function onSeasonKeyDown(index: number, event: React.KeyboardEvent<HTMLButtonElement>): void {
    let next = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % qcgSeasons.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + qcgSeasons.length) % qcgSeasons.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = qcgSeasons.length - 1
    else return
    event.preventDefault()
    setSeason(qcgSeasons[next])
    seasonRefs.current[next]?.focus()
  }

  const consentValid = state.authority_state === 'authorized'

  const visibleDebugMessages = debugMessages.filter((message) =>
    (debugActorFilter === 'all' || message.actor === debugActorFilter) &&
    (debugKindFilter === 'all' || message.kind === debugKindFilter)
  )

  return <main data-season={season}>
    <header className="hero">
      <img className="seasonal-mark" src={`/seasonal/${season}.svg`} alt="" aria-hidden="true" />
      <div>
        <p className="eyebrow">WebMCP-QCG · browser-native HITL preflight</p>
        <h1>Review before you run.</h1>
        <p className="lede">I make a quantum call inspectable before compute, shots or provider budget can enter the workflow. The agent recommends; the human accepts, defers or overrides.</p>
      </div>
      <div className="hero-actions">
        <div className="season-selector" role="radiogroup" aria-label="Interface season">
          {qcgSeasons.map((option, index) => <button key={option} ref={(node) => { seasonRefs.current[index] = node }} role="radio" tabIndex={season === option ? 0 : -1} aria-checked={season === option} className={season === option ? 'selected' : ''} onClick={() => setSeason(option)} onKeyDown={(event) => onSeasonKeyDown(index, event)}>{option}</button>)}
        </div>
        <p className={`status-chip ${registrationStatus === 'registered' ? 'pass' : 'caution'}`} role="status">
          <span aria-hidden="true">{registrationStatus === 'registered' ? '●' : '△'}</span>
          {!supported
            ? 'Human mode · WebMCP unavailable'
            : registrationStatus === 'registered'
              ? toolNames.length
                ? `${toolNames.length} native tools registered`
                : 'WebMCP ready · load an artifact'
              : registrationStatus === 'error'
                ? 'WebMCP registration needs recovery'
                : 'Registering WebMCP tools'}
        </p>
      </div>
    </header>

    <section className="security-rail" aria-label="Persistent security checks">
      <article>
        <span className="security-icon" aria-hidden="true">#</span>
        <div><h2>Artifact Integrity</h2><p>{state.manifest ? shortHash(state.manifest.artifact_digest) : 'Awaiting a local Q# artifact'}</p></div>
        <strong>{state.manifest?.compiler.status ?? 'empty'}</strong>
      </article>
      <article>
        <span className="security-icon" aria-hidden="true">◎</span>
        <div><h2>Target Evidence</h2><p>{state.targetProfile?.label ?? 'No target snapshot selected'}</p></div>
        <strong>{state.targetProfile?.evidence_state ?? 'empty'}</strong>
      </article>
      <article>
        <span className="security-icon" aria-hidden="true">✓</span>
        <div><h2>Authority &amp; Effects</h2><p>Agent: {state.recommendation?.decision ?? 'pending'} · Human: {state.humanDecision?.choice ?? 'pending'}</p></div>
        <strong>{state.effects.qpu_submissions} QPU</strong>
      </article>
    </section>

    <nav className="tabs" role="tablist" aria-label="QCG workflow">
      {tabs.map((tab, index) => <button
        key={tab}
        ref={(node) => { tabRefs.current[index] = node }}
        role="tab"
        aria-selected={activeTab === tab}
        aria-controls={`panel-${index}`}
        id={`tab-${index}`}
        tabIndex={activeTab === tab ? 0 : -1}
        onClick={() => setActiveTab(tab)}
        onKeyDown={(event) => onTabKeyDown(index, event)}
      >{index + 1}. {tab}</button>)}
    </nav>

    <section className="workspace" role="tabpanel" id={`panel-${tabs.indexOf(activeTab)}`} aria-labelledby={`tab-${tabs.indexOf(activeTab)}`}>
      {activeTab === 'Experiment' && <>
        <div className="section-title"><div><p className="step">01 · Input boundary</p><h2>Experiment</h2></div><p>Raw Q# stays in session memory. WebMCP receives identifiers and bounded evidence only.</p></div>
        <div className="two-column">
          <article className="panel">
            <h3>Import a real Q# artifact</h3>
            <label className="file-drop">
              <span>Choose a UTF-8 <code>.qs</code> file (maximum 128 KiB)</span>
              <input type="file" accept=".qs,text/plain" disabled={busy} onChange={(event) => {
                const file = event.currentTarget.files?.[0]
                if (file) void importArtifact(file)
              }} />
            </label>
            <div className="action-row">
              <button onClick={() => download('qcg-bell-sample.qs', bellProgram, 'text/plain')}>Download Bell sample</button>
              <button className="primary" disabled={busy || state.manifest?.provenance !== 'human_import'} onClick={inspectImported}>Inspect imported artifact</button>
            </div>
            {state.manifest && <dl className="facts">
              <dt>File</dt><dd>{state.manifest.file_name}</dd>
              <dt>Artifact ID</dt><dd><code>{state.manifest.artifact_id}</code></dd>
              <dt>Bytes</dt><dd>{state.manifest.byte_size}</dd>
              <dt>SHA-256</dt><dd><code>{shortHash(state.manifest.artifact_digest)}</code></dd>
              <dt>Compiler</dt><dd>{state.manifest.compiler.status} · {state.manifest.compiler.diagnostic_count} diagnostics</dd>
            </dl>}
          </article>
          <article className="panel">
            <h3>Decision inputs</h3>
            <label>Scientific intent<textarea value={intent} maxLength={320} onChange={(event) => setIntent(event.target.value)} /></label>
            <label>Observable<input value={observable} maxLength={80} onChange={(event) => setObservable(event.target.value)} /></label>
            <label>Target profile<select value={profileId} onChange={(event) => setProfileId(event.target.value)}>
              <option value={LOCAL_PROFILE_ID}>Q# local WASM 1.31</option>
              <option value={EXTERNAL_PROFILE_ID}>External QIR reference · submission disabled</option>
            </select></label>
            <div className="limit-grid">
              <label>Shots<input type="number" min="1" max="256" value={shots} onChange={(event) => setShots(Number(event.target.value))} /></label>
              <label>Max qubits<input type="number" min="1" max="8" value={maxQubits} onChange={(event) => setMaxQubits(Number(event.target.value))} /></label>
              <label>Timeout ms<input type="number" min="500" max="15000" step="500" value={timeoutMs} onChange={(event) => setTimeoutMs(Number(event.target.value))} /></label>
            </div>
          </article>
        </div>
        <div className="section-title scenarios-title"><div><p className="step">Falsifiable fixtures</p><h3>Five decision cards</h3></div><p>Each card states its hypothesis before QCG computes the result.</p></div>
        <div className="cards" role="radiogroup" aria-label="Quantum decision fixture">
          {demoCards.map((card) => <button
            key={card.id}
            className={`scenario-card ${selected === card.id ? 'selected' : ''}`}
            role="radio"
            aria-checked={selected === card.id}
            onClick={() => chooseCard(card.id)}
          >
            <span>{card.title}</span>
            <small>{card.detail}</small>
            <code>hypothesis: {card.expectedDecision}</code>
          </button>)}
        </div>
        <button className="primary run-card" disabled={busy} onClick={runDemo}>Run selected preflight</button>
      </>}

      {activeTab === 'Agent Review' && <>
        <div className="section-title"><div><p className="step">02 · Recommendation boundary</p><h2>Agent Review</h2></div><p>A recommendation explains its evidence and safer alternative. It carries no authority to execute.</p></div>
        {!state.recommendation ? <div className="empty-state"><span>◎</span><h3>No recommendation yet</h3><p>Load and inspect an experiment first.</p><button onClick={() => setActiveTab('Experiment')}>Go to Experiment</button></div> :
          <div className="two-column">
            <article className="panel decision-panel">
              <p className="step">Agent recommends</p>
              <h3>{state.recommendation.decision.replaceAll('_', ' ')}</h3>
              <p className="confidence">Confidence: {state.recommendation.confidence}</p>
              <h4>Reason codes</h4>
              <ul>{state.recommendation.reason_codes.map((reason) => <li key={reason}><code>{reason}</code></li>)}</ul>
              <h4>Safer alternative</h4><p>{state.recommendation.safer_alternative}</p>
            </article>
            <article className="panel">
              <h3>Evidence boundary</h3>
              <dl className="facts">
                <dt>Manifest</dt><dd>{state.recommendation.manifest_id}</dd>
                <dt>Target</dt><dd>{state.recommendation.target_profile_id}</dd>
                <dt>Reuse key</dt><dd><code>{shortHash(state.recommendation.reuse_key)}</code></dd>
                <dt>Expiry</dt><dd>{new Date(state.recommendation.expires_at).toLocaleTimeString()}</dd>
                <dt>Unknowns</dt><dd>{state.recommendation.unknowns.length ? state.recommendation.unknowns.join(' ') : 'None recorded.'}</dd>
              </dl>
              <button className="primary" onClick={() => setActiveTab('Human Decision')}>Review as human</button>
            </article>
          </div>}
      </>}

      {activeTab === 'Human Decision' && <>
        <div className="section-title"><div><p className="step">03 · Authority boundary</p><h2>Human Decision</h2></div><p>The human can accept, defer or override. Only an accepted local-simulation recommendation creates one short-lived consent token.</p></div>
        {!state.recommendation ? <div className="empty-state"><span>✓</span><h3>Nothing to authorize</h3><p>An agent recommendation must exist first.</p></div> :
          <div className="two-column">
            <article className="panel">
              <p className="step">Recommendation under review</p>
              <h3>{state.recommendation.decision.replaceAll('_', ' ')}</h3>
              <label>Human justification<textarea maxLength={500} value={justification} onChange={(event) => setJustification(event.target.value)} placeholder="Required for an override; useful for every decision." /></label>
              <div className="decision-actions">
                <button className="accept" disabled={busy} onClick={() => recordDecision('accepted')}>✓ Accept</button>
                <button disabled={busy} onClick={() => recordDecision('deferred')}>◷ Defer</button>
                <button className="override" disabled={busy || justification.trim().length < 12} onClick={() => recordDecision('overridden')}>↻ Override</button>
              </div>
            </article>
            <article className="panel">
              <h3>Recorded authority</h3>
              <dl className="facts">
                <dt>Choice</dt><dd>{state.humanDecision?.choice ?? 'pending'}</dd>
                <dt>Override</dt><dd>{state.humanDecision?.override ? 'yes, justified' : 'no'}</dd>
                <dt>Authority</dt><dd>{state.authority_state.replaceAll('_', ' ')}</dd>
                <dt>Consent</dt><dd>{consentValid ? 'visible · unused · time-limited' : state.authority_state}</dd>
                <dt>QPU submission</dt><dd>disabled · {state.effects.qpu_submissions} calls</dd>
              </dl>
              {consentValid && <div className="action-row">
                <button className="primary" disabled={busy} onClick={runSimulation}>Run bounded local Q# simulation</button>
                <button disabled={busy} onClick={revokeConsent}>Revoke consent</button>
                {busy && <button onClick={() => simulationController.current?.abort()}>Cancel</button>}
              </div>}
              {state.phase === 'cancelled' && <p className="notice caution">Cancelled safely. Review again for a new consent token.</p>}
            </article>
          </div>}
      </>}

      {activeTab === 'Evidence Receipt' && <>
        <div className="section-title"><div><p className="step">04 · Portable proof</p><h2>Evidence Receipt</h2></div><p>The receipt binds the artifact, target snapshot, recommendation, human choice and measured effects.</p></div>
        {!state.receipt ? <div className="empty-state"><span>▣</span><h3>No receipt yet</h3><p>Evaluate an experiment to create the first v2 receipt.</p></div> :
          <div className="two-column">
            <article className="panel receipt">
              <p className="step">{state.receipt.schema_version}</p>
              <h3>{state.receipt.recommendation.decision.replaceAll('_', ' ')}</h3>
              <dl className="facts">
                <dt>Receipt</dt><dd>{state.receipt.receipt_id}</dd>
                <dt>Artifact</dt><dd><code>{shortHash(state.receipt.manifest.artifact_digest)}</code></dd>
                <dt>Human</dt><dd>{state.receipt.human_decision?.choice ?? 'pending'}</dd>
                <dt>Bell invariant</dt><dd>{state.receipt.simulation ? (state.receipt.simulation.bell_invariant ? 'PASS' : 'FAIL') : 'not run'}</dd>
                <dt>Digest</dt><dd><code>{shortHash(state.receipt.digest)}</code></dd>
              </dl>
            </article>
            <article className="panel">
              <h3>Export without execution</h3>
              <p>JSON and Markdown exports contain no raw Q#, local path, secret, provider error or network credential.</p>
              <div className="action-row">
                <button className="primary" disabled={busy} onClick={() => exportEvidence('json')}>Export JSON</button>
                <button disabled={busy} onClick={() => exportEvidence('markdown')}>Export Markdown</button>
              </div>
              <p className="notice"><strong>IndexedDB:</strong> {storedReceipts} local receipt{storedReceipts === 1 ? '' : 's'} available in this browser.</p>
            </article>
          </div>}
      </>}

      {activeTab === 'Activity' && <>
        <div className="section-title"><div><p className="step">05 · Observable effects</p><h2>Activity</h2></div><p>Every tool and human choice enters one bounded ledger with explicit provenance.</p></div>
        <div className="counter-grid">
          <article><strong>{state.effects.inspections}</strong><span>inspections</span></article>
          <article><strong>{state.effects.evaluations}</strong><span>evaluations</span></article>
          <article><strong>{state.effects.metadata_validations}</strong><span>metadata validations</span></article>
          <article><strong>{state.effects.local_simulations}</strong><span>local simulations</span></article>
          <article><strong>{state.effects.qpu_submissions}</strong><span>QPU submissions</span></article>
        </div>
        {state.error && <p className="notice error" role="alert"><strong>Recovery:</strong> {state.error}</p>}
        <p className="notice"><strong>Debug storage:</strong> {debugLedger.storageMode === 'indexeddb' ? 'IndexedDB isolated ledger' : 'memory fallback; messages persist only for this page session.'}</p>
        <div className="two-column">
          <article className="panel">
            <h3>Current WebMCP surface</h3>
            <ul className="tool-list">{toolNames.map((tool) => <li key={tool}><span aria-hidden="true">◆</span><code>{tool}</code></li>)}</ul>
          </article>
          <article className="panel">
            <h3>Invocation ledger</h3>
            <ol className="log" aria-live="polite">
              {state.invocations.length ? state.invocations.map((entry) => <li key={entry.id}>
                <strong>{entry.status}</strong> <code>{entry.tool}</code>
                <span>{entry.summary}</span>
                <small>{entry.source} · {new Date(entry.timestamp).toLocaleTimeString()}</small>
              </li>) : <li>No invocation yet.</li>}
            </ol>
          </article>
        </div>
        <div className="two-column collaboration-grid">
          <article className="panel">
            <h3>Collaboration ledger</h3>
            <p>Isolated debug messages never confer consent or invoke a simulation.</p>
            <div className="debug-filters">
              <label>Actor<select aria-label="Filter collaboration actor" value={debugActorFilter} onChange={(event) => setDebugActorFilter(event.target.value)}><option value="all">All actors</option><option value="human">Human</option><option value="codex">Codex</option><option value="gemini">Gemini</option><option value="antigravity">Antigravity</option><option value="system">System</option></select></label>
              <label>Kind<select aria-label="Filter collaboration kind" value={debugKindFilter} onChange={(event) => setDebugKindFilter(event.target.value)}><option value="all">All kinds</option><option value="observation">Observation</option><option value="hypothesis">Hypothesis</option><option value="proposal">Proposal</option><option value="challenge">Challenge</option><option value="decision_request">Decision request</option><option value="receipt">Receipt</option></select></label>
            </div>
            <label>Message for human review<textarea aria-label="Human collaboration message" maxLength={1200} value={humanDebugSummary} onChange={(event) => setHumanDebugSummary(event.target.value)} placeholder="Record a bounded observation for the collaboration ledger." /></label>
            <p className="notice"><strong>Collaboration boundary:</strong> Never paste secrets, local paths or source code into this ledger.</p>
            {debugError && <p className="notice error" role="alert"><strong>Review the message:</strong> {debugError}</p>}
            <button className="primary" disabled={!debugReady || !humanDebugSummary.trim()} onClick={() => void appendHumanDebugMessage()}>Add human message</button>
          </article>
          <article className="panel">
            <h3>Declared messages</h3>
            <ol className="log collaboration-log" aria-live="polite">
              {visibleDebugMessages.length ? visibleDebugMessages.map((message) => <li key={message.event_id}><strong>{message.actor} · {message.kind}</strong><span>{message.summary}</span><small>{message.status} · {message.confidence} confidence · {new Date(message.issued_at).toLocaleTimeString()}</small></li>) : <li>No collaboration messages match the active filters.</li>}
            </ol>
          </article>
        </div>
      </>}
    </section>

    <footer>
      <p><strong>Decide before quantum execution.</strong> QCG performs local preflight only. Provider credentials, paid calls and QPU submission remain outside this MVP.</p>
    </footer>
  </main>
}
