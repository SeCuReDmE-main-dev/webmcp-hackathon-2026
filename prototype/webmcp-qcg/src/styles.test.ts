// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const styles = readFileSync(resolve(process.cwd(), 'src/styles.css'), 'utf8')

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
    expect(styles).toContain('.qcg-console[data-theme="light"] { --bg: #dce5e0; --panel: #edf2ef; --panel-2: #cfdcd5; --line: #6b8478; --text: #13261f; --muted: #415b4f; --emerald: #0b6b50; --emerald-hi: #0b6b50; --cyan: #086a78;')
  })

  it('keeps light text and semantic cyan/green controls above AA contrast', () => {
    expect(contrast('13261f', 'edf2ef')).toBeGreaterThanOrEqual(4.5)
    expect(contrast('415b4f', 'edf2ef')).toBeGreaterThanOrEqual(4.5)
    expect(contrast('086a78', 'edf2ef')).toBeGreaterThanOrEqual(4.5)
    expect(contrast('0b6b50', 'edf2ef')).toBeGreaterThanOrEqual(4.5)
  })

  it('reflows the top bar and two-column workbench before Companion-width overflow', () => {
    expect(styles).toContain('@media (max-width: 900px) { .console-topbar { height: auto;')
    expect(styles).toContain('.console-grid.two { grid-template-columns: minmax(0, 1fr); }')
  })

})
