import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'

const source = readFileSync(new URL('./background.js', import.meta.url), 'utf8')
const sanitizerSource = readFileSync(new URL('./snapshotSanitizer.js', import.meta.url), 'utf8')
let connectListener
let removedListener
let runtimeMessageListener
let sidePanelOpenedListener
let sidePanelClosedListener
let sidePanelOpenCalls = 0
let sidePanelCloseCalls = 0

const context = {
  setTimeout,
  clearTimeout,
  chrome: {
    runtime: {
      onConnect: { addListener(listener) { connectListener = listener } },
      onInstalled: { addListener() {} },
      onStartup: { addListener() {} },
      onMessage: { addListener(listener) { runtimeMessageListener = listener } },
      getURL(path) { return `chrome-extension://qcg/${path}` }
    },
    storage: { session: { async get() { return {} }, async set() {} } },
    action: { onClicked: { addListener() {} } },
    sidePanel: {
      onOpened: { addListener(listener) { sidePanelOpenedListener = listener } },
      onClosed: { addListener(listener) { sidePanelClosedListener = listener } },
      async setPanelBehavior() {},
      async setOptions() {},
      async open() { sidePanelOpenCalls += 1 },
      async close() { sidePanelCloseCalls += 1 }
    },
    tabs: {
      onRemoved: { addListener(listener) { removedListener = listener } },
      async query() { return [] },
      async create() {}
    }
  }
}

const sandbox = vm.createContext(context)
vm.runInContext(sanitizerSource, sandbox, { filename: 'snapshotSanitizer.js' })
sandbox.importScripts = () => undefined
vm.runInContext(source, sandbox, { filename: 'background.js' })

assert.equal(sandbox.QcgSnapshotSanitizer.sanitizeResult({ accepted: true, message: 'Trace the decision body and stack of evidence claims.' })?.message, 'Trace the decision body and stack of evidence claims.', 'ordinary body, stack and trace language remains available')
assert.equal(sandbox.QcgSnapshotSanitizer.sanitizeResult({ accepted: false, error: 'response body: private payload' }), null, 'transport bodies remain rejected')
assert.equal(sandbox.QcgSnapshotSanitizer.sanitizeResult({ accepted: false, error: 'stack trace: private path' }), null, 'stack traces remain rejected')

function port(name, tabId) {
  const messages = []
  let onMessage
  let onDisconnect
  return {
    name,
    sender: Number.isInteger(tabId) ? { tab: { id: tabId } } : {},
    messages,
    onMessage: { addListener(listener) { onMessage = listener } },
    onDisconnect: { addListener(listener) { onDisconnect = listener } },
    postMessage(message) { messages.push(message) },
    disconnect() {},
    emit(message) { onMessage?.(message) },
    close() { onDisconnect?.() }
  }
}

const tabId = 73
const content = port('qcg-console-content.v1', tabId)
connectListener(content)
const toggleResponses = []
runtimeMessageListener({ type: 'qcg-console-open-side-panel', request_id: '2310b1d5-2f9f-45a9-9f77-55f73d1f5187', action: 'open' }, { tab: { id: tabId } }, (result) => toggleResponses.push(result))
await new Promise((resolve) => setImmediate(resolve))
assert.equal(toggleResponses.at(-1)?.opened, 'side_panel', 'the first trusted request must open the tab-bound side panel')
assert.equal(sidePanelOpenCalls, 1)
runtimeMessageListener({ type: 'qcg-console-open-side-panel', request_id: '3310b1d5-2f9f-45a9-9f77-55f73d1f5186', action: 'close' }, { tab: { id: tabId } }, (result) => toggleResponses.push(result))
await new Promise((resolve) => setImmediate(resolve))
assert.equal(toggleResponses.at(-1)?.opened, 'side_panel_closed', 'a second trusted request must close an already-open side panel')
assert.equal(sidePanelCloseCalls, 1)
assert.equal(typeof sidePanelOpenedListener, 'function')
assert.equal(typeof sidePanelClosedListener, 'function')
const snapshot = {
  schema_version: 'qcg-console-snapshot.v2',
  session_id: '7310b1d5-2f9f-45a9-9f77-55f73d1f5189',
  phase: 'partial',
  authority_state: 'ready',
  artifact: { id: 'artifact-bell', digest: 'a'.repeat(64), format: 'openqasm3', profile: 'openqasm3-qdk', compiler_status: 'compiled' },
  tools: [
    { name: 'inspect_quantum_experiment', group: 'quantum', status: 'registered' },
    { name: 'invented_privileged_tool', group: 'quantum', status: 'registered' },
    { name: 'read_debug_context', group: 'quantum', status: 'registered' }
  ],
  raw_source: 'harmless_private_value',
  messages: [{ event_id: '6310b1d5-2f9f-45a9-9f77-55f73d1f5188', actor: 'human', role: 'reviewer', kind: 'observation', summary: 'Token sk-ABCDEFGHIJKLMNOPQRST at D:\\Users\\alice\\secret.txt and /home/alice/.ssh/id_rsa' }]
}
content.emit({ type: 'qcg-console-snapshot.v1', snapshot })

