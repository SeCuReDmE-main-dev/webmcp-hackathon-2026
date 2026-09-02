(() => {
  const forbidden = /(?:-----BEGIN|\b(?:api[_-]?key|client[_-]?secret|access[_-]?token|password)\b|\b(?:bearer|token)\s+[A-Za-z0-9._-]{12,}|\b(?:sk|rk|pk)-[A-Za-z0-9_-]{16,}\b|\b(?:gh[pousr]|github_pat)_[A-Za-z0-9_]{20,}\b|\bAIza[0-9A-Za-z_-]{20,}\b|\bxox[baprs]-[A-Za-z0-9-]{10,}\b|\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b|[A-Z]:[\\/]|\\\\[^\\\s]+\\|\/(?:home|Users|private|root|etc|var|opt|tmp)\/|file:\/\/|https?:\/\/|\b(?:stack|trace|body)\b|\bOPENQASM\s+\d(?:\.\d+)?\s*;|\bqreg\s+\w+\s*\[|\bnamespace\s+\w+|\boperation\s+\w+\s*\()/i
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  const identifier = /^[a-z0-9][a-z0-9_-]{2,63}$/i
  const schemas = new Set(['qcg-console-snapshot.v2', 'qcg-devtools-context.v1', 'qcg-console-context.v1'])
  const phases = new Set(['empty', 'partial', 'active', 'cancelled', 'error', 'recovery', 'unavailable'])
  const authorities = new Set(['ready', 'consent_required', 'authorized', 'expired', 'revoked', 'consumed', 'unavailable'])
  const commands = new Set(['human_decision', 'human_review_disposition', 'human_memory_disposition', 'human_message', 'human_override_note', 'gemini_manual_handoff_create', 'gemini_manual_reply_preview', 'gemini_manual_reply_import', 'export_debug_handoff'])
  const toolGroups = new Map([
    ['inspect_quantum_experiment', 'quantum'], ['evaluate_quantum_call', 'quantum'],
    ['run_bounded_local_simulation', 'quantum'], ['export_quantum_evidence_report', 'quantum'],
    ['read_debug_context', 'collaboration'], ['post_debug_message', 'collaboration'],
    ['request_human_review', 'collaboration'], ['export_debug_handoff', 'collaboration']
  ])
  const toolStatuses = new Set(['registered', 'available'])

  function plain(value) { return Boolean(value) && typeof value === 'object' && !Array.isArray(value) }
  function text(value, max = 260) {
    if (typeof value !== 'string') return undefined
    const cleaned = value.normalize('NFC').replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e]/g, '').trim().slice(0, max)
    return cleaned && !forbidden.test(cleaned) ? cleaned : undefined
  }
  function enumText(value, allowed) { const cleaned = text(value, 80); return cleaned && allowed.has(cleaned) ? cleaned : undefined }
  function boundedNumber(value) { return Number.isSafeInteger(value) && value >= 0 && value <= 1_000_000_000 ? value : undefined }
  function identifierText(value) { const cleaned = text(value, 80); return cleaned && identifier.test(cleaned) ? cleaned : undefined }
  function uuidText(value) { const cleaned = text(value, 36); return cleaned && uuid.test(cleaned) ? cleaned : undefined }
  function strings(value, maxItems = 12, maxLength = 220) { return Array.isArray(value) ? value.slice(0, maxItems).map((item) => text(item, maxLength) ?? '[redacted]').filter(Boolean) : [] }

  function artifact(value) {
    if (!plain(value)) return undefined
    const result = {
      id: identifierText(value.id), digest: text(value.digest, 64), format: identifierText(value.format),
      profile: identifierText(value.profile), compiler_status: text(value.compiler_status ?? value.compiler, 40)
    }
    return Object.values(result).some(Boolean) ? compact(result) : undefined
  }
  function recommendation(value) {
    if (!plain(value)) return undefined
    const result = {
      id: identifierText(value.id ?? value.recommendation_id), decision: identifierText(value.decision), confidence: text(value.confidence, 20),
      reason_codes: strings(value.reason_codes, 8, 64), expires_at: text(value.expires_at, 40)
    }
    return result.id ? compact(result) : undefined
  }
  function effects(value) {
    if (!plain(value)) return {}
    const result = {}
    for (const key of ['inspections', 'evaluations', 'local_simulations', 'metadata_validations', 'qpu_submissions', 'evidence_exports']) {
      const item = boundedNumber(value[key]); if (item !== undefined) result[key] = item
    }
    return result
  }
  function receipt(value) {
    if (!plain(value)) return undefined
    const result = { id: identifierText(value.id), digest: text(value.digest, 64), schema_version: text(value.schema_version, 80) }
    return result.id ? compact(result) : undefined
  }
  function participant(value) {
    if (!plain(value)) return undefined
    const actor = identifierText(value.actor); const role = text(value.role, 80)
    return actor && role ? { actor, role } : undefined
  }
  function message(value) {
    if (!plain(value)) return undefined
    const event_id = uuidText(value.event_id); const summary = text(value.summary, 1200)
    if (!event_id || !summary) return undefined
    return compact({
      event_id, actor: identifierText(value.actor), role: text(value.role, 80), intent: identifierText(value.intent), transport: identifierText(value.transport),
      kind: identifierText(value.kind), summary, requested_action: text(value.requested_action, 300), evidence_refs: strings(value.evidence_refs, 12, 220),
      confidence: text(value.confidence, 20), status: text(value.status, 24), identity_assurance: text(value.identity_assurance, 24), issued_at: text(value.issued_at, 40)
    })
  }
  function memory(value) {
    if (!plain(value)) return undefined
    const memory_id = uuidText(value.memory_id); const provenance_event_id = uuidText(value.provenance_event_id); const digest = text(value.digest, 64)
    return memory_id && provenance_event_id && digest ? compact({ memory_id, disposition: text(value.disposition, 20), provenance_event_id, digest, created_at: text(value.created_at, 40) }) : undefined
  }
  function invocation(value) {
    if (!plain(value)) return undefined
    const tool = identifierText(value.tool); const summary = text(value.summary, 500)
    return tool && summary ? compact({ tool, status: text(value.status, 24), timestamp: text(value.timestamp, 40), summary }) : undefined
  }
  function tool(value) {
    if (!plain(value)) return undefined
    const name = identifierText(value.name)
    const expectedGroup = name ? toolGroups.get(name) : undefined
    const group = enumText(value.group, new Set(['quantum', 'collaboration']))
    const status = enumText(value.status, toolStatuses)
    return expectedGroup && group === expectedGroup && status ? compact({ name, group, status, last_invocation: text(value.last_invocation, 500) }) : undefined
  }
  function lastCommand(value) {
    if (!plain(value)) return undefined
    const command_id = uuidText(value.command_id)
    return command_id ? compact({ command_id, status: text(value.status, 24), message: text(value.message, 260) }) : undefined
  }
  function compact(value) { return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) }
  function list(value, mapper, max = 50) { return Array.isArray(value) ? value.slice(0, max).map(mapper).filter(Boolean) : [] }

  function sanitizeSnapshot(value) {
    if (!plain(value)) return null
    const schema_version = text(value.schema_version, 80)
    const session_id = uuidText(value.session_id)
    const phase = enumText(value.phase, phases)
    const authority_state = enumText(value.authority_state, authorities)
    if (!schema_version || !schemas.has(schema_version) || !session_id || !phase || !authority_state) return null
    const collaboration = plain(value.collaboration) ? value.collaboration : {}
    const participants = list(value.participants ?? collaboration.participants, participant, 20)
    const messages = list(value.messages ?? collaboration.messages, message)
    const result = {
      schema_version, surface: enumText(value.surface, new Set(['web', 'devtools', 'sidepanel'])), session_id, phase, authority_state,
      artifact: artifact(value.artifact), recommendation: recommendation(value.recommendation), effects: effects(value.effects), receipt: receipt(value.receipt),
      storage_mode: enumText(value.storage_mode, new Set(['indexeddb', 'memory'])),
      available_commands: Array.isArray(value.available_commands) ? value.available_commands.slice(0, 20).map((item) => typeof item === 'string' ? item : item?.kind ?? item?.name).filter((item) => commands.has(item)) : [],
      invocations: list(value.invocations, invocation), participants, messages,
      human_review_requests: list(value.human_review_requests, message), memories: list(value.memories, memory, 50),
      last_command: lastCommand(value.last_command), tools: list(value.tools, tool, 8)
    }
    return compact(result)
  }

  function sanitizeResult(value) {
    if (!plain(value) || typeof value.accepted !== 'boolean') return null
    const allowed = new Set(['accepted', 'status', 'error', 'message', 'preview', 'summary', 'command_id', 'handoff'])
    if (Object.keys(value).some((key) => !allowed.has(key))) return null
    for (const [key, max] of [['status', 24], ['error', 260], ['message', 260], ['preview', 1200], ['summary', 1200], ['handoff', 4000]]) {
      if (value[key] !== undefined && text(value[key], max) === undefined) return null
    }
    if (value.command_id !== undefined && !uuidText(value.command_id)) return null
    const result = compact({
      accepted: value.accepted, status: text(value.status, 24), error: text(value.error, 260), message: text(value.message, 260),
      preview: text(value.preview, 1200), summary: text(value.summary, 1200), command_id: uuidText(value.command_id), handoff: text(value.handoff, 4000)
    })
    return JSON.stringify(result).length <= 8_192 ? result : null
  }

  Object.defineProperty(globalThis, 'QcgSnapshotSanitizer', { value: Object.freeze({ sanitizeSnapshot, sanitizeResult }), configurable: false, writable: false })
})()
