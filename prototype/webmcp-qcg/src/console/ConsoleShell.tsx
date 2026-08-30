import { useState, type ReactNode } from 'react'
import type { ConsoleView, QcgTheme } from './contracts'

const views: Array<{ id: ConsoleView; label: string; mark: string }> = [
  { id: 'inspector', label: 'Inspector', mark: 'I' }, { id: 'console', label: 'Console', mark: 'C' },
  { id: 'webmcp', label: 'WebMCP', mark: 'M' }, { id: 'decisions', label: 'Decisions', mark: 'D' },
  { id: 'sources', label: 'Sources', mark: 'S' }, { id: 'receipts', label: 'Receipts', mark: 'R' }, { id: 'activity', label: 'Activity', mark: 'A' }
]

export function ConsoleShell({ theme, onThemeChange, view, onViewChange, children, inspector, supported, toolCount, registrationStatus }: {
  theme: QcgTheme; onThemeChange(theme: QcgTheme): void; view: ConsoleView; onViewChange(view: ConsoleView): void
  children: ReactNode; inspector: ReactNode; supported: boolean; toolCount: number; registrationStatus: string
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [inspectorWidth, setInspectorWidth] = useState(310)
  function resize(event: React.PointerEvent<HTMLDivElement>): void {
    event.currentTarget.setPointerCapture(event.pointerId)
    const move = (pointer: PointerEvent) => setInspectorWidth(Math.max(248, Math.min(440, window.innerWidth - pointer.clientX)))
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up)
  }
  return <main className="qcg-console" data-theme={theme} style={{ '--qcg-inspector-width': `${inspectorWidth}px` } as React.CSSProperties}>
    <header className="console-topbar">
      <div className="brand"><span aria-hidden="true">Q</span><strong>QCG Console</strong><small>bounded decision gate</small></div>
      <div className="topbar-status"><span className={supported ? 'status-online' : 'status-offline'}>{supported ? 'WebMCP ready' : 'WebMCP unavailable'}</span><span>{toolCount} tools</span><small>{registrationStatus}</small></div>
      <div className="theme-switch" role="group" aria-label="QCG theme"><button aria-pressed={theme === 'dark'} onClick={() => onThemeChange('dark')}>Dark</button><button aria-pressed={theme === 'light'} onClick={() => onThemeChange('light')}>Light</button></div>
    </header>
    <div className={`console-layout ${collapsed ? 'rail-collapsed' : ''}`}>
      <nav className="console-rail" aria-label="QCG console views">
        <button className="rail-toggle" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? 'Expand console navigation' : 'Collapse console navigation'}>{collapsed ? '›' : '‹'}</button>
        {views.map((item) => <button key={item.id} className={view === item.id ? 'active' : ''} aria-current={view === item.id ? 'page' : undefined} onClick={() => onViewChange(item.id)}><span aria-hidden="true">{item.mark}</span><b>{item.label}</b></button>)}
      </nav>
      <section className="console-center" aria-label={`${views.find((item) => item.id === view)?.label ?? 'Console'} workspace`}>{children}</section>
      <div className="inspector-resize" role="separator" aria-orientation="vertical" aria-label="Resize right inspector" tabIndex={0} onPointerDown={resize} onKeyDown={(event) => { if (event.key === 'ArrowLeft') setInspectorWidth((value) => Math.min(440, value + 16)); if (event.key === 'ArrowRight') setInspectorWidth((value) => Math.max(248, value - 16)) }} />
      <aside className="console-inspector" aria-label="Current bounded state">{inspector}</aside>
    </div>
  </main>
}
