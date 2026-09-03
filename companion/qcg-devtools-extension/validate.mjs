import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { runInNewContext } from 'node:vm'

const root = new URL('.', import.meta.url)
const read = (name) => readFileSync(new URL(name, root), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(message) }
const manifest = JSON.parse(read('manifest.json'))
const development = JSON.parse(read('manifest.dev.json'))
const packageJson = JSON.parse(read('package.json'))

assert(manifest.version === development.version && manifest.version === packageJson.version, 'extension package versions must stay aligned')

for (const [name, value] of [['production', manifest], ['development', development]]) {
  assert(value.manifest_version === 3, `${name}: Manifest V3 is required`)
  assert(value.devtools_page === 'devtools.html', `${name}: missing DevTools entrypoint`)
  assert(value.side_panel?.default_path === 'panel.html', `${name}: missing shared side-panel UI`)
  assert(value.background?.service_worker === 'background.js', `${name}: missing service worker`)
  assert(value.icons?.['16'] === 'icons/qcg-16.png' && value.icons?.['128'] === 'icons/qcg-128.png', `${name}: final QCG identity icons are required`)
  assert(value.action?.default_icon?.['16'] === 'icons/qcg-16.png' && value.action?.default_icon?.['32'] === 'icons/qcg-32.png', `${name}: toolbar action must use the final QCG identity`)
  assert(value.permissions?.includes('sidePanel'), `${name}: sidePanel permission is required`)
  assert(value.permissions?.includes('storage'), `${name}: session-only panel state requires storage permission`)
  assert(Number(value.minimum_chrome_version) >= 142, `${name}: Chrome 142+ is required for close/onClosed side-panel lifecycle`)
  assert(!value.permissions?.includes('tabs') && !value.permissions?.includes('scripting'), `${name}: broad permissions are not allowed`)
  assert(value.content_scripts?.length === 2 && value.content_scripts[0].world === 'MAIN', `${name}: require MAIN and isolated bridge pair`)
}
assert(JSON.stringify(manifest.host_permissions) === JSON.stringify(['https://qcg.securedme.ca/*']), 'production: only qcg.securedme.ca may receive a bridge')
assert(development.host_permissions.includes('http://localhost:5173/*') && development.host_permissions.includes('http://127.0.0.1:5173/*'), 'development: local QCG hosts are required')

