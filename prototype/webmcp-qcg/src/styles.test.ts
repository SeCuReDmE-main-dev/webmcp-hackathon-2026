// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const styles = readFileSync(resolve(process.cwd(), 'src/styles.css'), 'utf8')
const companionStyles = readFileSync(resolve(process.cwd(), '../../companion/qcg-devtools-extension/panel.css'), 'utf8')

function themeTokens(css: string, selector: string): Record<string, string> {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const block = css.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`))?.[1] ?? ''
  return Object.fromEntries([...block.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-f]{6})/gi)].map(([, name, value]) => [name, value.toLowerCase()]))
}

function contrast(first: string, second: string): number {
  const luminance = (hex: string) => {
    const channels = hex.match(/[a-f0-9]{2}/gi)!.map((value) => Number.parseInt(value, 16) / 255)
    const linear = channels.map((channel) => channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
  }
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a)
  return (light + 0.05) / (dark + 0.05)
}

describe('Companion-aligned web light tokens', () => {
  it('uses the low-glare sage surface family with dark readable text', () => {
    expect(styles).toContain('.qcg-console[data-theme="light"] { --bg: #dbe6ee; --panel: #edf3f7; --panel-2: #cbdbe7; --line: #293d4f; --text: #10263a; --muted: #3e566b; --emerald: #0b6b50; --emerald-hi: #0b6b50; --cyan: #086a78;')
  })

  it('keeps light text and semantic cyan/green controls above AA contrast', () => {
    expect(contrast('10263a', 'edf3f7')).toBeGreaterThanOrEqual(7)
    expect(contrast('3e566b', 'edf3f7')).toBeGreaterThanOrEqual(4.5)
    expect(contrast('086a78', 'edf3f7')).toBeGreaterThanOrEqual(4.5)
    expect(contrast('0b6b50', 'edf3f7')).toBeGreaterThanOrEqual(4.5)
  })

  it('reflows the top bar and two-column workbench before Companion-width overflow', () => {
    expect(styles).toContain('@media (max-width: 900px) { .console-topbar { height: auto;')
    expect(styles).toContain('.console-grid.two { grid-template-columns: minmax(0, 1fr); }')
  })

  it('keeps the Web and Companion palettes identical in both themes', () => {
    const names = ['bg', 'line', 'muted', 'emerald', 'cyan', 'gold', 'red', 'control-edge']
    const webDark = themeTokens(styles, '.qcg-console')
    const webLight = themeTokens(styles, '.qcg-console[data-theme="light"]')
    const companionDark = themeTokens(companionStyles, '.console')
    const companionLight = themeTokens(companionStyles, '.console[data-theme="light"]')
    expect(Object.fromEntries(names.map((name) => [name, webDark[name]]))).toEqual(Object.fromEntries(names.map((name) => [name, companionDark[name]])))
    expect(Object.fromEntries(names.map((name) => [name, webLight[name]]))).toEqual(Object.fromEntries(names.map((name) => [name, companionLight[name]])))
    expect(webDark.panel).toBe(companionDark.surface)
    expect(webDark['panel-2']).toBe(companionDark['surface-2'])
    expect(webLight.panel).toBe(companionLight.surface)
    expect(webLight['panel-2']).toBe(companionLight['surface-2'])
  })

  it('uses the optimized ambient identity without the former repeated grid', () => {
    expect(styles).toContain("url('/brand/qcg-ambient-bg.jpg')")
    expect(styles).toContain('--ambient-opacity: .24')
    expect(styles).toContain('--ambient-opacity: .20')
    expect(styles).toContain('[data-theme="dark"][data-contrast="high"] .console-center::before { display: block; opacity: .18; }')
    expect(styles).toContain('[data-theme="light"][data-contrast="high"] { --line: #314c3f; --text: #071b14; --muted: #263d32; --ambient-opacity: .035; }')
    expect(styles).toContain('[data-theme="light"][data-contrast="high"] { --line: #172b3d; --text: #071827; --muted: #263e54; --ambient-opacity: .16; }')
    expect(styles).not.toContain('[data-theme="light"][data-contrast="high"] { --bg: #ffffff')
    expect(styles).not.toContain('data:image/svg+xml')
  })

  it('retains calm light surfaces and stronger contours in high contrast mode', () => {
    expect(contrast('071827', 'edf3f7')).toBeGreaterThanOrEqual(7)
    expect(contrast('263e54', 'edf3f7')).toBeGreaterThanOrEqual(7)
    expect(styles).toContain('border-color: color-mix(in srgb, var(--line) 88%, var(--control-edge))')
    expect(styles).toContain('box-shadow: 0 1px 0 color-mix(in srgb, var(--control-edge) 18%, transparent)')
  })

  it('shares the warm-rest, cyan-hover and emerald-active control grammar', () => {
    expect(themeTokens(styles, '.qcg-console[data-theme="light"]')['control-edge']).toBe('#a75800')
    expect(themeTokens(styles, '.qcg-console[data-theme="light"]').line).toBe('#293d4f')
    expect(styles).toContain('border-color: var(--control-edge)')
    expect(styles).toContain('[data-theme="light"] button:not(.rail-backdrop) { border-width: 1px; border-style: solid;')
    expect(styles).toContain(':hover, .qcg-console .companion-download:hover { border-color: var(--cyan); }')
    expect(styles).toContain('background-color: color-mix(in srgb, var(--cyan) 12%, var(--panel-2))')
    expect(styles).toContain('box-shadow: inset 0 -2px 0 var(--cyan)')
    expect(styles).toContain(':active { border-color: var(--emerald); }')
    expect(styles).toContain('background-color: color-mix(in srgb, var(--emerald) 16%, var(--panel-2))')
    expect(companionStyles).toContain('button:not(:disabled):not(.danger) { border-color: var(--control-edge); }')
    expect(companionStyles).toContain('button:not(:disabled):hover { border-color: var(--cyan); }')
    expect(companionStyles).toContain('background-color: color-mix(in srgb, var(--cyan) 12%, var(--surface-2))')
    expect(styles).toContain('transition: background-color 180ms ease, border-color 180ms ease, color 180ms ease')
  })

})
