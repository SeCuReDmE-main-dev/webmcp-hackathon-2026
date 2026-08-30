import { useRef } from 'react'
import { qcgSeasons, type QcgSeason } from '../season'
import type { QcgState } from '../types'

export const workflowTabs = ['Experiment', 'Agent Review', 'Human Decision', 'Evidence Receipt', 'Activity'] as const
export type WorkflowTab = (typeof workflowTabs)[number]

function shortHash(value?: string): string {
  return value ? `${value.slice(0, 12)}…${value.slice(-8)}` : '—'
}

interface HeaderProps {
  season: QcgSeason
  onSeasonChange: (season: QcgSeason) => void
  supported: boolean
  toolCount: number
  registrationStatus: 'unavailable' | 'registering' | 'registered' | 'error'
}

export function WorkbenchHeader({ season, onSeasonChange, supported, toolCount, registrationStatus }: HeaderProps) {
  const seasonRefs = useRef<Array<HTMLButtonElement | null>>([])
  function onKeyDown(index: number, event: React.KeyboardEvent<HTMLButtonElement>): void {
    let next = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % qcgSeasons.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + qcgSeasons.length) % qcgSeasons.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = qcgSeasons.length - 1
    else return
    event.preventDefault()
    onSeasonChange(qcgSeasons[next])
    seasonRefs.current[next]?.focus()
  }
  const status = !supported
    ? 'Human mode · WebMCP unavailable'
    : registrationStatus === 'registered'
      ? toolCount ? `${toolCount} native tools registered` : 'WebMCP ready · load an artifact'
      : registrationStatus === 'error' ? 'WebMCP registration needs recovery' : 'Registering WebMCP tools'
  return <header className="hero">
    <img className="seasonal-mark" src={`/seasonal/${season}.svg`} alt="" aria-hidden="true" />
    <div>
      <p className="eyebrow">WebMCP-QCG · browser-native HITL preflight</p>
      <h1>Review before you run.</h1>
      <p className="lede">I make a quantum call inspectable before compute, shots or provider budget can enter the workflow. The agent recommends; the human decides.</p>
    </div>
    <div className="hero-actions">
      <div className="season-selector" role="radiogroup" aria-label="Interface season">
        {qcgSeasons.map((option, index) => <button key={option} ref={(node) => { seasonRefs.current[index] = node }} role="radio" tabIndex={season === option ? 0 : -1} aria-checked={season === option} className={season === option ? 'selected' : ''} onClick={() => onSeasonChange(option)} onKeyDown={(event) => onKeyDown(index, event)}>{option}</button>)}
      </div>
      <p className={`status-chip ${registrationStatus === 'registered' ? 'pass' : 'caution'}`} role="status">
        <span aria-hidden="true">{registrationStatus === 'registered' ? '●' : '△'}</span>{status}
      </p>
    </div>
  </header>
}

export function SecurityRail({ state }: { state: QcgState }) {
  return <section className="security-rail" aria-label="Persistent security checks">
    <article><span className="security-icon" aria-hidden="true">#</span><div><h2>Artifact Integrity</h2><p>{state.manifest ? shortHash(state.manifest.artifact_digest) : 'Awaiting a local quantum artifact'}</p></div><strong>{state.manifest?.compiler.status ?? 'empty'}</strong></article>
    <article><span className="security-icon" aria-hidden="true">◎</span><div><h2>Target Evidence</h2><p>{state.targetProfile?.label ?? 'No target snapshot selected'}</p></div><strong>{state.targetProfile?.evidence_state ?? 'empty'}</strong></article>
    <article><span className="security-icon" aria-hidden="true">✓</span><div><h2>Authority &amp; Effects</h2><p>Agent: {state.recommendation?.decision ?? 'pending'} · Human: {state.humanDecision?.choice ?? 'pending'}</p></div><strong>{state.effects.qpu_submissions} QPU</strong></article>
  </section>
}

interface TabsProps { active: WorkflowTab; onChange: (tab: WorkflowTab) => void }
export function WorkflowTabs({ active, onChange }: TabsProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  function onKeyDown(index: number, event: React.KeyboardEvent<HTMLButtonElement>): void {
    let next = index
    if (event.key === 'ArrowRight') next = (index + 1) % workflowTabs.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + workflowTabs.length) % workflowTabs.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = workflowTabs.length - 1
    else return
    event.preventDefault()
    onChange(workflowTabs[next])
    refs.current[next]?.focus()
  }
  return <nav className="tabs" role="tablist" aria-label="QCG workflow">
    {workflowTabs.map((tab, index) => <button key={tab} ref={(node) => { refs.current[index] = node }} role="tab" aria-selected={active === tab} aria-controls={`panel-${index}`} id={`tab-${index}`} tabIndex={active === tab ? 0 : -1} onClick={() => onChange(tab)} onKeyDown={(event) => onKeyDown(index, event)}>{index + 1}. {tab}</button>)}
  </nav>
}
