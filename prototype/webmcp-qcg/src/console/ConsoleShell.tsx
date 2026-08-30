import { useState, type ReactNode } from 'react'
import type { ConsoleView, QcgTheme } from './contracts'

export const consoleNavigation: Array<{ id: ConsoleView; label: string; mark: string }> = [
  { id: 'inspector', label: 'Inspector', mark: 'I' }, { id: 'console', label: 'Console', mark: 'C' },
  { id: 'webmcp', label: 'WebMCP', mark: 'M' }, { id: 'decisions', label: 'Decisions', mark: 'D' },
  { id: 'sources', label: 'Sources', mark: 'S' }, { id: 'receipts', label: 'Receipts', mark: 'R' }, { id: 'activity', label: 'Activity', mark: 'A' }
]

export function ConsoleShell({ theme, onThemeChange, view, onViewChange, children, inspector, supported, toolCount, registrationStatus, sessionId, companionStatus, onOpenCompanion }: {
  theme: QcgTheme; onThemeChange(theme: QcgTheme): void; view: ConsoleView; onViewChange(view: ConsoleView): void
  children: ReactNode; inspector: ReactNode; supported: boolean; toolCount: number; registrationStatus: string; sessionId: string; companionStatus: string; onOpenCompanion(): void
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [inspectorWidth, setInspectorWidth] = useState(360)
  const [drawerOpen, setDrawerOpen] = useState(false)
  function resize(event: React.PointerEvent<HTMLDivElement>): void {
    event.currentTarget.setPointerCapture(event.pointerId)
    const move = (pointer: PointerEvent) => setInspectorWidth(Math.max(280, Math.min(520, window.innerWidth - pointer.clientX)))
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up)
  }
  const selected = consoleNavigation.find((item) => item.id === view)?.label ?? 'Console'
  return <main className="qcg-console" data-theme={theme} style={{ '--qcg-inspector-width': `${inspectorWidth}px` } as React.CSSProperties}>
    <header className="console-topbar">
      <div className="brand"><span aria-hidden="true">Q</span><strong>QCG Console</strong></div>
      <div className="topbar-context"><span>web / local</span><code title={sessionId}>session {sessionId.slice(0, 8)}</code><span className={supported ? 'status-online' : 'status-offline'}>{supported ? `WebMCP · ${toolCount}` : 'WebMCP unavailable'}</span></div>
      <div className="topbar-actions"><button className="companion-button" onClick={onOpenCompanion}>Open Companion</button><output className="companion-status" aria-live="polite">{companionStatus}</output><button className="inspector-toggle" aria-expanded={drawerOpen} aria-controls="qcg-inspector-drawer" onClick={() => setDrawerOpen((value) => !value)}>Inspector</button><div className="theme-switch" role="group" aria-label="QCG theme"><button aria-pressed={theme === 'dark'} onClick={() => onThemeChange('dark')}>Dark</button><button aria-pressed={theme === 'light'} onClick={() => onThemeChange('light')}>Light</button></div></div>
      <span className="sr-only">{registrationStatus}</span>
    </header>
    <div className={`console-layout ${collapsed ? 'rail-collapsed' : ''} ${drawerOpen ? 'drawer-open' : ''}`}>
      <nav className="console-rail" aria-label="QCG console views">
        <button className="rail-toggle" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? 'Expand console navigation' : 'Collapse console navigation'}>{collapsed ? '›' : '‹'}</button>
        {consoleNavigation.map((item) => <button key={item.id} className={view === item.id ? 'active' : ''} aria-current={view === item.id ? 'page' : undefined} onClick={() => onViewChange(item.id)}><span aria-hidden="true">{item.mark}</span><b>{item.label}</b></button>)}
      </nav>
      <nav className="mobile-view-nav" aria-label="QCG console views">{consoleNavigation.map((item) => <button key={item.id} className={view === item.id ? 'active' : ''} aria-current={view === item.id ? 'page' : undefined} onClick={() => onViewChange(item.id)}>{item.label}</button>)}</nav>
      <section className="console-center" aria-label={`${selected} workspace`}>{children}</section>
      <div className="inspector-resize" role="separator" aria-orientation="vertical" aria-label="Resize right inspector" tabIndex={0} onPointerDown={resize} onKeyDown={(event) => { if (event.key === 'ArrowLeft') setInspectorWidth((value) => Math.min(520, value + 16)); if (event.key === 'ArrowRight') setInspectorWidth((value) => Math.max(280, value - 16)) }} />
      <aside id="qcg-inspector-drawer" className="console-inspector" aria-label="Current bounded state">{inspector}</aside>
    </div>
  </main>
}
