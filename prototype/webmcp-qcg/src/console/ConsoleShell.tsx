import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { ConsoleView, QcgTheme } from './contracts'

const QCG_ACCESSIBILITY_STORAGE_KEY = 'qcg-accessibility-v1'
type TextScale = '100' | '112' | '125'
type AccessibilityProfile = 'base' | 'autism-calm' | 'adhd-sprint' | 'deep-work'
export type CompanionSetupMode = 'production' | 'development'
interface AccessibilityPreferences { profile: AccessibilityProfile; textScale: TextScale; highContrast: boolean; reduceMotion: boolean; underlineControls: boolean }
const accessibilityProfiles: Array<{ id: AccessibilityProfile; label: string }> = [
  { id: 'base', label: 'Base' }, { id: 'autism-calm', label: 'Autism Calm' },
  { id: 'adhd-sprint', label: 'ADHD Sprint' }, { id: 'deep-work', label: 'Deep Work' }
]
const defaultAccessibility: AccessibilityPreferences = { profile: 'base', textScale: '100', highContrast: false, reduceMotion: false, underlineControls: false }
const compactConsoleQuery = '(max-width: 1100px)'
const isCompactConsole = (): boolean => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(compactConsoleQuery).matches
const companionPackages = {
  production: {
    href: '/qcg-console-companion-0.2.4.zip',
    sha256: '5F5EC558D3D7AE9286B57C48E1E9DBBB12943BB5DB2BF5BE93D7C5976B92926F',
    label: 'Production · qcg.securedme.ca',
  },
  development: {
    href: '/qcg-console-companion-dev-0.2.4.zip',
    sha256: 'E2294C3C23DD551A950FCD7478D266AFC67468D664552268267160DDC5D99D34',
    label: 'Development · localhost and qcg.securedme.ca',
  },
} as const

