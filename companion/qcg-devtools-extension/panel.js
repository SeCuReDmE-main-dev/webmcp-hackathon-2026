const $ = (selector) => document.querySelector(selector)
const query = new URLSearchParams(location.search)
const isDevtools = query.get('surface') === 'devtools' && Boolean(chrome.devtools?.inspectedWindow)
const surface = isDevtools ? 'DEVTOOLS PANEL' : query.get('surface') === 'companion-tab' ? 'COMPANION TAB' : 'SIDE PANEL'
const state = { snapshot: null, tabId: Number(query.get('tab_id')) || null, port: null }

$('#surface').textContent = surface
hydrateTheme()
bindNavigation()
bindActions()
void connect()

async function connect() {
  if (isDevtools) {
    state.tabId = chrome.devtools.inspectedWindow.tabId
    state.port = chrome.runtime.connect({ name: 'qcg-console-devtools.v1' })
    state.port.postMessage({ type: 'qcg-console-attach.v1', tab_id: state.tabId })
    state.port.onMessage.addListener(receive)
    await refreshDevtools()
    window.setInterval(() => { void refreshDevtools() }, 1000)
    return
  }
  state.port = chrome.runtime.connect({ name: 'qcg-console-side-panel.v1' })
  state.port.onMessage.addListener(receive)
  if (!Number.isInteger(state.tabId)) {
    const result = await chrome.runtime.sendMessage({ type: 'qcg-console-get-active-tab' }).catch(() => ({ tab_id: null }))
    state.tabId = Number.isInteger(result?.tab_id) ? result.tab_id : null
  }
  if (Number.isInteger(state.tabId)) state.port.postMessage({ type: 'qcg-console-attach.v1', tab_id: state.tabId })
  else setStatus('Open a QCG tab, then reopen the companion.', true)
}

async function refreshDevtools() {
  try {
    const snapshot = await evaluate('window.__QCG_CONSOLE_V2__ ? window.__QCG_CONSOLE_V2__.getSnapshot() : (window.__QCG_DEVTOOLS_V1__ ? window.__QCG_DEVTOOLS_V1__.getCachedPanelSnapshot() : null)')
    if (snapshot) acceptSnapshot(snapshot)
    else setStatus('Open a WebMCP-QCG page to connect.', true)
  } catch { setStatus('Unable to read the bounded QCG bridge.', true) }
}

function receive(message) {
  if (!message || typeof message !== 'object') return
  if (message.type === 'qcg-console-snapshot.v1') acceptSnapshot(message.snapshot)
  if (message.type === 'qcg-console-command-result.v1') handleResult(message.result)
}

function acceptSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') return
  state.snapshot = snapshot
  if (isDevtools) state.port?.postMessage({ type: 'qcg-console-snapshot.v1', snapshot })
  setStatus(`${snapshot.phase || 'connected'} · ${snapshot.authority_state || 'unknown'}`)
  $('#context').textContent = JSON.stringify({ surface: snapshot.surface, artifact: snapshot.artifact, recommendation: snapshot.recommendation, available_commands: snapshot.available_commands, effects: snapshot.effects, storage_mode: snapshot.storage_mode }, null, 2)
  renderEvidence(snapshot); renderParticipants(snapshot.participants || []); renderMessages(snapshot.messages || []); renderReviews(snapshot.human_review_requests || []); renderDecision(snapshot); renderMemories(snapshot.memories || [])
}

