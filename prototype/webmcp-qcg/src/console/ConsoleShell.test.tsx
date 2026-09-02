import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ConsoleShell, consoleNavigation } from './ConsoleShell'

const baseProps = {
  theme: 'dark' as const,
  onThemeChange: vi.fn(),
  view: 'inspector' as const,
  supported: false,
  toolCount: 0,
  registrationStatus: 'unsupported',
  sessionId: 'session-12345678',
  companionStatus: 'Companion not requested',
  companionTriggerId: '7310b1d5-2f9f-45a9-9f77-55f73d1f5189',
  onOpenCompanion: vi.fn(),
}
const originalMatchMedia = window.matchMedia

function mockCompactViewport(matches: boolean): void {
  Object.defineProperty(window, 'matchMedia', { configurable: true, writable: true, value: vi.fn().mockImplementation(() => ({ matches, media: '(max-width: 1100px)', onchange: null, addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn() })) })
}

beforeEach(() => {
  mockCompactViewport(false)
  window.localStorage.clear()
  document.documentElement.style.fontSize = ''
})

afterEach(() => {
  Object.defineProperty(window, 'matchMedia', { configurable: true, writable: true, value: originalMatchMedia })
  document.documentElement.style.fontSize = ''
  vi.clearAllMocks()
})

describe('QCG console shell', () => {
  it('marks the companion button with the bounded extension handshake id', () => {
    render(<ConsoleShell {...baseProps} onViewChange={vi.fn()} inspector={() => <p>State inspector</p>}><h1>Inspector</h1></ConsoleShell>)
    const button = screen.getByRole('button', { name: 'Open Companion' })
    expect(button.classList.contains('companion-desktop-control')).toBe(true)
    expect(button.getAttribute('data-qcg-open-companion')).toBe(baseProps.companionTriggerId)
    expect(button.getAttribute('data-qcg-companion-action')).toBe('open')
    expect(button.getAttribute('aria-pressed')).toBe('false')
    const mobileNote = screen.getByRole('note', { name: 'Companion availability' })
    expect(mobileNote.classList.contains('companion-mobile-note')).toBe(true)
    expect(mobileNote.textContent).toBe('Companion · desktop')
    expect(mobileNote.tagName).toBe('SPAN')
  })

  it('presents the same trusted control as a close action when Companion is open', () => {
    render(<ConsoleShell {...baseProps} companionOpen onViewChange={vi.fn()} inspector={() => <p>State inspector</p>}><h1>Inspector</h1></ConsoleShell>)
    const button = screen.getByRole('button', { name: 'Close Companion' })
    expect(button.getAttribute('data-qcg-open-companion')).toBe(baseProps.companionTriggerId)
    expect(button.getAttribute('data-qcg-companion-action')).toBe('close')
    expect(button.getAttribute('aria-pressed')).toBe('true')
  })

  it('offers a bounded three-step Companion install path when the extension is absent', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<ConsoleShell {...baseProps} companionSetupOpen onCloseCompanionSetup={onClose} onViewChange={vi.fn()} inspector={() => <p>State inspector</p>}><h1>Inspector</h1></ConsoleShell>)
    const dialog = screen.getByRole('dialog', { name: 'Install QCG Companion' })
    expect(within(dialog).getByRole('link', { name: /Download Companion 0.2.4/ }).getAttribute('href')).toBe('/qcg-console-companion-0.2.4.zip')
    expect(within(dialog).getAllByRole('listitem')).toHaveLength(3)
    const retry = within(dialog).getByRole('button', { name: 'Retry connection' })
    expect(retry.getAttribute('data-qcg-open-companion')).toBe(baseProps.companionTriggerId)
    expect(retry.getAttribute('data-qcg-companion-action')).toBe('open')
    await user.click(within(dialog).getByRole('button', { name: 'Continue without Companion' }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('offers the localhost-enabled Companion package in development mode', () => {
    render(<ConsoleShell {...baseProps} companionSetupMode="development" companionSetupOpen onViewChange={vi.fn()} inspector={() => <p>State inspector</p>}><h1>Inspector</h1></ConsoleShell>)
    const dialog = screen.getByRole('dialog', { name: 'Install QCG Companion' })
    expect(within(dialog).getByRole('link', { name: /Download Companion 0.2.4/ }).getAttribute('href')).toBe('/qcg-console-companion-dev-0.2.4.zip')
    expect(within(dialog).getByText('Development · localhost and qcg.securedme.ca')).toBeTruthy()
  })

  it('gives every left-rail view a real central navigation action', async () => {
    const user = userEvent.setup()
    const onViewChange = vi.fn()
    const view = render(<ConsoleShell {...baseProps} onViewChange={onViewChange} inspector={() => <p>State inspector</p>}><h1>Inspector</h1></ConsoleShell>)
    const rail = view.container.querySelector('.console-rail') as HTMLElement
    for (const item of consoleNavigation) {
      await user.click(within(rail).getByRole('button', { name: item.label }))
      expect(onViewChange).toHaveBeenLastCalledWith(item.id)
    }
    expect(onViewChange).toHaveBeenCalledTimes(7)
  })

  it('opens the left navigation from the QCG brand when Companion compresses the viewport', async () => {
    mockCompactViewport(true)
    const user = userEvent.setup()
    const onViewChange = vi.fn()
    const rendered = render(<ConsoleShell {...baseProps} onViewChange={onViewChange} inspector={() => <p>State inspector</p>}><h1>Inspector</h1></ConsoleShell>)
    const toggle = screen.getByRole('button', { name: 'Open console navigation' })
    await user.click(toggle)
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    expect(rendered.container.querySelector('.console-layout')?.classList.contains('rail-menu-open')).toBe(true)
    const rail = rendered.container.querySelector('.console-rail') as HTMLElement
    await user.click(within(rail).getByRole('button', { name: 'Activity' }))
    expect(onViewChange).toHaveBeenCalledWith('activity')
    expect(rendered.container.querySelector('.console-layout')?.classList.contains('rail-menu-open')).toBe(false)
  })

  it('exposes only one compact navigation to assistive technology at a time', async () => {
    mockCompactViewport(true)
    const user = userEvent.setup()
    render(<ConsoleShell {...baseProps} onViewChange={vi.fn()} inspector={() => <p>State inspector</p>}><h1>Inspector</h1></ConsoleShell>)
    expect(screen.getAllByRole('navigation', { name: 'QCG console views' })).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: 'Open console navigation' }))
    expect(screen.getAllByRole('navigation', { name: 'QCG console views' })).toHaveLength(1)
  })

  it('matches Companion reading profiles and persists the existing direct-use access controls', async () => {
    const user = userEvent.setup()
    render(<ConsoleShell {...baseProps} onViewChange={vi.fn()} inspector={() => <p>State inspector</p>}><h1>Inspector</h1></ConsoleShell>)
    await user.click(screen.getByRole('button', { name: 'Access' }))
    const dialog = screen.getByRole('dialog', { name: 'Access preferences' })
    expect(within(dialog).getByRole('group', { name: 'Reading profile' })).toBeTruthy()
    for (const name of ['Base', 'Autism Calm', 'ADHD Sprint', 'Deep Work']) expect(within(dialog).getByRole('button', { name })).toBeTruthy()
    await user.click(within(dialog).getByRole('button', { name: 'Autism Calm' }))
    await user.selectOptions(within(dialog).getByRole('combobox', { name: 'Text size' }), '125')
    await user.click(within(dialog).getByRole('checkbox', { name: 'Stronger contrast' }))
    await user.click(within(dialog).getByRole('checkbox', { name: 'Reduce motion' }))
    await user.click(within(dialog).getByRole('checkbox', { name: 'Underline controls' }))
    const console = document.querySelector('.qcg-console') as HTMLElement
    expect(document.documentElement.style.fontSize).toBe('125%')
    expect(console.dataset.accessProfile).toBe('autism-calm')
    expect(console.dataset.contrast).toBe('high')
    expect(console.dataset.reduceMotion).toBe('true')
    expect(console.dataset.underlineControls).toBe('true')
    expect(JSON.parse(window.localStorage.getItem('qcg-accessibility-v1') ?? '{}')).toMatchObject({ profile: 'autism-calm', textScale: '125', highContrast: true, reduceMotion: true, underlineControls: true })
    await user.click(within(dialog).getByRole('button', { name: 'Reset preferences' }))
    expect(document.documentElement.style.fontSize).toBe('100%')
    expect(console.dataset.accessProfile).toBe('base')
    expect(console.dataset.contrast).toBe('standard')
    expect(console.dataset.reduceMotion).toBe('false')
    expect(console.dataset.underlineControls).toBe('false')
  })

  it('hydrates a persisted reading profile and text-size select from browser-local storage', async () => {
    window.localStorage.setItem('qcg-accessibility-v1', JSON.stringify({ profile: 'deep-work', textScale: '112', highContrast: true, reduceMotion: false, underlineControls: true }))
    const user = userEvent.setup()
    render(<ConsoleShell {...baseProps} onViewChange={vi.fn()} inspector={() => <p>State inspector</p>}><h1>Inspector</h1></ConsoleShell>)
    await user.click(screen.getByRole('button', { name: 'Access' }))
    const dialog = screen.getByRole('dialog', { name: 'Access preferences' })
    expect(within(dialog).getByRole('button', { name: 'Deep Work' }).getAttribute('aria-pressed')).toBe('true')
    expect((within(dialog).getByRole('combobox', { name: 'Text size' }) as HTMLSelectElement).value).toBe('112')
    const console = document.querySelector('.qcg-console') as HTMLElement
    expect(console.dataset.reduceMotion).toBe('true')
    expect(console.dataset.contrast).toBe('high')
  })

  it('renders the bounded workflow as non-interactive, textual state badges', () => {
    render(<ConsoleShell {...baseProps} workflowStatuses={{ trust: 'completed', inspect: 'completed', decide: 'current', verify: 'locked', execute: 'locked' }} onViewChange={vi.fn()} inspector={() => <p>State inspector</p>}><h1>Inspector</h1></ConsoleShell>)
    const workflow = screen.getByRole('region', { name: 'QCG bounded workflow' })
    expect(within(workflow).getAllByRole('listitem')).toHaveLength(5)
    expect(within(workflow).getByText('Trust').closest('li')?.textContent).toContain('completed')
    expect(within(workflow).getByText('Decide').closest('li')?.getAttribute('aria-current')).toBe('step')
    expect(within(workflow).getByText('Execute').closest('li')?.getAttribute('title')).toBe('Bounded local execution only')
    expect(within(workflow).queryAllByRole('button')).toHaveLength(0)
  })

  it('integrates Access below the top bar and restores focus when Escape closes it', async () => {
    const user = userEvent.setup()
    render(<ConsoleShell {...baseProps} onViewChange={vi.fn()} inspector={() => <p>State inspector</p>}><h1>Inspector</h1></ConsoleShell>)
    const toggle = screen.getByRole('button', { name: 'Access' })
    await user.click(toggle)
    const panel = screen.getByRole('dialog', { name: 'Access preferences' })
    expect(panel.previousElementSibling?.tagName).toBe('HEADER')
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: 'Access preferences' })).toBeNull()
    expect(document.activeElement).toBe(toggle)
  })

  it('closes the inspector drawer after a contextual jump', async () => {
    const user = userEvent.setup()
    const onViewChange = vi.fn()
    render(<ConsoleShell {...baseProps} onViewChange={onViewChange} inspector={(navigate) => <button onClick={() => navigate('activity')}>Open Activity</button>}><h1>Inspector</h1></ConsoleShell>)
    const toggle = screen.getByRole('button', { name: 'Inspector', expanded: false })
    await user.click(toggle)
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    await user.click(screen.getByRole('button', { name: 'Open Activity' }))
    expect(onViewChange).toHaveBeenCalledWith('activity')
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
  })
})