const background = read('background.js')
const pageBridge = read('pageBridge.js')
const contentBridge = read('contentBridge.js')
const panel = read('panel.js')
const panelHtml = read('panel.html')
const validCommandBody = (source, surface) => {
  const start = source.indexOf('function validCommand(value) {')
  const end = source.indexOf('\n}', start)
  assert(start >= 0 && end > start, `${surface}: validCommand body must remain statically inspectable`)
  return source.slice(start, end + 2)
}
const validators = [
  ['background', validCommandBody(background, 'background')],
  ['isolated', validCommandBody(contentBridge, 'isolated')],
  ['MAIN', validCommandBody(pageBridge, 'MAIN')],
]
const commandKinds = ['human_decision', 'human_review_disposition', 'human_memory_disposition', 'human_message', 'human_override_note', 'gemini_manual_handoff_create', 'gemini_manual_reply_preview', 'gemini_manual_reply_import', 'export_debug_handoff']
const normalizedValidators = validators.map(([surface, validator]) => [surface, validator.replace(/\s+/g, ' ').trim()])
for (const [surface, validator] of normalizedValidators.slice(1)) assert(validator === normalizedValidators[0][1], `${surface}: validCommand must remain exactly equivalent to the background validator`)
for (const kind of commandKinds) {
  for (const [surface, validator] of validators) assert(validator.includes(`'${kind}'`), `${surface}: validCommand must allowlist ${kind}`)
}
for (const [surface, validator] of validators) assert(validator.includes('validString(value.raw, 1600)'), `${surface}: manual Gemini replies must remain bounded to 1600 characters`)
const testValidString = (value, max = 1200) => typeof value === 'string' && value.length > 0 && value.length <= max
const testValidUuid = (value) => testValidString(value, 36) && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
const testValidIdentifier = (value) => testValidString(value, 64) && /^[a-z0-9][a-z0-9_-]{2,63}$/i.test(value)
const session_id = '11111111-1111-4111-8111-111111111111'
const event_id = '22222222-2222-4222-8222-222222222222'
const commandFixtures = [
  { schema_version: 'qcg-console-command.v1', session_id, kind: 'human_decision', recommendation_id: 'recommendation-abc123', choice: 'accepted' },
  { schema_version: 'qcg-console-command.v1', session_id, kind: 'human_review_disposition', event_id, disposition: 'approve' },
  { schema_version: 'qcg-console-command.v1', session_id, kind: 'human_memory_disposition', event_id, disposition: 'remember', content: 'Retain this bounded observation.' },
  { schema_version: 'qcg-console-command.v1', session_id, kind: 'human_message', summary: 'A bounded human observation.' },
  { schema_version: 'qcg-console-command.v1', session_id, kind: 'human_override_note', justification: 'The visible evidence requires a human override.' },
  { schema_version: 'qcg-console-command.v1', session_id, kind: 'gemini_manual_handoff_create', intent: 'debug', prompt: 'Review this bounded context.' },
  { schema_version: 'qcg-console-command.v1', session_id, kind: 'gemini_manual_reply_preview', raw: '{"summary":"bounded"}' },
  { schema_version: 'qcg-console-command.v1', session_id, kind: 'gemini_manual_reply_import', raw: '{"summary":"bounded"}' },
  { schema_version: 'qcg-console-command.v1', session_id, kind: 'export_debug_handoff' }
]
for (const [surface, validatorSource] of validators) {
  const validate = Function('validUuid', 'validString', 'validIdentifier', `return (${validatorSource})`)(testValidUuid, testValidString, testValidIdentifier)
  for (const command of commandFixtures) assert(validate(command), `${surface}: executable validator rejected ${command.kind}`)
  assert(!validate({ schema_version: 'qcg-console-command.v1', session_id, kind: 'run_bounded_local_simulation' }), `${surface}: executable validator exposed a quantum command`)
  assert(!validate({ schema_version: 'qcg-console-command.v1', session_id, kind: 'human_override_note', justification: 'too short' }), `${surface}: executable validator accepted an unjustified override note`)
  assert(!validate({ schema_version: 'qcg-console-command.v1', session_id, kind: 'gemini_manual_reply_import', raw: 'x'.repeat(1601) }), `${surface}: executable validator exceeded the Gemini reply limit`)
}
for (const kind of ['human_review_disposition', 'human_memory_disposition', 'human_message', 'human_decision', 'gemini_manual_handoff_create', 'gemini_manual_reply_preview', 'gemini_manual_reply_import']) {
  assert(panel.includes(`'${kind}'`), `interactive panel command ${kind} must remain wired to an explicit human action`)
}
for (const forbidden of ['inspect_quantum_experiment', 'evaluate_quantum_call', 'run_bounded_local_simulation', 'export_quantum_evidence_report']) {
  for (const [surface, source] of [['background', background], ['isolated', contentBridge], ['MAIN', pageBridge], ['panel', panel]]) {
    assert(!source.includes(`'${forbidden}'`), `${surface} must not expose quantum command ${forbidden}`)
  }
}
for (const forbidden of ['consent', 'provider_calls', 'qpu_submission']) {
  assert(!background.includes(forbidden), `broker must not expose ${forbidden}`)
}
assert(pageBridge.includes('__QCG_CONSOLE_V2__') && pageBridge.includes('executeConsoleCommand') && pageBridge.includes('queueHumanReviewDisposition'), 'bridge must prefer v2 and retain collaboration-only v1 fallback')
const v1Fallback = pageBridge.slice(pageBridge.indexOf('async function execute(command)'), pageBridge.indexOf('function safeSnapshot()'))
assert(v1Fallback.includes("command.kind === 'human_override_note'") && v1Fallback.includes('queued?.accepted'), 'v1 fallback must preserve human override-note rejection and acceptance')
assert(v1Fallback.includes("command.kind === 'export_debug_handoff'") && v1Fallback.includes('requires the QCG Console v2 bridge'), 'v1 fallback must reject handoff export with an explicit v2 requirement')
let overrideAccepted = true
let overrideSummary = ''
const bridgeContext = {
  location: { origin: 'https://qcg.securedme.ca' },
  window: {
    addEventListener: () => undefined,
    postMessage: () => undefined,
    __QCG_DEVTOOLS_V1__: {
      queueHumanMessage: ({ summary }) => { overrideSummary = summary; return overrideAccepted ? { accepted: true } : { accepted: false, error: 'V1 queue rejected the note.' } }
    }
  }
}
runInNewContext(`${pageBridge}\nglobalThis.__qcgBridgeContract = { execute };`, bridgeContext)
const v1Note = await bridgeContext.__qcgBridgeContract.execute(commandFixtures.find((command) => command.kind === 'human_override_note'))
assert(v1Note.accepted === true && overrideSummary.startsWith('Override note:'), 'V1 bridge must queue the bounded human override note')
overrideAccepted = false
const v1RejectedNote = await bridgeContext.__qcgBridgeContract.execute(commandFixtures.find((command) => command.kind === 'human_override_note'))
assert(v1RejectedNote.accepted === false && v1RejectedNote.error === 'V1 queue rejected the note.', 'V1 bridge must preserve an override-note queue rejection')
const v1Export = await bridgeContext.__qcgBridgeContract.execute(commandFixtures.find((command) => command.kind === 'export_debug_handoff'))
assert(v1Export.accepted === false && v1Export.error.includes('v2 bridge'), 'V1 bridge must explicitly require V2 for sanitized handoff export')
let v2Kind = ''
bridgeContext.window.__QCG_CONSOLE_V2__ = { executeConsoleCommand: async (command) => { v2Kind = command.kind; return { accepted: true, status: 'completed' } } }
const v2Export = await bridgeContext.__qcgBridgeContract.execute(commandFixtures.find((command) => command.kind === 'export_debug_handoff'))
assert(v2Export.accepted === true && v2Kind === 'export_debug_handoff', 'page bridge must route sanitized handoff export to V2')
assert(background.includes("value.schema_version !== 'qcg-console-command.v1'") && background.includes("value.kind === 'human_decision'"), 'commands require the v1 console schema and human decisions')
assert(panel.includes("kind: 'human_decision'") && panel.includes("available_commands"), 'human decisions must be explicit UI actions gated by v2 availability')
assert(panel.includes("qcg-console-devtools.v1") && panel.includes("qcg-console-side-panel.v1"), 'DevTools and side panel must share the console transport')
assert(!panelHtml.includes('id="open-companion"') && panelHtml.includes('id="access-toggle"') && panelHtml.includes('id="access-panel"'), 'the Companion must use its scarce header space for direct-use access controls, not a circular open button')
assert(panelHtml.includes('icons/inspector-q-avatar.jpg') && panelHtml.includes('Inspector Q observes bounded state; human authority remains explicit.'), 'Inspector Q must remain a decorative bounded-state observer, never an authority claim')
assert(read('devtools.js').includes("'icons/qcg-32.png'"), 'the F12 panel must use the final QCG identity icon')
assert(panel.includes('qcg-companion-access-v1') && panel.includes('applyAccessibility') && panel.includes('toggleAccess'), 'Companion access preferences must be local, persistent and keyboard-dismissible')
assert(panel.includes('function requiredElement(selector)') && panel.includes('function requiredElements(selector)') && panel.includes('QCG Companion initialization failed: required element'), 'panel DOM dependencies must fail with a precise initialization error')
assert((panel.match(/document\.querySelector\(/g) ?? []).length === 1, 'panel singleton selectors must go through requiredElement')
assert((panel.match(/document\.querySelectorAll\(/g) ?? []).length === 1, 'panel selector sets must go through requiredElements')
const allPanelIds = [...panelHtml.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1])
assert(new Set(allPanelIds).size === allPanelIds.length, 'panel.html IDs must be unique')
const htmlElements = [...panelHtml.matchAll(/<([a-z][a-z0-9-]*)([^>]*)>/gi)].map((match) => match[2])
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const selectorCount = (selector) => {
  if (/^#[a-z0-9_-]+$/i.test(selector)) return allPanelIds.filter((id) => `#${id}` === selector).length
  if (/^\.[a-z0-9_-]+$/i.test(selector)) {
    const token = selector.slice(1)
    return htmlElements.filter((attributes) => {
      const match = attributes.match(/\bclass=["']([^"']*)["']/i)
      return match ? match[1].split(/\s+/).includes(token) : false
    }).length
  }
  const attributes = [...selector.matchAll(/\[([a-z0-9_-]+)(?:=["']([^"']*)["'])?\]/gi)].map((match) => ({ name: match[1], value: match[2] }))
  if (attributes.length > 0 && attributes.map(({ name, value }) => value === undefined ? `[${name}]` : `[${name}="${value}"]`).join('') === selector) {
    return htmlElements.filter((element) => attributes.every(({ name, value }) => {
      const match = element.match(new RegExp(`(?:^|\\s)${escapeRegex(name)}(?:=["']([^"']*)["'])?(?=\\s|$)`, 'i'))
      return Boolean(match) && (value === undefined || match[1] === value)
    })).length
  }
  throw new Error(`validate.mjs cannot verify unsupported panel selector ${selector}`)
}
const singletonSelectors = [...panel.matchAll(/(?<!\$)\$\(\s*(["'])([^"']+)\1\s*\)/g)].map((match) => match[2])
const collectionSelectors = [...panel.matchAll(/\$\$\(\s*(["'])([^"']+)\1\s*\)/g)].map((match) => match[2])
for (const selector of new Set(singletonSelectors)) assert(selectorCount(selector) === 1, `panel selector ${selector} must resolve to exactly one panel.html element`)
for (const selector of new Set(collectionSelectors)) {
  assert(selectorCount(selector) > 0, `panel selector set ${selector} must resolve to at least one panel.html element`)
}
for (const profile of ['base', 'autism-calm', 'adhd-sprint', 'deep-work']) assert(panelHtml.includes(`data-access-profile="${profile}"`) && panel.includes(`'${profile}'`), `Companion Access must retain the SecuredMe ${profile} reading profile`)
assert(read('panel.css').includes('--control-edge') && read('panel.css').includes('button:hover { border-color: var(--cyan); }'), 'every Companion button needs a persistent warm edge that changes to cyan on hover')
assert(!panel.includes('inspectedWindow.eval') && panel.includes('QcgSnapshotSanitizer'), 'DevTools must consume the same sanitized broker snapshot as the side panel')
assert(manifest.content_scripts[1].js[0] === 'snapshotSanitizer.js' && development.content_scripts[1].js[0] === 'snapshotSanitizer.js', 'isolated content transport must load the strict snapshot sanitizer first')
assert(read('panel.html').includes('snapshotSanitizer.js'), 'the shared panel must sanitize every broker snapshot before rendering or copying')
assert(background.includes("importScripts('snapshotSanitizer.js')"), 'the background broker must sanitize before caching or routing')
assert(contentBridge.includes("qcg-console-extension-control.v1") && contentBridge.includes("type: 'open_companion_result'") && contentBridge.includes("[data-qcg-open-companion]") && contentBridge.includes('event.isTrusted'), 'page open-companion handshake must originate from a trusted marked click and return a paired result')
assert(contentBridge.includes("type: 'qcg-console-open-side-panel', request_id: requestId, action") && contentBridge.includes('validCompanionAction(action)') && !contentBridge.includes('tab_id: data.'), 'content bridge must forward only an explicit open/close action and never a page-supplied tab id')
assert(contentBridge.includes('onDisconnect.addListener') && contentBridge.includes('scheduleReconnect'), 'the page bridge must reconnect after losing its runtime port')
assert(contentBridge.includes("'unsupported_tab'"), 'the page bridge must preserve the bounded unsupported-tab diagnostic')
assert(panel.includes('onDisconnect.addListener') && panel.includes('scheduleReconnect'), 'side-panel and DevTools surfaces must reconnect after losing their runtime port')
assert(background.includes('const tabId = sender.tab?.id') && background.includes("message.type === 'qcg-console-open-side-panel'"), 'worker must derive the page handshake tab from sender.tab.id')
assert(background.includes('function prepareCompanion(tabId)') && background.includes('void prepareCompanion(tabId)'), 'side-panel options must be prepared when the content bridge attaches')
assert(background.includes('function disableDefaultCompanion()') && background.includes("setOptions({ enabled: false })"), 'the manifest default side panel must be disabled outside supported QCG tabs')
assert(background.includes('function disableCompanion(tabId)') && background.includes("setOptions({ tabId, enabled: false })"), 'a disconnected QCG tab must lose its side-panel surface')
assert(background.includes("clearSnapshot(tabId, 'page_bridge_disconnected')"), 'a disconnected page bridge must clear retained snapshots')
const openCompanionBody = background.slice(background.indexOf('async function openCompanion(tabId, action)'), background.indexOf('function deliverSnapshot'))
assert(openCompanionBody.includes('if (!contentPorts.has(tabId))'), 'companion opening must be rejected outside a connected QCG page')
assert(openCompanionBody.indexOf('chrome.sidePanel.open({ tabId })') < openCompanionBody.indexOf('chrome.tabs.create'), 'side-panel open must be the first browser operation in the user-gesture path')
assert(openCompanionBody.includes("action === 'close'") && openCompanionBody.includes('chrome.sidePanel.close({ tabId })') && openCompanionBody.includes("opened: 'side_panel_closed'"), 'Chrome 142+ must honor an explicit close action after worker suspension')
assert(!openCompanionBody.includes('chrome.sidePanel.setOptions'), 'side-panel setup must not consume the open gesture')
for (const label of ['Inspector', 'Console', 'WebMCP', 'Decisions', 'Sources', 'Receipts', 'Activity']) assert(panelHtml.includes(label), `shared console navigation missing ${label}`)
assert(read('panel.css').includes('--emerald') && read('panel.css').includes('--cyan') && read('panel.css').includes('--gold') && read('panel.css').includes('--red'), 'shared console requires semantic neutral color tokens')
console.log('QCG extension validation passed: MV3 manifests, restricted hosts, strict command allowlist, and v1/v2 bridge fallback.')
