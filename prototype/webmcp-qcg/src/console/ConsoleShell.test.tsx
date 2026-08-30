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
  onOpenCompanion: vi.fn(),
}

beforeEach(() => {
  window.localStorage.clear()
  document.documentElement.style.fontSize = ''
})

afterEach(() => {
  document.documentElement.style.fontSize = ''
  vi.clearAllMocks()
})

describe('QCG console shell', () => {
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

  it('applies, persists and resets direct-use access preferences', async () => {
    const user = userEvent.setup()
    render(<ConsoleShell {...baseProps} onViewChange={vi.fn()} inspector={() => <p>State inspector</p>}><h1>Inspector</h1></ConsoleShell>)
    await user.click(screen.getByRole('button', { name: 'Access' }))
    const dialog = screen.getByRole('dialog', { name: 'Access preferences' })
    await user.click(within(dialog).getByRole('button', { name: '125%' }))
    await user.click(within(dialog).getByRole('checkbox', { name: 'Stronger contrast' }))
    await user.click(within(dialog).getByRole('checkbox', { name: 'Reduce motion' }))
    await user.click(within(dialog).getByRole('checkbox', { name: 'Underline controls' }))
    const console = document.querySelector('.qcg-console') as HTMLElement
    expect(document.documentElement.style.fontSize).toBe('125%')
    expect(console.dataset.contrast).toBe('high')
    expect(console.dataset.reduceMotion).toBe('true')
    expect(console.dataset.underlineControls).toBe('true')
    expect(JSON.parse(window.localStorage.getItem('qcg-accessibility-v1') ?? '{}')).toMatchObject({ textScale: '125', highContrast: true, reduceMotion: true, underlineControls: true })
    await user.click(within(dialog).getByRole('button', { name: 'Reset preferences' }))
    expect(document.documentElement.style.fontSize).toBe('100%')
    expect(console.dataset.contrast).toBe('standard')
    expect(console.dataset.reduceMotion).toBe('false')
    expect(console.dataset.underlineControls).toBe('false')
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
