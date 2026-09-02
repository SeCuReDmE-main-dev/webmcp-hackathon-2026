import { useState, type ReactNode } from 'react'
import { bellOpenQasmProgram, bellProgram, demoCards } from '../catalog'
import { getQuantumAdapter, quantumAdapters } from '../quantumAdapters'
import type { QcgDebugMessage } from '../debugContracts'
import { EXTERNAL_PROFILE_ID, LOCAL_PROFILE_ID } from '../targetProfiles'
import type { HumanChoice, QcgState, QuantumProfileId } from '../types'
import { parseConsoleLine } from './commandParser'
import type { ConsoleView } from './contracts'

const short = (value?: string) => value ? `${value.slice(0, 12)}…${value.slice(-8)}` : '—'
const download = (name: string, content: string, type: string) => { const url = URL.createObjectURL(new Blob([content], { type })); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url) }
const quantumToolNames = [
  'inspect_quantum_experiment',
  'evaluate_quantum_call',
  'run_bounded_local_simulation',
  'export_quantum_evidence_report',
] as const
const collaborationToolNames = [
  'read_debug_context',
  'post_debug_message',
  'request_human_review',
  'export_debug_handoff',
] as const

export interface ImportedEvaluationDraft {
  targetProfileId: typeof LOCAL_PROFILE_ID | typeof EXTERNAL_PROFILE_ID
  scientificIntent: string
  observable: string
  shots: number
  timeoutMs: number
  maxQubits: number
}

export const defaultImportedEvaluation: ImportedEvaluationDraft = {
  targetProfileId: LOCAL_PROFILE_ID,
  scientificIntent: 'Review this imported artifact before any quantum execution.',
  observable: 'artifact_preflight',
  shots: 64,
  timeoutMs: 10_000,
  maxQubits: 2,
}

interface ViewProps {
  view: ConsoleView; state: QcgState; selected: string; select(card: string): void; artifactProfileId: QuantumProfileId; setArtifactProfileId(id: QuantumProfileId): void; busy: boolean
  runDemo(): void; importArtifact(file: File): void; inspectImported(): void; importedEvaluation: ImportedEvaluationDraft; updateImportedEvaluation(patch: Partial<ImportedEvaluationDraft>): void; evaluateImported(): void; importedInspectionReady: boolean; operationError?: string; operationAnnouncement?: string; setView(view: ConsoleView): void; recordDecision(choice: HumanChoice, justification: string): void; runSimulation(): void; revokeConsent(): void
  exportEvidence(format: 'json' | 'markdown'): void; toolNames: string[]; registrationStatus: string; supported: boolean; debugReady: boolean; debugMessages: QcgDebugMessage[]; humanMessage(summary: string): void; storedReceipts: number
  actorFilter: string; kindFilter: string; setFilters(actor: string, kind: string): void; requestHandoff(intent: 'debug' | 'search' | 'find' | 'brainstorm' | 'decision'): Promise<string>
}

