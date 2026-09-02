const CHANNEL = 'qcg-console-page-bridge.v1'
const CONTROL_CHANNEL = 'qcg-console-extension-control.v1'
let port = null
let reconnectTimer = null
let companionOpen = false

function scheduleReconnect() {
  if (reconnectTimer !== null) return
  reconnectTimer = window.setTimeout(() => {
    reconnectTimer = null
    connectRuntimePort()
  }, 250)
}

function postToRuntime(message) {
  const current = port
  if (!current) { scheduleReconnect(); return false }
  try { current.postMessage(message); return true }
  catch {
    if (port === current) port = null
    scheduleReconnect()
    return false
  }
}

function connectRuntimePort() {
  if (port) return
  let next
  try { next = chrome.runtime.connect({ name: 'qcg-console-content.v1' }) }
  catch { scheduleReconnect(); return }
  port = next
  next.onMessage.addListener(handleRuntimeMessage)
  next.onDisconnect.addListener(() => {
    if (port !== next) return
    void chrome.runtime.lastError
    port = null
    scheduleReconnect()
  })
  requestSnapshot()
}
const FORBIDDEN = /(?:-----BEGIN|\b(?:api[_-]?key|client[_-]?secret|access[_-]?token|password)\b|\b(?:bearer|token)\s+[A-Za-z0-9._-]{12,}|\b(?:sk|rk|pk)-[A-Za-z0-9_-]{16,}\b|\b(?:gh[pousr]|github_pat)_[A-Za-z0-9_]{20,}\b|\bAIza[0-9A-Za-z_-]{20,}\b|\bxox[baprs]-[A-Za-z0-9-]{10,}\b|\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b|[A-Z]:[\\/]|\\\\[^\\\s]+\\|\/(?:home|Users|private|root|etc|var|opt|tmp)\/|file:\/\/|https?:\/\/|\b(?:stack\s*(?:trace|overflow)|traceback)\b|\b(?:request|response|http)\s*(?:body|payload)\b|\{\s*"(?:headers|body|payload)"\s*:|\bOPENQASM\s+\d(?:\.\d+)?\s*;|\bqreg\s+\w+\s*\[|\bnamespace\s+\w+|\boperation\s+\w+\s*\()/i

function requestSnapshot() {
  window.postMessage({ channel: CHANNEL, type: 'request_snapshot' }, location.origin)
}

function requestCompanion(requestId, action) {
  void chrome.runtime.sendMessage({ type: 'qcg-console-open-side-panel', request_id: requestId, action }).then(
    (result) => {
      const status = openStatus(result?.opened)
      if (status === 'side_panel') companionOpen = true
      if (status === 'side_panel_closed') companionOpen = false
      window.postMessage({ channel: CONTROL_CHANNEL, type: 'open_companion_result', request_id: requestId, status, reason: openReason(result?.reason) }, location.origin)
    },
    () => window.postMessage({ channel: CONTROL_CHANNEL, type: 'open_companion_result', request_id: requestId, status: 'none', reason: 'extension_transport_failed' }, location.origin)
  )
}

// Chrome only allows sidePanel.open() from a genuine user interaction. Listen
// to the trusted button click directly in the isolated content-script world so
// the gesture is not lost through an asynchronous window.postMessage hop.
document.addEventListener('click', (event) => {
  if (!event.isTrusted || !(event.target instanceof Element)) return
  const trigger = event.target.closest('[data-qcg-open-companion]')
  const requestId = trigger?.getAttribute('data-qcg-open-companion')
  const explicitAction = trigger?.getAttribute('data-qcg-companion-action')
  const action = validCompanionAction(explicitAction) ? explicitAction : companionOpen ? 'close' : 'open'
  if (validRequestId(requestId) && validCompanionAction(action)) requestCompanion(requestId, action)
}, true)

window.addEventListener('message', (event) => {
  if (event.source !== window || event.origin !== location.origin) return
  const data = event.data
  if (!data || typeof data !== 'object') return
  if (data.channel !== CHANNEL) return
  if (data.type === 'snapshot') {
    const snapshot = sanitizeSnapshot(data.snapshot)
    if (snapshot) postToRuntime({ type: 'qcg-console-snapshot.v1', snapshot })
  }
  if (data.type === 'command_result' && validRequestId(data.request_id)) {
    const result = sanitizeResult(data.result)
    if (result) postToRuntime({ type: 'qcg-console-command-result.v1', request_id: data.request_id, result })
  }
})

function handleRuntimeMessage(message) {
  if (!message || typeof message !== 'object') return
  if (message.type === 'qcg-console-request-snapshot.v1') requestSnapshot()
  if (message.type === 'qcg-console-companion-state.v1' && typeof message.open === 'boolean') {
    companionOpen = message.open
    window.postMessage({ channel: CONTROL_CHANNEL, type: 'companion_state', status: message.open ? 'side_panel' : 'side_panel_closed' }, location.origin)
  }
  if (message.type === 'qcg-console-command.v1' && validRequestId(message.request_id) && validCommand(message.command)) {
    window.postMessage({ channel: CHANNEL, type: 'command', request_id: message.request_id, command: message.command }, location.origin)
  }
}

window.setInterval(requestSnapshot, 1000)
connectRuntimePort()

function validString(value, max = 1200) { return typeof value === 'string' && value.length > 0 && value.length <= max && !FORBIDDEN.test(value) }
function validUuid(value) { return validString(value, 36) && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value) }
function validIdentifier(value) { return validString(value, 64) && /^[a-z0-9][a-z0-9_-]{2,63}$/i.test(value) }
function validRequestId(value) { return validString(value, 36) && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value) }
function validCompanionAction(value) { return value === 'open' || value === 'close' }
function openStatus(value) { return ['side_panel', 'side_panel_closed', 'companion_tab', 'none'].includes(value) ? value : 'none' }
function openReason(value) { return ['opened', 'closed', 'unsupported_tab', 'side_panel_declined', 'browser_declined'].includes(value) ? value : 'browser_declined' }
function sanitizeSnapshot(value) { return globalThis.QcgSnapshotSanitizer?.sanitizeSnapshot(value) ?? null }
function sanitizeResult(value) { return globalThis.QcgSnapshotSanitizer?.sanitizeResult(value) ?? null }
function validCommand(value) {
  if (!value || typeof value !== 'object' || value.schema_version !== 'qcg-console-command.v1' || !validUuid(value.session_id)) return false
  if (value.kind === 'human_review_disposition') return validUuid(value.event_id) && ['approve', 'deny', 'reject', 'defer'].includes(value.disposition)
  if (value.kind === 'human_memory_disposition') return validUuid(value.event_id) && ['remember', 'forget'].includes(value.disposition) && (value.disposition === 'forget' || validString(value.content, 400))
  if (value.kind === 'human_message') return validString(value.summary, 500)
  if (value.kind === 'human_decision') return validIdentifier(value.recommendation_id) && ['accepted', 'deferred', 'overridden'].includes(value.choice) && (value.choice !== 'overridden' || (validString(value.justification, 500) && value.justification.trim().length >= 12))
  if (value.kind === 'gemini_manual_handoff_create') return ['debug', 'search', 'find', 'brainstorm', 'decision'].includes(value.intent) && validString(value.prompt, 500)
  if (value.kind === 'gemini_manual_reply_preview' || value.kind === 'gemini_manual_reply_import') return validString(value.raw, 1600)
  return false
}
