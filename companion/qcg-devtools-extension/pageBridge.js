const CHANNEL = 'qcg-console-page-bridge.v1'
const FORBIDDEN = /(?:-----BEGIN|\b(?:api[_-]?key|client[_-]?secret|access[_-]?token|password)\b|\b(?:C:|Z:)\\|file:\/\/|https?:\/\/|\b(?:stack|trace|body)\b|\b(?:operation|namespace|openqasm|qreg)\b)/i

window.addEventListener('message', (event) => {
  if (event.source !== window || event.origin !== location.origin) return
  const data = event.data
  if (!data || data.channel !== CHANNEL) return
  if (data.type === 'request_snapshot') post('snapshot', { snapshot: safeSnapshot() })
  if (data.type === 'command' && validRequestId(data.request_id) && validCommand(data.command)) {
    void execute(data.command).then(
      (result) => post('command_result', { request_id: data.request_id, result: safeResult(result) }),
      () => post('command_result', { request_id: data.request_id, result: { accepted: false, error: 'The companion command failed safely.' } })
    )
  }
})

function post(type, value) { window.postMessage({ channel: CHANNEL, type, ...value }, location.origin) }

function bridgeV2() { return window.__QCG_CONSOLE_V2__ }
function bridgeV1() { return window.__QCG_DEVTOOLS_V1__ }

async function execute(command) {
  const v2 = bridgeV2()
  if (typeof v2?.executeConsoleCommand === 'function') return v2.executeConsoleCommand(command)
  const target = bridgeV1()
  if (!target) return { accepted: false, error: 'QCG bridge unavailable.' }
  if (command.kind === 'human_decision') return { accepted: false, error: 'Human decisions require the QCG Console v2 bridge.' }
  if (command.kind === 'human_review_disposition') return target.queueHumanReviewDisposition(command.event_id, command.disposition)
  if (command.kind === 'human_memory_disposition') return target.queueHumanMemory(command.event_id, command.disposition, command.content)
  if (command.kind === 'human_message') return target.queueHumanMessage({ summary: command.summary })
  if (command.kind === 'gemini_manual_handoff_create') return { accepted: true, handoff: target.createGeminiManualHandoff({ intent: command.intent, prompt: command.prompt }) }
  if (command.kind === 'gemini_manual_reply_preview') return target.previewGeminiManualReply(command.raw)
  if (command.kind === 'gemini_manual_reply_import') return target.queueGeminiManualReply(command.raw)
  return { accepted: false, error: 'Unsupported companion command.' }
}

function safeSnapshot() {
  const value = bridgeV2()?.getSnapshot?.() ?? bridgeV1()?.getCachedPanelSnapshot?.()
  if (!value || typeof value !== 'object') return { schema_version: 'qcg-console-context.v1', session_id: 'unavailable', phase: 'unavailable', authority_state: 'unavailable', messages: [], participants: [], human_review_requests: [], memories: [] }
  return {
    schema_version: text(value.schema_version, 80) || 'qcg-console-context.v1', surface: text(value.surface, 80), session_id: text(value.session_id, 128) || 'unavailable',
    phase: text(value.phase, 80) || 'unavailable', authority_state: text(value.authority_state, 80) || 'unavailable',
    artifact: pick(value.artifact, ['id', 'digest', 'format', 'profile', 'compiler_status', 'compiler']), recommendation: pick(value.recommendation, ['id', 'decision', 'confidence', 'reason_codes', 'expires_at']),
    effects: pick(value.effects, ['qpu_submissions', 'provider_calls', 'local_simulations', 'external_execution_requests']), receipt: pick(value.receipt, ['id', 'digest', 'schema_version']), storage_mode: text(value.storage_mode, 40),
    participants: list(value.participants, ['actor', 'role']),
    messages: list(value.messages, ['event_id', 'actor', 'role', 'intent', 'transport', 'kind', 'summary', 'evidence_refs', 'confidence', 'status', 'identity_assurance']),
    human_review_requests: list(value.human_review_requests, ['event_id', 'summary', 'requested_action', 'evidence_refs', 'status']),
    memories: list(value.memories, ['memory_id', 'disposition', 'provenance_event_id', 'digest', 'created_at']),
    last_command: pick(value.last_command, ['command_id', 'status', 'message']), available_commands: commands(value.available_commands)
  }
}

function pick(value, keys) { if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined; const result = {}; for (const key of keys) { const item = value[key]; if (typeof item === 'string') result[key] = text(item, key === 'summary' ? 1200 : 260); else if (typeof item === 'number' || typeof item === 'boolean') result[key] = item; else if (Array.isArray(item)) result[key] = item.filter((entry) => typeof entry === 'string').slice(0, 12).map((entry) => text(entry, 220)); } return result }
function list(value, keys) { return Array.isArray(value) ? value.slice(0, 50).map((item) => pick(item, keys)).filter(Boolean) : [] }
function commands(value) { return Array.isArray(value) ? value.slice(0, 20).map((entry) => typeof entry === 'string' ? text(entry, 80) : pick(entry, ['kind', 'name', 'enabled'])).filter(Boolean) : [] }
function text(value, max) { if (typeof value !== 'string') return undefined; const normalized = value.normalize('NFC').replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e]/g, '').trim().slice(0, max); return FORBIDDEN.test(normalized) ? '[redacted]' : normalized }
function safeResult(value) { if (!value || typeof value !== 'object') return { accepted: false, error: 'Invalid companion result.' }; const accepted = value.accepted === true; const result = { accepted }; if (typeof value.error === 'string') result.error = text(value.error, 260) || 'The command was rejected.'; if (typeof value.message === 'string') result.message = text(value.message, 260); if (typeof value.preview === 'string') result.preview = text(value.preview, 1200); if (typeof value.handoff === 'string') result.handoff = text(value.handoff, 4000); else if (value.handoff && typeof value.handoff === 'object') result.handoff = pick(value.handoff, ['schema_version', 'handoff_id', 'page_id', 'intent', 'prompt', 'evidence_refs']); if (typeof value.summary === 'string') result.summary = text(value.summary, 1200); return result }
function validString(value, max = 1200) { return typeof value === 'string' && value.length > 0 && value.length <= max && !FORBIDDEN.test(value) }
function validUuid(value) { return validString(value, 36) && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value) }
function validRequestId(value) { return validString(value, 80) && /^[A-Za-z0-9._:-]+$/.test(value) }
function validCommand(value) {
  if (!value || typeof value !== 'object' || value.schema_version !== 'qcg-console-command.v1' || !validUuid(value.session_id)) return false
  if (value.kind === 'human_review_disposition') return validUuid(value.event_id) && ['approve', 'deny', 'reject', 'defer'].includes(value.disposition)
  if (value.kind === 'human_memory_disposition') return validUuid(value.event_id) && ['remember', 'forget'].includes(value.disposition) && (value.disposition === 'forget' || validString(value.content, 400))
  if (value.kind === 'human_message') return validString(value.summary, 500)
  if (value.kind === 'human_decision') return validUuid(value.recommendation_id) && ['accepted', 'deferred', 'overridden'].includes(value.choice) && (value.choice !== 'overridden' || (validString(value.justification, 500) && value.justification.trim().length >= 12))
  if (value.kind === 'gemini_manual_handoff_create') return ['debug', 'search', 'find', 'brainstorm', 'decision'].includes(value.intent) && validString(value.prompt, 500)
  if (value.kind === 'gemini_manual_reply_preview' || value.kind === 'gemini_manual_reply_import') return validString(value.raw, 1600)
  return false
}
