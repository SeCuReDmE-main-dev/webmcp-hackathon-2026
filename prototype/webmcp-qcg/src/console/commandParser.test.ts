// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { parseConsoleLine } from './commandParser'
import { usesOnePaneConsole } from './responsive'

describe('bounded QCG console command parser', () => {
  it('accepts only the documented command grammar', () => {
    expect(parseConsoleLine('open decisions')).toEqual({ ok: true, command: { kind: 'open', view: 'decisions' } })
    expect(parseConsoleLine('filter actor=gemini kind=observation')).toEqual({ ok: true, command: { kind: 'filter', actor: 'gemini', messageKind: 'observation' } })
    expect(parseConsoleLine('export receipt markdown')).toEqual({ ok: true, command: { kind: 'export_receipt', format: 'markdown' } })
  })

  it('does not evaluate arbitrary text, simulation, or text decisions', () => {
    expect(parseConsoleLine('simulate')).toMatchObject({ ok: false })
    expect(parseConsoleLine('decision accept')).toMatchObject({ ok: false })
    expect(parseConsoleLine('window.location.href="https://example.test"')).toMatchObject({ ok: false })
  })

  it('keeps the mobile layout contract at 640px and below', () => {
    expect(usesOnePaneConsole(640)).toBe(true)
    expect(usesOnePaneConsole(641)).toBe(false)
  })
})