export function ConsoleInspector({ state, debugMessages, sessionId, onViewChange }: { state: QcgState; debugMessages: QcgDebugMessage[]; sessionId: string; onViewChange(view: ConsoleView): void }) {
  const participants = [...new Map(debugMessages.map((message) => [`${message.actor}:${message.role}`, `${message.actor} · ${message.role}`])).values()]
  const openReviews = debugMessages.filter((message) => message.kind === 'decision_request' && message.status !== 'resolved').length
  const gemini = [...debugMessages].reverse().find((message) => message.actor === 'gemini')
  return <><div className="inspector-heading"><img className="inspector-q-avatar" src="/brand/inspector-q-avatar.jpg" width="42" height="42" alt="" aria-hidden="true" /><div><h2>Integrity</h2><small>Inspector Q · session {sessionId.slice(0, 8)}</small></div><span className="status-pip technical" /></div><dl className="console-facts"><dt>Artifact digest</dt><dd>{state.manifest ? <button className="inspector-jump" onClick={() => onViewChange('inspector')}><code>{short(state.manifest.artifact_digest)}</code><span>Open</span></button> : '—'}</dd><dt>Compiler</dt><dd>{state.manifest?.compiler.status ?? 'pending'}</dd><dt>Target</dt><dd>{state.targetProfile?.label ?? 'not selected'}</dd><dt>Recommendation</dt><dd>{state.recommendation ? <button className="inspector-jump" onClick={() => onViewChange('decisions')}>{state.recommendation.decision.replaceAll('_', ' ')}<span>Open</span></button> : 'pending'}</dd></dl><div className="inspector-section authority"><h3><span className="status-pip authority" /> Human authority</h3><dl className="console-facts"><dt>State</dt><dd>{state.authority_state}</dd><dt>Decision</dt><dd>{state.humanDecision?.choice ?? 'pending'}</dd><dt>Receipt</dt><dd>{state.receipt ? <button className="inspector-jump" onClick={() => onViewChange('receipts')}><code>{short(state.receipt.digest)}</code><span>Open</span></button> : '—'}</dd></dl></div><div className="inspector-section"><h3>Effects <button className="inspector-section-link" onClick={() => onViewChange('activity')}>View activity</button></h3><div className="effect-chips">{Object.entries(state.effects).map(([name, value]) => <span key={name}>{name.replaceAll('_', ' ')} <b>{value}</b></span>)}</div></div><div className="inspector-section"><h3>Participants <button className="inspector-section-link" onClick={() => onViewChange('activity')}>View activity</button></h3><p className="participant-list">{participants.length ? participants.join(' · ') : 'No declared participants.'}</p><p className="muted">{openReviews} open review{openReviews === 1 ? '' : 's'} · Gemini {gemini ? gemini.status : 'not connected'}</p></div><p className="muted">Identifiers and bounded evidence only. Source, consent tokens, paths and provider credentials remain private.</p></>
}

export function ConsoleViews(props: ViewProps) {
  let content: ReactNode
  if (props.view === 'inspector') content = <InspectorView {...props} />
  else if (props.view === 'console') content = <PaletteView {...props} />
  else if (props.view === 'webmcp') content = <WebMcpView {...props} />
  else if (props.view === 'decisions') content = <DecisionsView {...props} />
  else if (props.view === 'sources') content = <SourcesView />
  else if (props.view === 'receipts') content = <ReceiptsView {...props} />
  else content = <ActivityView {...props} />
  return <><output className="sr-only" aria-live="polite" aria-atomic="true">{props.operationAnnouncement}</output>{props.operationError && <p className="notice error operation-error" role="alert" aria-live="assertive" aria-atomic="true">{props.operationError}</p>}{content}</>
}