function renderEvidence(snapshot) { $('#evidence').replaceChildren(...facts([['Artifact', snapshot.artifact?.digest || '—'], ['Recommendation', snapshot.recommendation?.decision || '—'], ['Effects', `${snapshot.effects?.qpu_submissions ?? 0} QPU · ${snapshot.effects?.local_simulations ?? 0} local`], ['Authority', snapshot.authority_state || '—']])) }
function facts(entries) { return entries.flatMap(([key, value]) => [Object.assign(document.createElement('dt'), { textContent: key }), Object.assign(document.createElement('dd'), { textContent: String(value) })]) }
function renderParticipants(items) { renderList($('#participants'), items, (item) => `${item.actor || 'unknown'} · ${item.role || 'declared'}`, 'No declared participants.') }
function renderMessages(items) {
  const target = $('#messages'); const recent = items.slice(-20).reverse()
  if (!recent.length) return renderList(target, [], () => '', 'No bounded messages.')
  target.replaceChildren(...recent.map((item) => {
    const li = document.createElement('li')
    li.append(Object.assign(document.createElement('strong'), { textContent: `${item.actor || 'unknown'} · ${item.kind || 'observation'}` }), Object.assign(document.createElement('span'), { textContent: item.summary || '' }))
    if (item.event_id) {
      const row = document.createElement('div'); row.className = 'button-row'
      const remember = document.createElement('button'); remember.type = 'button'; remember.textContent = 'Remember'
      remember.addEventListener('click', () => { const content = window.prompt('Bounded memory summary (no secrets, paths, code, URLs, stacks, or bodies):', item.summary || ''); if (content?.trim()) sendCommand({ kind: 'human_memory_disposition', event_id: item.event_id, disposition: 'remember', content: content.trim() }) })
      const forget = document.createElement('button'); forget.type = 'button'; forget.textContent = 'Forget'
      forget.addEventListener('click', () => sendCommand({ kind: 'human_memory_disposition', event_id: item.event_id, disposition: 'forget' }))
      row.append(remember, forget); li.append(row)
    }
    return li
  }))
}
function renderMemories(items) { renderList($('#memories'), items, (item) => `${item.disposition || 'recorded'} · ${item.provenance_event_id || '—'}\n${item.digest || '—'}`, 'No human memory decisions.') }
function renderReviews(items) {
  $('#review-count').textContent = String(items.length)
  const target = $('#reviews'); target.replaceChildren(...(items.length ? items.map((item) => {
    const li = document.createElement('li'); li.append(Object.assign(document.createElement('strong'), { textContent: item.summary || 'Human review requested.' }), Object.assign(document.createElement('small'), { textContent: item.requested_action || 'Review visible evidence.' }))
    const row = document.createElement('div'); row.className = 'button-row'
    for (const disposition of ['approve', 'deny', 'reject', 'defer']) { const button = document.createElement('button'); button.type = 'button'; button.textContent = disposition; button.addEventListener('click', () => sendCommand({ kind: 'human_review_disposition', event_id: item.event_id, disposition })); row.append(button) }
    li.append(row); return li
  }) : [Object.assign(document.createElement('li'), { textContent: 'No pending human review requests.' })]))
}
function renderDecision(snapshot) {
  const recommendation = snapshot.recommendation
  const available = commandAvailable(snapshot, 'human_decision')
  const panel = $('#decision-panel')
  panel.hidden = !recommendation || !available
  if (panel.hidden) return
  const recommendationId = recommendation.id || recommendation.recommendation_id
  $('#decision-summary').textContent = `${recommendation.decision || 'Recommendation'} · ${recommendationId || 'unknown id'}`
  $('#accept-decision').disabled = !recommendationId
  $('#defer-decision').disabled = !recommendationId
}
function commandAvailable(snapshot, kind) { return Array.isArray(snapshot.available_commands) && snapshot.available_commands.some((entry) => entry === kind || entry?.kind === kind || entry?.name === kind) }
function renderList(target, items, formatter, empty) { target.replaceChildren(...(items.length ? items.map((item) => Object.assign(document.createElement('li'), { textContent: formatter(item) })) : [Object.assign(document.createElement('li'), { textContent: empty })])) }

