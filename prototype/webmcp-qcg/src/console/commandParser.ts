import { consoleViews, type ConsoleView } from './contracts'

export type ConsoleHandoffIntent = 'debug' | 'search' | 'find' | 'brainstorm' | 'decision'
export type ConsoleLineCommand =
  | { kind: 'help' }
  | { kind: 'inspect' }
  | { kind: 'evaluate' }
  | { kind: 'open'; view: ConsoleView }
  | { kind: 'filter'; actor: string; messageKind: string }
  | { kind: 'handoff'; intent: ConsoleHandoffIntent }
  | { kind: 'export_receipt'; format: 'json' | 'markdown' }
  | { kind: 'clear_view' }

const intents = ['debug', 'search', 'find', 'brainstorm', 'decision'] as const
const token = '[a-z][a-z0-9_-]{0,31}'
const filterLine = new RegExp(`^filter actor=(${token}) kind=(${token})$`)

/** Parses a deliberately finite console grammar. It never evaluates text. */
export function parseConsoleLine(raw: string): { ok: true; command: ConsoleLineCommand } | { ok: false; error: string } {
  const line = raw.trim().toLowerCase()
  if (!line || line.length > 160) return { ok: false, error: 'Enter one bounded command (160 characters maximum).' }
  if (line === 'help') return { ok: true, command: { kind: 'help' } }
  if (line === 'inspect') return { ok: true, command: { kind: 'inspect' } }
  if (line === 'evaluate') return { ok: true, command: { kind: 'evaluate' } }
  if (line === 'clear-view') return { ok: true, command: { kind: 'clear_view' } }
  const open = /^open ([a-z]+)$/.exec(line)
  if (open) return (consoleViews as readonly string[]).includes(open[1])
    ? { ok: true, command: { kind: 'open', view: open[1] as ConsoleView } }
    : { ok: false, error: 'Unknown console view.' }
  const filter = filterLine.exec(line)
  if (filter) return { ok: true, command: { kind: 'filter', actor: filter[1], messageKind: filter[2] } }
  const handoff = /^handoff ([a-z]+)$/.exec(line)
  if (handoff) return (intents as readonly string[]).includes(handoff[1])
    ? { ok: true, command: { kind: 'handoff', intent: handoff[1] as ConsoleHandoffIntent } }
    : { ok: false, error: 'Handoff intent must be debug, search, find, brainstorm, or decision.' }
  const exportReceipt = /^export receipt (json|markdown)$/.exec(line)
  if (exportReceipt) return { ok: true, command: { kind: 'export_receipt', format: exportReceipt[1] as 'json' | 'markdown' } }
  return { ok: false, error: 'Unknown command. Type help for the bounded grammar.' }
}