function Heading({ kicker, title, children, tone = 'technical' }: { kicker: string; title: string; children: ReactNode; tone?: 'technical' | 'authority' | 'evidence' }) { return <header className={`view-heading ${tone}`}><p><span className="status-pip" />{kicker}</p><h1>{title}</h1>{children}</header> }
function InspectorView(props: ViewProps) {
  const adapter = getQuantumAdapter(props.artifactProfileId)!
  const imported = props.state.manifest?.provenance === 'human_import'
  const evaluation = props.importedEvaluation
  return <><Heading kicker="01 / bounded input" title="Inspector"><span>Import stays in browser memory; only bounded evidence crosses surfaces.</span></Heading><div className="console-grid two"><article className="console-card"><h2>Artifact intake</h2><label>Quantum profile<select value={props.artifactProfileId} onChange={(event) => props.setArtifactProfileId(event.target.value as QuantumProfileId)}>{quantumAdapters.map((item) => <option key={item.id} value={item.id}>{item.label} · {item.executable ? 'local executable' : 'inspection only'}</option>)}</select></label><p className="muted">{adapter.extensions.join(', ')} · 128 KiB maximum · {adapter.capabilities.simulate ? 'simulation capable' : 'static only'}</p><input aria-label="Quantum artifact file" type="file" accept={`${adapter.extensions.join(',')},text/plain`} disabled={props.busy} onChange={(event) => { const file = event.currentTarget.files?.[0]; if (file) props.importArtifact(file) }} /><div className="button-row"><button onClick={() => download('qcg-bell.qs', bellProgram, 'text/plain')}>Q# Bell</button><button onClick={() => download('qcg-bell.qasm', bellOpenQasmProgram, 'text/plain')}>OpenQASM Bell</button><button disabled={props.busy || !imported} onClick={props.inspectImported}>Inspect import</button></div></article><article className="console-card"><h2>Frozen decision cards</h2><div className="fixture-list">{demoCards.map((card) => <button className={props.selected === card.id ? 'selected' : ''} key={card.id} onClick={() => props.select(card.id)}><b>{card.title}</b><small>{card.detail}</small></button>)}</div><button className="primary wide" disabled={props.busy} onClick={props.runDemo}>Run selected preflight</button></article></div>{props.state.manifest && <div className={`console-grid ${imported ? 'two' : ''}`}><article className="console-card"><h2>Current artifact</h2><dl className="console-facts"><dt>File</dt><dd>{props.state.manifest.file_name}</dd><dt>Profile</dt><dd>{props.state.manifest.artifact_profile}</dd><dt>Format</dt><dd>{props.state.manifest.format}</dd><dt>Digest</dt><dd><code>{short(props.state.manifest.artifact_digest)}</code></dd><dt>Compiler</dt><dd>{props.state.manifest.compiler.status}</dd></dl></article>{imported && <article className="console-card imported-evaluation"><h2>Evaluate current import</h2><form onSubmit={(event) => { event.preventDefault(); props.evaluateImported() }}><label>Target profile<select aria-label="Evaluation target profile" value={evaluation.targetProfileId} onChange={(event) => props.updateImportedEvaluation({ targetProfileId: event.target.value as ImportedEvaluationDraft['targetProfileId'] })}><option value={LOCAL_PROFILE_ID}>Local QDK WebAssembly</option><option value={EXTERNAL_PROFILE_ID}>External QIR reference</option></select></label><label>Scientific intent<textarea aria-label="Scientific intent" required minLength={12} maxLength={320} value={evaluation.scientificIntent} onChange={(event) => props.updateImportedEvaluation({ scientificIntent: event.target.value })} /></label><label>Observable<input aria-label="Observable" required minLength={3} maxLength={80} value={evaluation.observable} onChange={(event) => props.updateImportedEvaluation({ observable: event.target.value })} /></label><div className="limit-grid"><label>Shots<input aria-label="Requested shots" type="number" required min={1} max={256} value={evaluation.shots} onChange={(event) => props.updateImportedEvaluation({ shots: event.target.valueAsNumber })} /></label><label>Timeout (ms)<input aria-label="Timeout milliseconds" type="number" required min={500} max={15_000} step={100} value={evaluation.timeoutMs} onChange={(event) => props.updateImportedEvaluation({ timeoutMs: event.target.valueAsNumber })} /></label><label>Max qubits<input aria-label="Maximum qubits" type="number" required min={1} max={8} value={evaluation.maxQubits} onChange={(event) => props.updateImportedEvaluation({ maxQubits: event.target.valueAsNumber })} /></label></div><p className="muted">Execution surface: <code>{evaluation.targetProfileId === LOCAL_PROFILE_ID ? 'local_simulator' : 'external_reference'}</code>. The selected target profile determines this value.</p><button className="primary wide" type="submit" disabled={props.busy || !props.importedInspectionReady}>{props.importedInspectionReady ? 'Evaluate current import' : 'Inspect import first'}</button></form></article>}</div>}</>
}
function PaletteView(props: ViewProps) {
  const [line, setLine] = useState('')
  const [output, setOutput] = useState<string[]>([])
  const push = (message: string) => setOutput((current) => [...current, message].slice(-50))
  async function execute(): Promise<void> {
    const parsed = parseConsoleLine(line)
    setLine('')
    if (!parsed.ok) { push(`Rejected: ${parsed.error}`); return }
    const command = parsed.command
    if (command.kind === 'clear_view') { setOutput([]); return }
    if (command.kind === 'help') { push('help · inspect · evaluate · open <view> · filter actor=<actor> kind=<kind> · handoff <intent> · export receipt <json|markdown> · clear-view'); return }
    if (command.kind === 'inspect') { if (!props.state.manifest) push('Inspector: no artifact is loaded.'); else { props.inspectImported(); push('Inspector: bounded inspection requested.'); } return }
    if (command.kind === 'evaluate') {
      if (props.state.manifest?.provenance !== 'human_import') push('Evaluate: import an artifact and inspect it first; demo cards run only from Inspector.')
      else if (!props.importedInspectionReady) push('Evaluate: inspect the current import first.')
      else { props.evaluateImported(); push('Evaluate: current imported manifest requested.') }
      return
    }
    if (command.kind === 'open') { props.setView(command.view); push(`Opened ${command.view}.`); return }
    if (command.kind === 'filter') { props.setFilters(command.actor, command.messageKind); props.setView('activity'); push(`Activity filter: actor=${command.actor} kind=${command.messageKind}.`); return }
    if (command.kind === 'handoff') { push(await props.requestHandoff(command.intent)); return }
    props.exportEvidence(command.format); push(`Receipt ${command.format} export requested.`)
  }
  return <><Heading kicker="bounded command line" title="Console"><span>Parser-backed commands only. No arbitrary JavaScript, text decisions, or simulation operation is accepted.</span></Heading><article className="console-card command-card"><form onSubmit={(event) => { event.preventDefault(); void execute() }}><label htmlFor="qcg-command-line">Command<input id="qcg-command-line" value={line} maxLength={160} onChange={(event) => setLine(event.target.value)} placeholder="help" autoComplete="off" /></label><button className="primary" type="submit">Run bounded command</button></form><ol className="command-output" aria-live="polite">{output.length ? output.map((message, index) => <li key={`${index}-${message}`}>{message}</li>) : <li>Type <code>help</code> for the finite grammar.</li>}</ol></article></>
}
function WebMcpView(props: ViewProps) {
  return <><Heading kicker="bounded public surface" title="WebMCP"><span>Four progressive quantum tools and four collaboration tools remain separate, explicit surfaces.</span></Heading><div className="console-grid two"><article className="console-card"><h2>Quantum tools</h2><dl className="console-facts"><dt>WebMCP</dt><dd>{props.supported ? 'available' : 'unavailable'}</dd><dt>Registration</dt><dd>{props.registrationStatus}</dd><dt>Surface</dt><dd>4 progressive tools</dd></dl><ul className="tool-list">{quantumToolNames.map((name) => { const active = props.toolNames.includes(name); return <li key={name}><span className={`status-pip ${active ? 'success' : ''}`} /><code>{name}</code><small>{active ? 'registered' : 'gated'}</small></li> })}</ul></article><article className="console-card"><h2>Collaboration tools</h2><dl className="console-facts"><dt>Discovery</dt><dd>{props.debugReady ? 'ready' : 'initializing'}</dd><dt>Authority</dt><dd>observe and request only</dd><dt>Surface</dt><dd>4 DevTools tools</dd></dl><ul className="tool-list">{collaborationToolNames.map((name) => <li key={name}><span className={`status-pip ${props.debugReady ? 'technical' : ''}`} /><code>{name}</code><small>{props.debugReady ? 'discoverable' : 'initializing'}</small></li>)}</ul></article></div><p className="notice">Collaboration tools cannot authorize, create consent, or start a simulation.</p></>
}
function DecisionsView(props: ViewProps) { const [justification, setJustification] = useState(''); const recommendation = props.state.recommendation; const canSimulate = props.state.authority_state === 'authorized' && recommendation?.decision === 'simulate_first'; return <><Heading kicker="human authority" title="Decisions" tone="authority"><span>Only a human button can apply a disposition. Agents can propose, never authorize.</span></Heading>{!recommendation ? <Empty title="No active recommendation" action={() => props.setView('inspector')} label="Open Inspector" /> : <div className="console-grid two"><article className="console-card authority-card"><h2>{recommendation.decision.replaceAll('_', ' ')}</h2><p className="muted">{recommendation.reason_codes.join(' · ')}</p><label>Human justification<textarea value={justification} maxLength={500} onChange={(event) => setJustification(event.target.value)} placeholder="Override requires 12 characters." /></label><div className="button-row"><button className="primary" disabled={props.busy} onClick={() => props.recordDecision('accepted', justification)}>Accept</button><button disabled={props.busy} onClick={() => props.recordDecision('deferred', justification)}>Defer</button><button className="danger" disabled={props.busy || justification.trim().length < 12} onClick={() => props.recordDecision('overridden', justification)}>Override</button></div></article><article className="console-card"><h2>Bounded execution</h2><p>Simulation is website-only and unavailable through the DevTools or sidepanel transports.</p><dl className="console-facts"><dt>Authority</dt><dd>{props.state.authority_state}</dd><dt>Local simulations</dt><dd>{props.state.effects.local_simulations}</dd></dl>{canSimulate && <div className="button-row"><button className="primary" disabled={props.busy} onClick={props.runSimulation}>Run bounded local simulation</button><button disabled={props.busy} onClick={props.revokeConsent}>Revoke consent</button></div>}</article></div>}</> }
function SourcesView() { return <><Heading kicker="provenance rail" title="Sources"><span>Inspection capabilities are explicit. Static profiles never offer simulation.</span></Heading><article className="console-card"><table><thead><tr><th>Profile</th><th>Formats</th><th>Capability</th></tr></thead><tbody>{quantumAdapters.map((item) => <tr key={item.id}><td>{item.label}</td><td>{item.extensions.join(', ')}</td><td>{item.capabilities.simulate ? 'inspect / compile / simulate' : 'inspect only'}</td></tr>)}</tbody></table></article><p className="notice">The sanitized console snapshot carries profile facts and digests only; raw source is never exported.</p></> }
function ReceiptsView(props: ViewProps) { return <><Heading kicker="portable proof" title="Receipts" tone="evidence"><span>Evidence binds artifact digest, recommendation, human disposition and measured effects.</span></Heading>{!props.state.receipt ? <Empty title="No receipt yet" action={() => props.setView('inspector')} label="Run a preflight" /> : <div className="console-grid two"><article className="console-card evidence-card"><dl className="console-facts"><dt>Schema</dt><dd>{props.state.receipt.schema_version}</dd><dt>Receipt</dt><dd>{props.state.receipt.receipt_id}</dd><dt>Digest</dt><dd><code>{short(props.state.receipt.digest)}</code></dd><dt>Stored locally</dt><dd>{props.storedReceipts}</dd></dl></article><article className="console-card"><h2>Export</h2><p>Exports omit source, local paths, secrets, provider errors and credentials.</p><div className="button-row"><button className="primary" disabled={props.busy} onClick={() => props.exportEvidence('json')}>Export JSON</button><button disabled={props.busy} onClick={() => props.exportEvidence('markdown')}>Export Markdown</button></div></article></div>}</> }
function ActivityView(props: ViewProps) { const [message, setMessage] = useState(''); const filtered = props.debugMessages.filter((item) => (props.actorFilter === 'all' || item.actor === props.actorFilter) && (props.kindFilter === 'all' || item.kind === props.kindFilter)); return <><Heading kicker="observable effects" title="Activity"><span>Every preflight and human message is recorded as bounded, attributable activity.</span></Heading><div className="metric-row">{Object.entries(props.state.effects).map(([key, value]) => <article key={key}><b>{value}</b><small>{key.replaceAll('_', ' ')}</small></article>)}</div><p className="notice">Filter: actor=<code>{props.actorFilter}</code> · kind=<code>{props.kindFilter}</code></p><div className="console-grid two"><article className="console-card"><h2>Human collaboration message</h2><textarea value={message} maxLength={500} onChange={(event) => setMessage(event.target.value)} placeholder="Bounded observation; do not paste secrets, paths, or source." /><button className="primary" disabled={!message.trim()} onClick={() => { props.humanMessage(message.trim()); setMessage('') }}>Record human message</button></article><article className="console-card"><h2>Ledger</h2><ol className="activity-list">{props.state.invocations.length ? props.state.invocations.map((item) => <li key={item.id}><b>{item.status}</b> <code>{item.tool}</code><span>{item.summary}</span></li>) : <li>No invocation yet.</li>}</ol></article></div><article className="console-card"><h2>Collaboration messages</h2><ol className="activity-list">{filtered.length ? filtered.map((item) => <li key={item.event_id}><b>{item.actor} · {item.kind}</b><span>{item.summary}</span></li>) : <li>No collaboration messages match this bounded filter.</li>}</ol></article>{props.state.error && <p className="notice error" role="alert">{props.state.error}</p>}</> }
function Empty({ title, action, label }: { title: string; action(): void; label: string }) { return <section className="empty"><h2>{title}</h2><button onClick={action}>{label}</button></section> }