function bindNavigation() { document.querySelectorAll('.nav-item').forEach((button) => button.addEventListener('click', () => { const view = button.dataset.view; document.querySelectorAll('.nav-item').forEach((item) => item.classList.toggle('active', item === button)); document.querySelectorAll('[data-view-panel]').forEach((panel) => { panel.hidden = panel.dataset.viewPanel !== view }) })) }
function bindActions() {
  $('#theme').addEventListener('change', () => saveTheme($('#theme').value))
  $('#open-companion').addEventListener('click', async () => { if (!Number.isInteger(state.tabId)) return setStatus('No QCG tab is selected.', true); const result = await chrome.runtime.sendMessage({ type: 'qcg-console-open-side-panel', tab_id: state.tabId }).catch(() => ({ opened: 'none' })); setStatus(result.opened === 'side_panel' ? 'Companion side panel opened.' : result.opened === 'companion_tab' ? 'Opened companion-tab fallback.' : 'Browser declined companion opening.', result.opened === 'none') })
  $('#send').addEventListener('click', () => { const summary = $('#message').value.trim(); if (summary) sendCommand({ kind: 'human_message', summary }) })
  $('#override').addEventListener('input', () => { $('#record-override').disabled = $('#override').value.trim().length < 12 })
  $('#accept-decision').addEventListener('click', () => sendDecision('accepted'))
  $('#defer-decision').addEventListener('click', () => sendDecision('deferred'))
  $('#record-override').addEventListener('click', () => sendDecision('overridden'))
  $('#create-handoff').addEventListener('click', () => { const prompt = $('#handoff-prompt').value.trim(); if (prompt) sendCommand({ kind: 'gemini_manual_handoff_create', intent: $('#handoff-intent').value, prompt }) })
  $('#preview-reply').addEventListener('click', () => sendCommand({ kind: 'gemini_manual_reply_preview', raw: $('#gemini-reply').value }))
  $('#import-reply').addEventListener('click', () => sendCommand({ kind: 'gemini_manual_reply_import', raw: $('#gemini-reply').value }))
}
function sendCommand(command) {
  if (!state.port || !Number.isInteger(state.tabId)) return setStatus('Open a QCG tab before submitting a command.', true)
  if (!state.snapshot?.session_id) return setStatus('Wait for a bounded QCG session snapshot.', true)
  state.port.postMessage({ type: 'qcg-console-command.v1', request_id: crypto.randomUUID(), command: { schema_version: 'qcg-console-command.v1', session_id: state.snapshot.session_id, ...command } })
}
function sendDecision(choice) {
  const recommendation = state.snapshot?.recommendation
  const recommendation_id = recommendation?.id || recommendation?.recommendation_id
  const justification = $('#override').value.trim()
  if (!recommendation_id) return setStatus('No active recommendation is available.', true)
  if (choice === 'overridden' && justification.length < 12) return setStatus('An override requires at least 12 characters.', true)
  sendCommand(choice === 'overridden' ? { kind: 'human_decision', recommendation_id, choice, justification } : { kind: 'human_decision', recommendation_id, choice })
}
function handleResult(result) { if (result?.handoff) { const handoff = typeof result.handoff === 'string' ? result.handoff : JSON.stringify(result.handoff, null, 2); $('#handoff-preview').textContent = handoff; void navigator.clipboard.writeText(handoff).catch(() => undefined) } else if (result?.preview || result?.summary) $('#handoff-preview').textContent = result.preview || result.summary; if (result?.accepted) { $('#message').value = ''; $('#override').value = ''; $('#record-override').disabled = true; setStatus(result.message || 'Human command recorded. Quantum authority is unchanged.') } else setStatus(result?.error || result?.message || 'The companion command was rejected.', true) }
function setStatus(message, error = false) { $('#status').textContent = message; $('#status').classList.toggle('error', error) }
function evaluate(expression) { return new Promise((resolve, reject) => chrome.devtools.inspectedWindow.eval(expression, (result, exception) => exception ? reject(new Error(exception.value || 'Inspected-window evaluation failed.')) : resolve(result))) }
function hydrateTheme() { const theme = localStorage.getItem('qcg-console-theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'); $('#theme').value = theme; saveTheme(theme) }
function saveTheme(theme) { document.querySelector('.console').dataset.theme = theme; localStorage.setItem('qcg-console-theme', theme) }