const firstPanel = port('qcg-console-side-panel.v1')
connectListener(firstPanel)
firstPanel.emit({ type: 'qcg-console-attach.v1', tab_id: tabId })
assert.equal(firstPanel.messages.at(-1)?.snapshot?.artifact?.format, 'openqasm3', 'bounded OpenQASM metadata must remain visible')
assert.deepEqual(firstPanel.messages.at(-1)?.snapshot?.tools.map((item) => item.name), ['inspect_quantum_experiment'], 'only official tools with their canonical group may reach the panel')
assert.equal('raw_source' in firstPanel.messages.at(-1).snapshot, false, 'unknown source fields must be projected out before caching')
assert.equal(firstPanel.messages.at(-1).snapshot.messages.length, 0, 'token signatures and private paths must be rejected before caching')

const unsolicitedBefore = firstPanel.messages.length
content.emit({ type: 'qcg-console-command-result.v1', request_id: 'f921c548-b9c0-4460-8410-b5bc01c1c014', result: { accepted: true, message: 'unsolicited' } })
assert.equal(firstPanel.messages.length, unsolicitedBefore, 'an unsolicited page result must not reach the panel')

const requestId = '1059483e-8353-4dab-b915-0a7cb2e9ab36'
firstPanel.emit({
  type: 'qcg-console-command.v1', request_id: requestId,
  command: { schema_version: 'qcg-console-command.v1', session_id: snapshot.session_id, kind: 'human_decision', recommendation_id: 'recommendation-abc123def456', choice: 'accepted' }
})
assert.equal(content.messages.at(-1)?.request_id, requestId, 'a real prefixed recommendation identifier must traverse the broker')
const beforeMalicious = firstPanel.messages.length
content.emit({ type: 'qcg-console-command-result.v1', request_id: requestId, result: { accepted: true, handoff: 'api_key=private-value' } })
assert.equal(firstPanel.messages.length, beforeMalicious, 'a sensitive command result must be rejected')
content.emit({ type: 'qcg-console-command-result.v1', request_id: requestId, result: { accepted: true, status: 'completed', message: 'Human decision recorded.' } })
assert.equal(firstPanel.messages.at(-1)?.result?.message, 'Human decision recorded.', 'the correlated bounded result must return only to its requester')

content.close()
assert.equal(firstPanel.messages.at(-1)?.type, 'qcg-console-disconnected.v1', 'an attached panel must be told when its page bridge disconnects')

const secondPanel = port('qcg-console-side-panel.v1')
connectListener(secondPanel)
secondPanel.emit({ type: 'qcg-console-attach.v1', tab_id: tabId })
assert.equal(secondPanel.messages.length, 0, 'a new panel must never receive the disconnected page snapshot')

removedListener(tabId)
assert.equal(secondPanel.messages.at(-1)?.reason, 'tab_closed', 'tab closure must clear and announce the retained context')

const replacedTabId = 74
const oldContent = port('qcg-console-content.v1', replacedTabId)
connectListener(oldContent)
oldContent.emit({ type: 'qcg-console-snapshot.v1', snapshot })
const replacementContent = port('qcg-console-content.v1', replacedTabId)
connectListener(replacementContent)
oldContent.close()
const replacementPanel = port('qcg-console-side-panel.v1')
connectListener(replacementPanel)
replacementPanel.emit({ type: 'qcg-console-attach.v1', tab_id: replacedTabId })
assert.equal(replacementPanel.messages.length, 0, 'a replaced page bridge must clear the previous snapshot before a panel attaches')
oldContent.emit({ type: 'qcg-console-snapshot.v1', snapshot })
assert.equal(replacementPanel.messages.length, 0, 'a replaced content port must never repopulate the cache')
const replacementSnapshot = { ...snapshot, session_id: '8310b1d5-2f9f-45a9-9f77-55f73d1f5190', phase: 'active' }
replacementContent.emit({ type: 'qcg-console-snapshot.v1', snapshot: replacementSnapshot })
assert.equal(replacementPanel.messages.at(-1)?.snapshot?.session_id, replacementSnapshot.session_id, 'the current page bridge must publish the replacement session only')

console.log('QCG snapshot lifecycle passed: technical metadata survives and stale tab state is cleared.')
