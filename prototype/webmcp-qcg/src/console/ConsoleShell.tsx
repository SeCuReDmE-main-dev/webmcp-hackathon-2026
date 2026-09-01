import { useEffect, useState, type ReactNode } from 'react'
import type { ConsoleView, QcgTheme } from './contracts'

const QCG_ACCESSIBILITY_STORAGE_KEY = 'qcg-accessibility-v1'
type TextScale = '100' | '112' | '125'
interface AccessibilityPreferences { textScale: TextScale; highContrast: boolean; reduceMotion: boolean; underlineControls: boolean }
const defaultAccessibility: AccessibilityPreferences = { textScale: '100', highContrast: false, reduceMotion: false, underlineControls: false }

function initialAccessibility(): AccessibilityPreferences {
  try {
    const stored = JSON.parse(window.localStorage.getItem(QCG_ACCESSIBILITY_STORAGE_KEY) ?? 'null') as Partial<AccessibilityPreferences> | null
    if (!stored) return defaultAccessibility
    return {
      textScale: stored.textScale === '112' || stored.textScale === '125' ? stored.textScale : '100',
      highContrast: stored.highContrast === true,
      reduceMotion: stored.reduceMotion === true,
      underlineControls: stored.underlineControls === true,
    }
  } catch { return defaultAccessibility }
}

export const consoleNavigation: Array<{ id: ConsoleView; label: string; mark: string }> = [
  { id: 'inspector', label: 'Inspector', mark: 'I' }, { id: 'console', label: 'Console', mark: 'C' },
  { id: 'webmcp', label: 'WebMCP', mark: 'M' }, { id: 'decisions', label: 'Decisions', mark: 'D' },
  { id: 'sources', label: 'Sources', mark: 'S' }, { id: 'receipts', label: 'Receipts', mark: 'R' }, { id: 'activity', label: 'Activity', mark: 'A' }
]

