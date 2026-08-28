import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { demoCards } from './catalog'
import { QcgServices } from './services'
import { useQcgWebMcp } from './webmcp'
import type { QcgState } from './types'

function download(name: string, content: string, type: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = name
  anchor.click()
  URL.revokeObjectURL(url)
}

export default function App() {
  const services = useMemo(() => new QcgServices(), [])
  const [state, setState] = useState<QcgState>(services.snapshot())
  const [selected, setSelected] = useState(demoCards[3].id)
  const [busy, setBusy] = useState(false)
  const simulationController = useRef<AbortController | null>(null)
  const refresh = useCallback(() => setState(services.snapshot()), [services])
  const { supported, toolNames, registrationStatus } = useQcgWebMcp(services, state, refresh)
  const card = demoCards.find((candidate) => candidate.id === selected)
  useEffect(() => () => simulationController.current?.abort(), [])

  async function inspectAndEvaluate(): Promise<void> {
    setBusy(true)
    try {
      const inspection = await services.inspect({ artifact_id: selected })
      await services.evaluate({
        inspection_id: inspection.inspection_id,
        scientific_intent: `Determine the safest next action for the ${card?.title ?? 'selected'} experiment.`,
        requested_limits: {
          shots: 64,
          timeout_ms: 10_000,
          max_qubits: 2,
          target: card?.expectedDecision === 'ready_for_external_execution' ? 'external_unspecified' : 'local_simulator'
        }
      })
    } catch { /* state contains a safe recovery message */ }
    finally { refresh(); setBusy(false) }
  }
  async function runSimulation(): Promise<void> {
    if (!state.evaluation) return
    setBusy(true)
    const controller = new AbortController()
    simulationController.current = controller
    try { await services.simulate({ decision_id: state.evaluation.decision_id }, controller.signal) }
    catch { /* state contains a safe recovery message */ }
    finally { simulationController.current = null; refresh(); setBusy(false) }
  }
  async function exportEvidence(format: 'json' | 'markdown'): Promise<void> {
    if (!state.evidence) return
    setBusy(true)
    try {
      const result = await services.exportPacket({ evidence_packet_id: state.evidence.evidence_packet_id, format })
      download(`webmcp-qcg-evidence.${format === 'json' ? 'json' : 'md'}`, result.content, format === 'json' ? 'application/json' : 'text/markdown')
    } catch { /* safe state remains visible */ }
    finally { refresh(); setBusy(false) }
  }

  return <main>
    <header>
      <p className="eyebrow">WebMCP Quantum Call Gate · bounded local prototype</p>
      <h1>Choose evidence before computation.</h1>
      <p className="lede">A visible preflight gate that shares the same canonical services with people and browser agents. It never contacts a provider, QPU, or network execution endpoint.</p>
      <p className={`status ${registrationStatus === 'registered' ? 'ok' : 'warn'}`} role="status"><strong>WebMCP:</strong> {
        !supported ? 'Not available in this browser; the human interface remains fully functional.'
          : registrationStatus === 'registered' ? `${toolNames.length} native tools registered and acknowledged.`
            : registrationStatus === 'error' ? 'Registration failed; native tool claims are disabled until recovery.'
              : 'Registering the current native tool set…'
      }</p>
    </header>

    <section aria-labelledby="scenarios-heading">
      <div className="section-heading"><h2 id="scenarios-heading">Deterministic decision scenarios</h2><span>Five named demo cards</span></div>
      <div className="cards" role="radiogroup" aria-label="Quantum decision scenario">
        {demoCards.map((item) => <button key={item.id} className={`card ${selected === item.id ? 'selected' : ''}`} role="radio" aria-checked={selected === item.id} onClick={() => setSelected(item.id)}>
          <strong>{item.title}</strong><small>{item.detail}</small>
        </button>)}
      </div>
      <button className="primary" disabled={busy} onClick={inspectAndEvaluate}>Inspect and evaluate “{card?.title}”</button>
    </section>

    <section className="grid" aria-label="QCG state and actions">
      <article className="panel">
        <h2>Canonical state machine</h2>
        <dl>
          <dt>Phase</dt><dd><code>{state.phase}</code></dd>
          <dt>Inspection</dt><dd>{state.inspection?.inspection_id ?? '—'}</dd>
          <dt>Decision</dt><dd>{state.evaluation?.decision ?? '—'}</dd>
          <dt>Next action</dt><dd>{state.evaluation?.next_action ?? 'Select a scenario, then inspect and evaluate it.'}</dd>
          <dt>Reason codes</dt><dd>{state.evaluation?.reason_codes.join(', ') || state.inspection?.reason_codes.join(', ') || '—'}</dd>
          <dt>Provenance</dt><dd>{state.inspection?.provenance ?? 'No selected artifact has been inspected.'}</dd>
          <dt>Evidence packet</dt><dd>{state.evidence?.evidence_packet_id ?? '—'}</dd>
          <dt>Local simulations</dt><dd>{state.counters.local_simulations}</dd>
          <dt>External calls</dt><dd>{state.counters.external_provider_calls}</dd>
        </dl>
        {state.error && <p className="error" role="alert"><strong>Recovery:</strong> {state.error} Choose a scenario and inspect again. No provider call was made.</p>}
      </article>
      <article className="panel">
        <h2>Bounded local execution</h2>
        <p>The only executable branch is a fixed Bell-pair Q# program in a Web Worker. It appears only after <code>simulate_first</code> and visible consent.</p>
        {state.evaluation?.decision === 'simulate_first' && !state.consent && <button onClick={() => { try { services.grantConsent(); refresh() } catch { refresh() } }}>Grant one-time visible consent</button>}
        {state.evaluation?.decision === 'simulate_first' && state.consent && <div className="actions"><button className="primary" disabled={busy} onClick={runSimulation}>Run bounded local Q# simulation</button>{busy && <button onClick={() => simulationController.current?.abort()}>Cancel local simulation</button>}</div>}
        {state.evidence?.run_id && <p className="ok"><strong>Bell invariant:</strong> {state.evidence.bell_invariant ? 'PASS — paired measurements remained correlated.' : 'FAIL'}</p>}
        {state.evidence?.run_id && <p><strong>Shots:</strong> {state.evidence.shots_returned}/{state.evidence.shots_requested}</p>}
        {state.phase === 'cancelled' && <p className="warn">Cancelled safely. Consent was consumed; evaluate again to recover.</p>}
      </article>
    </section>

    <section className="grid" aria-label="Evidence and tool activity">
      <article className="panel">
        <h2>Evidence export</h2>
        <p>Exports are bounded receipts; they include no raw Q#, credentials, or provider diagnostics.</p>
        <div className="actions"><button disabled={!state.evidence || busy} onClick={() => exportEvidence('json')}>Export JSON</button><button disabled={!state.evidence || busy} onClick={() => exportEvidence('markdown')}>Export Markdown</button></div>
        <p><strong>Digest:</strong> <code>{state.evidence?.digest ?? '—'}</code></p>
      </article>
      <article className="panel">
        <h2>Invocation log <span aria-label={`${state.invocations.length} entries`}>({state.invocations.length})</span></h2>
        <ol className="log" aria-live="polite">{state.invocations.length ? state.invocations.map((entry) => <li key={entry.id}><strong>{entry.status}</strong> <code>{entry.tool}</code><span>{entry.summary}</span><small>{entry.source} · {new Date(entry.timestamp).toLocaleTimeString()}</small></li>) : <li>No invocation yet. Controls and WebMCP calls share this log with explicit source attribution.</li>}</ol>
      </article>
    </section>
    <footer><p>Accessibility: keyboard-operable scenario cards, textual statuses and reason codes, non-color state labels, visible recovery messaging.</p></footer>
  </main>
}
