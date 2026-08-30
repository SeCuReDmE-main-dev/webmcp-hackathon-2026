// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { initialState } from '../types'
import { safeConsoleCommand, sanitizedConsoleSnapshot } from './contracts'

describe('QCG console contracts', () => {
  it('uses dark/light themes and a source-free v2 snapshot', () => {
    const state = initialState()
    state.consent = { consent_id: 'not-exported', recommendation_id: 'id', created_at: '2026-08-30T00:00:00.000Z', expires_at: '2026-08-30T00:01:00.000Z', used: false }
    const snapshot = sanitizedConsoleSnapshot(state, '11111111-1111-4111-8111-111111111111', 'memory')
    expect(snapshot.surface).toBe('web')
    expect(snapshot.available_commands).not.toContain('run_bounded_local_simulation')
    expect(JSON.stringify(snapshot)).not.toContain('not-exported')
  })

  it('only accepts the bounded v1 command union', () => {
    expect(safeConsoleCommand.safeParse({ schema_version: 'qcg-console-command.v1', session_id: '11111111-1111-4111-8111-111111111111', kind: 'human_override_note', justification: 'A sufficiently justified override.' }).success).toBe(true)
    expect(safeConsoleCommand.safeParse({ schema_version: 'qcg-console-command.v1', session_id: '11111111-1111-4111-8111-111111111111', kind: 'simulate' }).success).toBe(false)
  })
})