function initialAccessibility(): AccessibilityPreferences {
  try {
    const stored = JSON.parse(window.localStorage.getItem(QCG_ACCESSIBILITY_STORAGE_KEY) ?? 'null') as Partial<AccessibilityPreferences> | null
    if (!stored) return defaultAccessibility
    return {
      profile: accessibilityProfiles.some((item) => item.id === stored.profile) ? stored.profile as AccessibilityProfile : 'base',
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

export function ConsoleShell({ theme, onThemeChange, view, onViewChange, children, inspector, supported, toolCount, registrationStatus, sessionId, companionStatus, companionOpen = false, companionTriggerId, companionSetupMode = 'production', companionSetupOpen = false, onOpenCompanion, onCloseCompanionSetup = () => undefined }: {
  theme: QcgTheme; onThemeChange(theme: QcgTheme): void; view: ConsoleView; onViewChange(view: ConsoleView): void
  children: ReactNode; inspector(navigate: (view: ConsoleView) => void): ReactNode; supported: boolean; toolCount: number; registrationStatus: string; sessionId: string; companionStatus: string; companionOpen?: boolean; companionTriggerId: string; companionSetupMode?: CompanionSetupMode; companionSetupOpen?: boolean; onOpenCompanion(): void; onCloseCompanionSetup?: () => void
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [compactLayout, setCompactLayout] = useState(isCompactConsole)
  const [railMenuOpen, setRailMenuOpen] = useState(false)
  const [inspectorWidth, setInspectorWidth] = useState(360)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [accessOpen, setAccessOpen] = useState(false)
  const [extensionAddressStatus, setExtensionAddressStatus] = useState('')
  const [accessibility, setAccessibility] = useState<AccessibilityPreferences>(initialAccessibility)
  const companionSetupHeading = useRef<HTMLHeadingElement>(null)
  const companionPackage = companionPackages[companionSetupMode]
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const media = window.matchMedia(compactConsoleQuery)
    const update = () => setCompactLayout(media.matches)
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])
  useEffect(() => {
    if (!compactLayout) setRailMenuOpen(false)
  }, [compactLayout])
  useEffect(() => {
    if (!railMenuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setRailMenuOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [railMenuOpen])
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
  useEffect(() => {
    if (!companionSetupOpen) { setExtensionAddressStatus(''); return }
    companionSetupHeading.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onCloseCompanionSetup() }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [companionSetupOpen, onCloseCompanionSetup])
  async function copyExtensionAddress(): Promise<void> {
    try { await navigator.clipboard.writeText('chrome://extensions'); setExtensionAddressStatus('Address copied') }
    catch { setExtensionAddressStatus('Copy unavailable · type chrome://extensions') }
  }
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
  const navigateFromRail = (nextView: ConsoleView) => {
    onViewChange(nextView)
    setRailMenuOpen(false)
  }
  const selected = consoleNavigation.find((item) => item.id === view)?.label ?? 'Console'
  const profileReducesMotion = accessibility.profile === 'autism-calm' || accessibility.profile === 'deep-work'
  return <main className="qcg-console" data-theme={theme} data-access-profile={accessibility.profile} data-contrast={accessibility.highContrast ? 'high' : 'standard'} data-reduce-motion={accessibility.reduceMotion || profileReducesMotion ? 'true' : 'false'} data-underline-controls={accessibility.underlineControls ? 'true' : 'false'} style={{ '--qcg-inspector-width': `${inspectorWidth}px` } as React.CSSProperties}>
    <a className="skip-link" href="#qcg-console-workspace">Skip to workspace</a>
    <header className="console-topbar">
      {compactLayout ? <button className="brand brand-nav-toggle" type="button" aria-label={railMenuOpen ? 'Close console navigation' : 'Open console navigation'} aria-expanded={railMenuOpen} aria-controls="qcg-console-navigation" onClick={() => setRailMenuOpen((value) => !value)}><img src="/brand/qcg-icon-32.png" width="25" height="25" alt="" aria-hidden="true" /><strong>QCG Console</strong></button> : <div className="brand"><img src="/brand/qcg-icon-32.png" width="25" height="25" alt="" aria-hidden="true" /><strong>QCG Console</strong></div>}
      <div className="topbar-context"><span>web / local</span><code title={sessionId}>session {sessionId.slice(0, 8)}</code><span className={supported ? 'status-online' : 'status-offline'}>{supported ? `WebMCP · ${toolCount}` : 'WebMCP unavailable'}</span></div>
      <div className="topbar-actions"><button className="companion-button companion-desktop-control" data-qcg-open-companion={companionTriggerId} data-qcg-companion-action={companionOpen ? 'close' : 'open'} aria-pressed={companionOpen} onClick={onOpenCompanion}>{companionOpen ? 'Close' : 'Open'} Companion</button><span className="companion-mobile-note" role="note" aria-label="Companion availability">Companion · desktop</span><output className="companion-status" aria-live="polite">{companionStatus}</output><button className="inspector-toggle" aria-expanded={drawerOpen} aria-controls="qcg-inspector-drawer" onClick={() => setDrawerOpen((value) => !value)}>Inspector</button><button className="accessibility-toggle" aria-expanded={accessOpen} aria-controls="qcg-accessibility-panel" onClick={() => setAccessOpen((value) => !value)}>Access</button><div className="theme-switch" role="group" aria-label="QCG theme"><button aria-pressed={theme === 'dark'} onClick={() => onThemeChange('dark')}>Dark</button><button aria-pressed={theme === 'light'} onClick={() => onThemeChange('light')}>Light</button></div></div>
      <span className="sr-only">{registrationStatus}</span>
      {accessOpen && <section id="qcg-accessibility-panel" className="accessibility-panel" role="dialog" aria-modal="false" aria-labelledby="qcg-accessibility-title"><div className="accessibility-heading"><div><b id="qcg-accessibility-title">Access preferences</b><small>Stored in this browser only</small></div><button aria-label="Close access preferences" onClick={() => setAccessOpen(false)}>Close</button></div><fieldset><legend>Reading profile</legend><div className="accessibility-profile-row">{accessibilityProfiles.map((profile) => <button key={profile.id} aria-pressed={accessibility.profile === profile.id} onClick={() => setAccessibility((current) => ({ ...current, profile: profile.id }))}>{profile.label}</button>)}</div></fieldset><label>Text size<select aria-label="Text size" value={accessibility.textScale} onChange={(event) => setAccessibility((current) => ({ ...current, textScale: event.target.value as TextScale }))}><option value="100">100%</option><option value="112">112.5%</option><option value="125">125%</option></select></label><label><input type="checkbox" checked={accessibility.highContrast} onChange={(event) => setAccessibility((current) => ({ ...current, highContrast: event.target.checked }))} /> Stronger contrast</label><label><input type="checkbox" checked={accessibility.reduceMotion} onChange={(event) => setAccessibility((current) => ({ ...current, reduceMotion: event.target.checked }))} /> Reduce motion</label><label><input type="checkbox" checked={accessibility.underlineControls} onChange={(event) => setAccessibility((current) => ({ ...current, underlineControls: event.target.checked }))} /> Underline controls</label><button className="accessibility-reset" onClick={() => setAccessibility(defaultAccessibility)}>Reset preferences</button><p>Reading profiles adjust presentation only. These controls do not replace semantic structure, keyboard testing or human review.</p></section>}
    </header>
    <div className={`console-layout ${collapsed ? 'rail-collapsed' : ''} ${drawerOpen ? 'drawer-open' : ''} ${railMenuOpen ? 'rail-menu-open' : ''}`}>
      {compactLayout && railMenuOpen && <button className="rail-backdrop" type="button" aria-label="Close console navigation" onClick={() => setRailMenuOpen(false)} />}
      {(!compactLayout || railMenuOpen) && <nav id="qcg-console-navigation" className="console-rail" aria-label="QCG console views">
        <button className="rail-toggle" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? 'Expand console navigation' : 'Collapse console navigation'}>{collapsed ? '›' : '‹'}</button>
        {consoleNavigation.map((item) => <button key={item.id} className={view === item.id ? 'active' : ''} aria-current={view === item.id ? 'page' : undefined} onClick={() => navigateFromRail(item.id)}><span aria-hidden="true">{item.mark}</span><b>{item.label}</b></button>)}
      </nav>}
      {compactLayout && !railMenuOpen && <nav className="mobile-view-nav" aria-label="QCG console views">{consoleNavigation.map((item) => <button key={item.id} className={view === item.id ? 'active' : ''} aria-current={view === item.id ? 'page' : undefined} onClick={() => onViewChange(item.id)}>{item.label}</button>)}</nav>}
      <section id="qcg-console-workspace" className="console-center" aria-label={`${selected} workspace`} tabIndex={-1}>{children}</section>
      <div className="inspector-resize" role="separator" aria-orientation="vertical" aria-label="Resize right inspector" tabIndex={0} onPointerDown={resize} onKeyDown={(event) => { if (event.key === 'ArrowLeft') setInspectorWidth((value) => Math.min(520, value + 16)); if (event.key === 'ArrowRight') setInspectorWidth((value) => Math.max(280, value - 16)) }} />
      <aside id="qcg-inspector-drawer" className="console-inspector" aria-label="Current bounded state">{inspector(navigateFromInspector)}</aside>
    </div>
    {companionSetupOpen && <div className="companion-setup-backdrop" onMouseDown={(event) => { if (event.currentTarget === event.target) onCloseCompanionSetup() }}>
      <section className="companion-setup" role="dialog" aria-modal="true" aria-labelledby="qcg-companion-setup-title">
        <div className="companion-setup-heading"><div><span>Optional browser surface</span><h2 id="qcg-companion-setup-title" ref={companionSetupHeading} tabIndex={-1}>Install QCG Companion</h2></div><button aria-label="Close Companion setup" onClick={onCloseCompanionSetup}>Close</button></div>
        <p>QCG already works in this page. Companion adds the synchronized Chrome side panel and the QCG panel in F12.</p>
        <ol>
          <li><b>Download and extract</b><a className="companion-download" href={companionPackage.href} download>Download Companion 0.2.4 · 21 KB</a><small>{companionPackage.label}</small><small>SHA-256 <code>{companionPackage.sha256}</code></small></li>
          <li><b>Load it once in Chrome</b><div className="extension-address"><code>chrome://extensions</code><button onClick={() => void copyExtensionAddress()}>Copy address</button></div><small>Open that address, enable Developer mode, select Load unpacked, then choose the extracted folder containing <code>manifest.json</code>.</small>{extensionAddressStatus && <output aria-live="polite">{extensionAddressStatus}</output>}</li>
          <li><b>Reconnect QCG</b><small>Return here, reload the page, then retry. Open F12 and select QCG when you want the DevTools surface.</small></li>
        </ol>
        <div className="companion-setup-actions"><button className="primary" data-qcg-open-companion={companionTriggerId} data-qcg-companion-action="open" onClick={onOpenCompanion}>Retry connection</button><button onClick={onCloseCompanionSetup}>Continue without Companion</button></div>
        <p className="companion-boundary">Chrome requires this final human installation step for unpacked extensions. QCG never installs browser software silently and never blocks the main workbench when Companion is absent.</p>
      </section>
    </div>}
  </main>
}
