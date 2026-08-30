const PORT_SIDE_PANEL = 'qcg-console-side-panel.v1'
const PORT_CONTENT = 'qcg-console-content.v1'
const PORT_DEVTOOLS = 'qcg-console-devtools.v1'
const panelPorts = new Map()
const contentPorts = new Map()
const devtoolsPorts = new Map()
const snapshots = new Map()
const FORBIDDEN = /(?:-----BEGIN|\b(?:api[_-]?key|client[_-]?secret|access[_-]?token|password)\b|\b(?:C:|Z:)\\|file:\/\/|https?:\/\/|\b(?:stack|trace|body)\b|\b(?:operation|namespace|openqasm|qreg)\b)/i

chrome.runtime.onConnect.addListener((port) => {
  if (![PORT_SIDE_PANEL, PORT_CONTENT, PORT_DEVTOOLS].includes(port.name)) return
  if (port.name === PORT_CONTENT) attachContent(port)
  else if (port.name === PORT_DEVTOOLS) attachDevtools(port)
  else attachSidePanel(port)
})

chrome.action.onClicked.addListener((tab) => { if (typeof tab.id === 'number') void openCompanion(tab.id) })

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || typeof message !== 'object') return
  if (message.type === 'qcg-console-open-side-panel' && Number.isInteger(message.tab_id)) {
    void openCompanion(message.tab_id).then((result) => sendResponse(result))
    return true
  }
  if (message.type === 'qcg-console-get-active-tab') {
    void chrome.tabs.query({ active: true, lastFocusedWindow: true }).then((tabs) => sendResponse({ tab_id: tabs[0]?.id ?? null })).catch(() => sendResponse({ tab_id: null }))
    return true
  }
  if (message.type === 'qcg-console-devtools-visibility' && Number.isInteger(message.tab_id)) {
    broadcast(message.tab_id, { type: 'qcg-console-status.v1', source: 'devtools', visible: Boolean(message.visible) })
  }
})

function attachContent(port) {
  const tabId = port.sender?.tab?.id
  if (!Number.isInteger(tabId)) { port.disconnect(); return }
  contentPorts.set(tabId, port)
  port.onMessage.addListener((message) => {
    if (!message || typeof message !== 'object') return
    if (message.type === 'qcg-console-snapshot.v1' && validSnapshot(message.snapshot)) {
      snapshots.set(tabId, message.snapshot)
      broadcast(tabId, { type: 'qcg-console-snapshot.v1', snapshot: message.snapshot })
    }
    if (message.type === 'qcg-console-command-result.v1' && validResult(message.result)) {
      broadcast(tabId, { type: 'qcg-console-command-result.v1', request_id: message.request_id, result: message.result })
    }
  })
  port.onDisconnect.addListener(() => { if (contentPorts.get(tabId) === port) contentPorts.delete(tabId) })
  try { port.postMessage({ type: 'qcg-console-request-snapshot.v1' }) } catch {}
}

function attachDevtools(port) {
  let tabId = null
  port.onMessage.addListener((message) => {
    if (!message || typeof message !== 'object') return
    if (message.type === 'qcg-console-attach.v1' && Number.isInteger(message.tab_id)) {
      tabId = message.tab_id; devtoolsPorts.set(tabId, port); deliverSnapshot(tabId, port)
    }
    if (Number.isInteger(tabId) && message.type === 'qcg-console-snapshot.v1' && validSnapshot(message.snapshot)) {
      snapshots.set(tabId, message.snapshot)
      broadcast(tabId, { type: 'qcg-console-snapshot.v1', snapshot: message.snapshot }, port)
    }
    if (Number.isInteger(tabId) && message.type === 'qcg-console-command.v1' && validCommand(message.command)) {
      forwardCommand(tabId, port, message.request_id, message.command)
    }
  })
  port.onDisconnect.addListener(() => { if (Number.isInteger(tabId) && devtoolsPorts.get(tabId) === port) devtoolsPorts.delete(tabId) })
}

function attachSidePanel(port) {
  let tabId = null
  port.onMessage.addListener((message) => {
    if (!message || typeof message !== 'object') return
    if (message.type === 'qcg-console-attach.v1' && Number.isInteger(message.tab_id)) {
      tabId = message.tab_id; panelPorts.set(tabId, port); deliverSnapshot(tabId, port)
      try { contentPorts.get(tabId)?.postMessage({ type: 'qcg-console-request-snapshot.v1' }) } catch {}
    }
    if (Number.isInteger(tabId) && message.type === 'qcg-console-command.v1' && validCommand(message.command)) {
      forwardCommand(tabId, port, message.request_id, message.command)
    }
  })
  port.onDisconnect.addListener(() => { if (Number.isInteger(tabId) && panelPorts.get(tabId) === port) panelPorts.delete(tabId) })
}

async function openCompanion(tabId) {
  if (chrome.sidePanel?.open) {
    try {
      await chrome.sidePanel.setOptions({ tabId, path: 'panel.html', enabled: true })
      await chrome.sidePanel.open({ tabId })
      return { opened: 'side_panel' }
    } catch {}
  }
  try {
    await chrome.tabs.create({ url: chrome.runtime.getURL(`panel.html?surface=companion-tab&tab_id=${encodeURIComponent(String(tabId))}`) })
    return { opened: 'companion_tab' }
  } catch { return { opened: 'none' } }
}

function deliverSnapshot(tabId, port) { const snapshot = snapshots.get(tabId); if (snapshot) port.postMessage({ type: 'qcg-console-snapshot.v1', snapshot }) }
function forwardCommand(tabId, origin, requestId, command) {
  const content = contentPorts.get(tabId)
  if (!content) { origin.postMessage({ type: 'qcg-console-command-result.v1', request_id: requestId, result: { accepted: false, error: 'Open a supported QCG page before using the companion.' } }); return }
  content.postMessage({ type: 'qcg-console-command.v1', request_id: requestId, command })
}
function broadcast(tabId, message, except) { for (const port of [panelPorts.get(tabId), devtoolsPorts.get(tabId)]) { if (!port || port === except) continue; try { port.postMessage(message) } catch {} } }
function validString(value, max = 1200) { return typeof value === 'string' && value.length > 0 && value.length <= max && !FORBIDDEN.test(value) }
function validUuid(value) { return validString(value, 36) && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value) }
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
