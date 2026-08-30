const CHANNEL = 'qcg-console-page-bridge.v1'
const port = chrome.runtime.connect({ name: 'qcg-console-content.v1' })
const FORBIDDEN = /(?:-----BEGIN|\b(?:api[_-]?key|client[_-]?secret|access[_-]?token|password)\b|\b(?:C:|Z:)\\|file:\/\/|https?:\/\/|\b(?:stack|trace|body)\b|\b(?:operation|namespace|openqasm|qreg)\b)/i

function requestSnapshot() {
  window.postMessage({ channel: CHANNEL, type: 'request_snapshot' }, location.origin)
}

window.addEventListener('message', (event) => {
  if (event.source !== window || event.origin !== location.origin) return
  const data = event.data
  if (!data || data.channel !== CHANNEL) return
  if (data.type === 'snapshot' && validSnapshot(data.snapshot)) {
    port.postMessage({ type: 'qcg-console-snapshot.v1', snapshot: data.snapshot })
  }
  if (data.type === 'command_result' && validRequestId(data.request_id) && validResult(data.result)) {
    port.postMessage({ type: 'qcg-console-command-result.v1', request_id: data.request_id, result: data.result })
  }
})

port.onMessage.addListener((message) => {
  if (!message || typeof message !== 'object') return
  if (message.type === 'qcg-console-request-snapshot.v1') requestSnapshot()
  if (message.type === 'qcg-console-command.v1' && validRequestId(message.request_id) && validCommand(message.command)) {
    window.postMessage({ channel: CHANNEL, type: 'command', request_id: message.request_id, command: message.command }, location.origin)
  }
})

window.setInterval(requestSnapshot, 1000)
requestSnapshot()

function validString(value, max = 1200) { return typeof value === 'string' && value.length > 0 && value.length <= max && !FORBIDDEN.test(value) }
function validUuid(value) { return validString(value, 36) && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value) }
function validRequestId(value) { return validString(value, 80) && /^[A-Za-z0-9._:-]+$/.test(value) }
function validSnapshot(value) { return value && typeof value === 'object' && validString(value.session_id, 128) && validString(value.schema_version, 80) && !FORBIDDEN.test(JSON.stringify(value)) }
function validResult(value) { return value && typeof value === 'object' && typeof value.accepted === 'boolean' && (!value.error || validString(value.error, 260)) }
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
