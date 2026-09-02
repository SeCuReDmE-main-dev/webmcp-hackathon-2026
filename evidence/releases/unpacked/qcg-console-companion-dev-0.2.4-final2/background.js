importScripts('snapshotSanitizer.js')

const PORT_SIDE_PANEL = 'qcg-console-side-panel.v1'
const PORT_CONTENT = 'qcg-console-content.v1'
const PORT_DEVTOOLS = 'qcg-console-devtools.v1'
const panelPorts = new Map()
const contentPorts = new Map()
const devtoolsPorts = new Map()
const snapshots = new Map()
const pendingRequests = new Map()
const openSidePanelTabs = new Set()
const FORBIDDEN = /(?:-----BEGIN|\b(?:api[_-]?key|client[_-]?secret|access[_-]?token|password)\b|\b(?:bearer|token)\s+[A-Za-z0-9._-]{12,}|\b(?:sk|rk|pk)-[A-Za-z0-9_-]{16,}\b|\b(?:gh[pousr]|github_pat)_[A-Za-z0-9_]{20,}\b|\bAIza[0-9A-Za-z_-]{20,}\b|\bxox[baprs]-[A-Za-z0-9-]{10,}\b|\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b|[A-Z]:[\\/]|\\\\[^\\\s]+\\|\/(?:home|Users|private|root|etc|var|opt|tmp)\/|file:\/\/|https?:\/\/|\b(?:stack|trace|body)\b|\bOPENQASM\s+\d(?:\.\d+)?\s*;|\bqreg\s+\w+\s*\[|\bnamespace\s+\w+|\boperation\s+\w+\s*\()/i

chrome.runtime.onConnect.addListener((port) => {
  if (![PORT_SIDE_PANEL, PORT_CONTENT, PORT_DEVTOOLS].includes(port.name)) return
  if (port.name === PORT_CONTENT) attachContent(port)
  else if (port.name === PORT_DEVTOOLS) attachDevtools(port)
  else attachSidePanel(port)
})

chrome.runtime.onInstalled.addListener(() => {
  void chrome.sidePanel?.setPanelBehavior?.({ openPanelOnActionClick: true }).catch(() => undefined)
  void disableDefaultCompanion()
})

chrome.runtime.onStartup.addListener(() => {
  void chrome.sidePanel?.setPanelBehavior?.({ openPanelOnActionClick: true }).catch(() => undefined)
  void disableDefaultCompanion()
})

chrome.action.onClicked.addListener((tab) => { if (typeof tab.id === 'number') void openCompanion(tab.id) })
chrome.tabs?.onRemoved?.addListener((tabId) => clearTab(tabId, 'tab_closed'))
chrome.sidePanel?.onOpened?.addListener((info) => {
  if (!Number.isInteger(info.tabId)) return
  openSidePanelTabs.add(info.tabId)
  notifyContentCompanionState(info.tabId, true)
})
chrome.sidePanel?.onClosed?.addListener((info) => {
  if (!Number.isInteger(info.tabId)) return
  openSidePanelTabs.delete(info.tabId)
  notifyContentCompanionState(info.tabId, false)
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || typeof message !== 'object') return
  if (message.type === 'qcg-console-open-side-panel' && validRequestId(message.request_id)) {
    const tabId = sender.tab?.id
    if (!Number.isInteger(tabId)) { sendResponse({ request_id: message.request_id, opened: 'none' }); return }
    void openCompanion(tabId).then((result) => sendResponse({ request_id: message.request_id, ...result }))
    return true
  }
  if (message.type === 'qcg-console-open-side-panel-for-extension' && Number.isInteger(message.tab_id)) {
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
  const previous = contentPorts.get(tabId)
  if (previous && previous !== port) {
    clearSnapshot(tabId, 'page_bridge_replaced')
    rejectPendingForTab(tabId, 'The QCG page bridge changed before completing the command.')
    try { previous.disconnect() } catch {}
  }
  contentPorts.set(tabId, port)
  void prepareCompanion(tabId)
  port.onMessage.addListener((message) => {
    if (contentPorts.get(tabId) !== port) return
    if (!message || typeof message !== 'object') return
    if (message.type === 'qcg-console-snapshot.v1') {
      const snapshot = sanitizeSnapshot(message.snapshot)
      if (!snapshot) return
      snapshots.set(tabId, snapshot)
      broadcast(tabId, { type: 'qcg-console-snapshot.v1', snapshot })
    }
    if (message.type === 'qcg-console-command-result.v1' && validRequestId(message.request_id)) {
      deliverCommandResult(tabId, message.request_id, message.result)
    }
  })
  port.onDisconnect.addListener(() => {
    if (contentPorts.get(tabId) !== port) return
    contentPorts.delete(tabId)
    clearSnapshot(tabId, 'page_bridge_disconnected')
    rejectPendingForTab(tabId, 'The QCG page bridge disconnected before completing the command.')
    void disableCompanion(tabId)
  })
  try { port.postMessage({ type: 'qcg-console-request-snapshot.v1' }) } catch {}
}

async function prepareCompanion(tabId) {
  if (!chrome.sidePanel?.setOptions) return
  try { await chrome.sidePanel.setOptions({ tabId, path: 'panel.html', enabled: true }) } catch {}
}

async function disableDefaultCompanion() {
  if (!chrome.sidePanel?.setOptions) return
  try { await chrome.sidePanel.setOptions({ enabled: false }) } catch {}
}

async function disableCompanion(tabId) {
  if (!chrome.sidePanel?.setOptions) return
  try { await chrome.sidePanel.setOptions({ tabId, enabled: false }) } catch {}
}

function attachDevtools(port) {
  let tabId = null
  port.onMessage.addListener((message) => {
    if (!message || typeof message !== 'object') return
    if (message.type === 'qcg-console-attach.v1' && Number.isInteger(message.tab_id)) {
      tabId = message.tab_id; devtoolsPorts.set(tabId, port); deliverSnapshot(tabId, port)
    }
    if (Number.isInteger(tabId) && message.type === 'qcg-console-command.v1' && validRequestId(message.request_id) && validCommand(message.command)) {
      forwardCommand(tabId, port, message.request_id, message.command)
    }
  })
  port.onDisconnect.addListener(() => {
    if (Number.isInteger(tabId) && devtoolsPorts.get(tabId) === port) devtoolsPorts.delete(tabId)
    rejectPendingForOrigin(port)
  })
}

function attachSidePanel(port) {
  let tabId = null
  port.onMessage.addListener((message) => {
    if (!message || typeof message !== 'object') return
    if (message.type === 'qcg-console-attach.v1' && Number.isInteger(message.tab_id)) {
      tabId = message.tab_id; panelPorts.set(tabId, port); deliverSnapshot(tabId, port)
      try { contentPorts.get(tabId)?.postMessage({ type: 'qcg-console-request-snapshot.v1' }) } catch {}
    }
    if (Number.isInteger(tabId) && message.type === 'qcg-console-command.v1' && validRequestId(message.request_id) && validCommand(message.command)) {
      forwardCommand(tabId, port, message.request_id, message.command)
    }
  })
  port.onDisconnect.addListener(() => {
    if (Number.isInteger(tabId) && panelPorts.get(tabId) === port) panelPorts.delete(tabId)
    rejectPendingForOrigin(port)
  })
}

async function openCompanion(tabId) {
  if (!contentPorts.has(tabId)) {
    void disableCompanion(tabId)
    return { opened: 'none', reason: 'unsupported_tab' }
  }
  if (openSidePanelTabs.has(tabId) && chrome.sidePanel?.close) {
    try {
      await chrome.sidePanel.close({ tabId })
      openSidePanelTabs.delete(tabId)
      notifyContentCompanionState(tabId, false)
      return { opened: 'side_panel_closed', reason: 'closed' }
    } catch {}
  }
  if (chrome.sidePanel?.open) {
    try {
      // `open()` must be the first awaited browser operation in this user-gesture
      // path. The tab-specific options are prepared when the content bridge
      // connects so an asynchronous setup call cannot consume the gesture.
      await chrome.sidePanel.open({ tabId })
      openSidePanelTabs.add(tabId)
      notifyContentCompanionState(tabId, true)
      return { opened: 'side_panel', reason: 'opened' }
    } catch {}
  }
  try {
    await chrome.tabs.create({ url: chrome.runtime.getURL(`panel.html?surface=companion-tab&tab_id=${encodeURIComponent(String(tabId))}`) })
    return { opened: 'companion_tab', reason: 'side_panel_declined' }
  } catch { return { opened: 'none', reason: 'browser_declined' } }
}

function deliverSnapshot(tabId, port) { const snapshot = snapshots.get(tabId); if (snapshot) port.postMessage({ type: 'qcg-console-snapshot.v1', snapshot }) }
function clearSnapshot(tabId, reason) {
  snapshots.delete(tabId)
  broadcast(tabId, { type: 'qcg-console-disconnected.v1', reason })
}

function notifyContentCompanionState(tabId, open) {
  try { contentPorts.get(tabId)?.postMessage({ type: 'qcg-console-companion-state.v1', open }) } catch {}
}
function clearTab(tabId, reason) {
  clearSnapshot(tabId, reason)
  rejectPendingForTab(tabId, 'The bound browser tab closed before completing the command.')
  openSidePanelTabs.delete(tabId)
  contentPorts.delete(tabId)
  panelPorts.delete(tabId)
  devtoolsPorts.delete(tabId)
}
function forwardCommand(tabId, origin, requestId, command) {
  const content = contentPorts.get(tabId)
  if (!content) { origin.postMessage({ type: 'qcg-console-command-result.v1', request_id: requestId, result: { accepted: false, error: 'Open a supported QCG page before using the companion.' } }); return }
  const key = pendingKey(tabId, requestId)
  if (pendingRequests.has(key)) { origin.postMessage({ type: 'qcg-console-command-result.v1', request_id: requestId, result: { accepted: false, error: 'The command request identifier is already pending.' } }); return }
  const timeout = setTimeout(() => {
    const pending = pendingRequests.get(key)
    if (!pending) return
    pendingRequests.delete(key)
    try { pending.origin.postMessage({ type: 'qcg-console-command-result.v1', request_id: requestId, result: { accepted: false, error: 'The bounded command expired before a page response arrived.' } }) } catch {}
  }, 15_000)
  pendingRequests.set(key, { origin, timeout, tabId })
  try { content.postMessage({ type: 'qcg-console-command.v1', request_id: requestId, command }) }
  catch {
    clearTimeout(timeout); pendingRequests.delete(key)
    origin.postMessage({ type: 'qcg-console-command-result.v1', request_id: requestId, result: { accepted: false, error: 'The bounded command could not reach the QCG page.' } })
  }
}
function deliverCommandResult(tabId, requestId, value) {
  const key = pendingKey(tabId, requestId)
  const pending = pendingRequests.get(key)
  if (!pending) return
  const result = sanitizeResult(value)
  if (!result) return
  clearTimeout(pending.timeout)
  pendingRequests.delete(key)
  try { pending.origin.postMessage({ type: 'qcg-console-command-result.v1', request_id: requestId, result }) } catch {}
}
function pendingKey(tabId, requestId) { return `${tabId}:${requestId}` }
function rejectPendingForTab(tabId, error) {
  for (const [key, pending] of pendingRequests) {
    if (pending.tabId !== tabId) continue
    clearTimeout(pending.timeout); pendingRequests.delete(key)
    try { pending.origin.postMessage({ type: 'qcg-console-command-result.v1', request_id: key.slice(key.indexOf(':') + 1), result: { accepted: false, error } }) } catch {}
  }
}
function rejectPendingForOrigin(origin) {
  for (const [key, pending] of pendingRequests) {
    if (pending.origin !== origin) continue
    clearTimeout(pending.timeout); pendingRequests.delete(key)
  }
}
function broadcast(tabId, message, except) { for (const port of [panelPorts.get(tabId), devtoolsPorts.get(tabId)]) { if (!port || port === except) continue; try { port.postMessage(message) } catch {} } }
function sanitizeSnapshot(value) { return globalThis.QcgSnapshotSanitizer?.sanitizeSnapshot(value) ?? null }
function sanitizeResult(value) { return globalThis.QcgSnapshotSanitizer?.sanitizeResult(value) ?? null }
function validString(value, max = 1200) { return typeof value === 'string' && value.length > 0 && value.length <= max && !FORBIDDEN.test(value) }
function validUuid(value) { return validString(value, 36) && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value) }
function validIdentifier(value) { return validString(value, 64) && /^[a-z0-9][a-z0-9_-]{2,63}$/i.test(value) }
function validRequestId(value) { return validUuid(value) }
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