export function ConsoleShell({ theme, onThemeChange, view, onViewChange, children, inspector, supported, toolCount, registrationStatus, sessionId, companionStatus, companionTriggerId, onOpenCompanion }: {
  theme: QcgTheme; onThemeChange(theme: QcgTheme): void; view: ConsoleView; onViewChange(view: ConsoleView): void
  children: ReactNode; inspector(navigate: (view: ConsoleView) => void): ReactNode; supported: boolean; toolCount: number; registrationStatus: string; sessionId: string; companionStatus: string; companionTriggerId: string; onOpenCompanion(): void
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [inspectorWidth, setInspectorWidth] = useState(360)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [accessOpen, setAccessOpen] = useState(false)
  const [accessibility, setAccessibility] = useState<AccessibilityPreferences>(initialAccessibility)
  useEffect(() => {
    try { window.localStorage.setItem(QCG_ACCESSIBILITY_STORAGE_KEY, JSON.stringify(accessibility)) } catch { /* optional browser storage */ }
    const root = document.documentElement
    const previous = root.style.fontSize
    root.style.fontSize = accessibility.textScale === '125' ? '125%' : accessibility.textScale === '112' ? '112.5%' : '100%'
    return () => { root.style.fontSize = previous }
  }, [accessibility])
  useEffect(() => {
    if (!accessOpen) return
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setAccessOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [accessOpen])
  function resize(event: React.PointerEvent<HTMLDivElement>): void {
    event.currentTarget.setPointerCapture(event.pointerId)
    const move = (pointer: PointerEvent) => setInspectorWidth(Math.max(280, Math.min(520, window.innerWidth - pointer.clientX)))
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up)
  }
  const navigateFromInspector = (nextView: ConsoleView) => {
    onViewChange(nextView)
    setDrawerOpen(false)
  }
  const selected = consoleNavigation.find((item) => item.id === view)?.label ?? 'Console'
  return <main className="qcg-console" data-theme={theme} data-contrast={accessibility.highContrast ? 'high' : 'standard'} data-reduce-motion={accessibility.reduceMotion ? 'true' : 'false'} data-underline-controls={accessibility.underlineControls ? 'true' : 'false'} style={{ '--qcg-inspector-width': `${inspectorWidth}px` } as React.CSSProperties}>
    <a className="skip-link" href="#qcg-console-workspace">Skip to workspace</a>
    <header className="console-topbar">
      <div className="brand"><span aria-hidden="true">Q</span><strong>QCG Console</strong></div>
      <div className="topbar-context"><span>web / local</span><code title={sessionId}>session {sessionId.slice(0, 8)}</code><span className={supported ? 'status-online' : 'status-offline'}>{supported ? `WebMCP · ${toolCount}` : 'WebMCP unavailable'}</span></div>
      <div className="topbar-actions"><button className="companion-button" data-qcg-open-companion={companionTriggerId} onClick={onOpenCompanion}>Open Companion</button><output className="companion-status" aria-live="polite">{companionStatus}</output><button className="inspector-toggle" aria-expanded={drawerOpen} aria-controls="qcg-inspector-drawer" onClick={() => setDrawerOpen((value) => !value)}>Inspector</button><button className="accessibility-toggle" aria-expanded={accessOpen} aria-controls="qcg-accessibility-panel" onClick={() => setAccessOpen((value) => !value)}>Access</button><div className="theme-switch" role="group" aria-label="QCG theme"><button aria-pressed={theme === 'dark'} onClick={() => onThemeChange('dark')}>Dark</button><button aria-pressed={theme === 'light'} onClick={() => onThemeChange('light')}>Light</button></div></div>
      <span className="sr-only">{registrationStatus}</span>
      {accessOpen && <section id="qcg-accessibility-panel" className="accessibility-panel" role="dialog" aria-modal="false" aria-labelledby="qcg-accessibility-title"><div className="accessibility-heading"><div><b id="qcg-accessibility-title">Access preferences</b><small>Stored in this browser only</small></div><button aria-label="Close access preferences" onClick={() => setAccessOpen(false)}>Close</button></div><fieldset><legend>Text size</legend><div className="accessibility-options">{(['100', '112', '125'] as const).map((scale) => <button key={scale} aria-pressed={accessibility.textScale === scale} onClick={() => setAccessibility((current) => ({ ...current, textScale: scale }))}>{scale === '112' ? '112.5%' : `${scale}%`}</button>)}</div></fieldset><label><input type="checkbox" checked={accessibility.highContrast} onChange={(event) => setAccessibility((current) => ({ ...current, highContrast: event.target.checked }))} /> Stronger contrast</label><label><input type="checkbox" checked={accessibility.reduceMotion} onChange={(event) => setAccessibility((current) => ({ ...current, reduceMotion: event.target.checked }))} /> Reduce motion</label><label><input type="checkbox" checked={accessibility.underlineControls} onChange={(event) => setAccessibility((current) => ({ ...current, underlineControls: event.target.checked }))} /> Underline controls</label><button className="accessibility-reset" onClick={() => setAccessibility(defaultAccessibility)}>Reset preferences</button><p>These preferences support direct use. They do not certify conformance or replace semantic HTML, keyboard access, testing, and human review.</p></section>}
    </header>
    <div className={`console-layout ${collapsed ? 'rail-collapsed' : ''} ${drawerOpen ? 'drawer-open' : ''}`}>
      <nav className="console-rail" aria-label="QCG console views">
        <button className="rail-toggle" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? 'Expand console navigation' : 'Collapse console navigation'}>{collapsed ? '›' : '‹'}</button>
        {consoleNavigation.map((item) => <button key={item.id} className={view === item.id ? 'active' : ''} aria-current={view === item.id ? 'page' : undefined} onClick={() => onViewChange(item.id)}><span aria-hidden="true">{item.mark}</span><b>{item.label}</b></button>)}
      </nav>
      <nav className="mobile-view-nav" aria-label="QCG console views">{consoleNavigation.map((item) => <button key={item.id} className={view === item.id ? 'active' : ''} aria-current={view === item.id ? 'page' : undefined} onClick={() => onViewChange(item.id)}>{item.label}</button>)}</nav>
      <section id="qcg-console-workspace" className="console-center" aria-label={`${selected} workspace`} tabIndex={-1}>{children}</section>
      <div className="inspector-resize" role="separator" aria-orientation="vertical" aria-label="Resize right inspector" tabIndex={0} onPointerDown={resize} onKeyDown={(event) => { if (event.key === 'ArrowLeft') setInspectorWidth((value) => Math.min(520, value + 16)); if (event.key === 'ArrowRight') setInspectorWidth((value) => Math.max(280, value - 16)) }} />
      <aside id="qcg-inspector-drawer" className="console-inspector" aria-label="Current bounded state">{inspector(navigateFromInspector)}</aside>
    </div>
  </main>
}
