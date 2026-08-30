const status = document.querySelector('#status')
const context = document.querySelector('#context')
const message = document.querySelector('#message')
const actor = document.querySelector('#actor')
const kind = document.querySelector('#kind')
const messageStatus = document.querySelector('#message-status')
const participants = document.querySelector('#participants')
const reviews = document.querySelector('#reviews')
const messages = document.querySelector('#messages')
const memories = document.querySelector('#memories')
const handoffIntent = document.querySelector('#handoff-intent')
const handoffPrompt = document.querySelector('#handoff-prompt')
const geminiReply = document.querySelector('#gemini-reply')
const handoffPreview = document.querySelector('#handoff-preview')
let visible = document.visibilityState === 'visible'
let current = null

function evaluate(expression) {
  return new Promise((resolve, reject) => chrome.devtools.inspectedWindow.eval(expression, (result, exception) => exception ? reject(new Error(exception.value || 'Inspected-window evaluation failed.')) : resolve(result)))
}
function filtered(items) {
  return (items || []).filter((item) => (actor.value === 'all' || item.actor === actor.value) && (kind.value === 'all' || item.kind === kind.value) && (messageStatus.value === 'all' || item.status === messageStatus.value))
}
function renderList(target, items, empty) {
  target.replaceChildren(...(items.length ? items.map((item) => { const li = document.createElement('li'); li.textContent = item.summary || `${item.actor} · ${item.role}`; return li }) : [Object.assign(document.createElement('li'), { textContent: empty })]))
}
function renderMessageList(items) {
  if (!items.length) { renderList(messages, [], 'No messages match the filters.'); return }
  messages.replaceChildren(...items.map((item) => {
    const li = document.createElement('li')
    const meta = document.createElement('strong'); meta.textContent = `${item.actor} · ${item.role} · ${item.kind}`
    const text = document.createElement('span'); text.textContent = item.summary
    const state = document.createElement('small'); state.textContent = `${item.status} · ${item.confidence} confidence · identity ${item.identity_assurance}`
    const controls = document.createElement('div'); controls.className = 'actions'
    const remember = document.createElement('button'); remember.type = 'button'; remember.textContent = 'Remember'
    remember.addEventListener('click', async () => {
      const content = window.prompt('Bounded memory summary (no secrets, paths, code, URLs, stacks, or bodies):', item.summary)
      if (content === null) return
      try {
        const result = await evaluate(`window.__QCG_DEVTOOLS_V1__ ? window.__QCG_DEVTOOLS_V1__.queueHumanMemory(${JSON.stringify(item.event_id)}, 'remember', ${JSON.stringify(content)}) : ({accepted:false,error:'QCG bridge unavailable.'})`)
        if (!result?.accepted) throw new Error(result?.error || 'The memory was rejected.')
        status.textContent = 'Human memory queued; it cannot grant any quantum authority.'; window.setTimeout(() => { void refresh() }, 100)
      } catch (error) { status.textContent = error.message }
    })
    const forget = document.createElement('button'); forget.type = 'button'; forget.textContent = 'Forget'
    forget.addEventListener('click', async () => {
      try {
        const result = await evaluate(`window.__QCG_DEVTOOLS_V1__ ? window.__QCG_DEVTOOLS_V1__.queueHumanMemory(${JSON.stringify(item.event_id)}, 'forget') : ({accepted:false,error:'QCG bridge unavailable.'})`)
        if (!result?.accepted) throw new Error(result?.error || 'The forget request was rejected.')
        status.textContent = 'Human forget disposition queued; the tombstone retains no content.'; window.setTimeout(() => { void refresh() }, 100)
      } catch (error) { status.textContent = error.message }
    })
    controls.append(remember, forget)
    li.append(meta, text, state, controls)
    return li
  }))
}
async function refresh() {
  if (!visible) return
  try {
    current = await evaluate('window.__QCG_DEVTOOLS_V1__ ? window.__QCG_DEVTOOLS_V1__.getCachedPanelSnapshot() : null')
    status.textContent = current?.last_command
      ? `${current.last_command.status} · ${current.last_command.message}`
      : current ? `Connected · ${current.phase} · ${current.authority_state}` : 'Open a WebMCP-QCG page to connect.'
    context.textContent = JSON.stringify(current ? { manifest: current.artifact, recommendation: current.recommendation, counters: current.effects, storage_mode: current.storage_mode } : null, null, 2) || 'No bounded context yet.'
    renderList(participants, current?.participants || [], 'No declared participants.')
    renderReviewList(filtered(current?.human_review_requests || []))
    renderMemoryList(current?.memories || [])
    renderMessageList(filtered(current?.messages))
  } catch (error) { status.textContent = error.message; context.textContent = 'Unable to read a QCG DevTools bridge.' }
}
function renderReviewList(items) {
  if (!items.length) { renderList(reviews, [], 'No pending human review requests.'); return }
  reviews.replaceChildren(...items.map((item) => {
    const li = document.createElement('li')
    const text = document.createElement('span'); text.textContent = item.summary
    const action = document.createElement('small'); action.textContent = `Requested action: ${item.requested_action || 'Review the visible evidence.'}`
    const evidence = document.createElement('small'); evidence.textContent = `Evidence: ${(item.evidence_refs || []).join(', ') || 'No structured reference supplied.'}`
    const controls = document.createElement('div'); controls.className = 'actions'
    for (const disposition of ['approve', 'deny', 'reject', 'defer']) {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = disposition
      button.addEventListener('click', async () => {
        controls.querySelectorAll('button').forEach((entry) => { entry.disabled = true })
        try {
          const result = await evaluate(`window.__QCG_DEVTOOLS_V1__ ? window.__QCG_DEVTOOLS_V1__.queueHumanReviewDisposition(${JSON.stringify(item.event_id)}, ${JSON.stringify(disposition)}) : ({accepted:false,error:'QCG bridge unavailable.'})`)
          if (!result?.accepted) throw new Error(result?.error || 'The review outcome was rejected.')
          status.textContent = `Human ${disposition} queued; quantum authority is unchanged.`
          window.setTimeout(() => { void refresh() }, 100)
        } catch (error) { status.textContent = error.message; controls.querySelectorAll('button').forEach((entry) => { entry.disabled = false }) }
      })
      controls.append(button)
    }
    li.append(text, action, evidence, controls); return li
  }))
}
function renderMemoryList(items) {
  if (!items.length) { renderList(memories, [], 'No human memory decisions.'); return }
  memories.replaceChildren(...items.map((item) => {
    const li = document.createElement('li')
    li.textContent = `${item.disposition} · ${item.provenance_event_id} · ${item.digest}`
    return li
  }))
}
document.addEventListener('visibilitychange', () => { visible = document.visibilityState === 'visible'; if (visible) void refresh() })
chrome.runtime.onMessage.addListener((payload) => {
  if (!payload || payload.type !== 'qcg-devtools-panel-visibility' || typeof payload.visible !== 'boolean') return
  visible = payload.visible
  if (visible) void refresh()
})
window.setInterval(() => { void refresh() }, 750)
actor.addEventListener('change', refresh); kind.addEventListener('change', refresh); messageStatus.addEventListener('change', refresh)
document.querySelector('#send').addEventListener('click', async () => {
  const summary = message.value.trim(); if (!summary) return
  try {
    const result = await evaluate(`window.__QCG_DEVTOOLS_V1__ ? window.__QCG_DEVTOOLS_V1__.queueHumanMessage(${JSON.stringify({ summary })}) : ({accepted:false,error:'QCG bridge unavailable.'})`)
    if (!result?.accepted) throw new Error(result?.error || 'The message was rejected.')
    message.value = ''
    status.textContent = 'Human message queued; quantum authority is unchanged.'
    window.setTimeout(() => { void refresh() }, 100)
  } catch (error) { status.textContent = error.message }
})
document.querySelector('#copy').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(JSON.stringify(current, null, 2)); status.textContent = 'Bounded context copied. Review it before sharing.' }
  catch { status.textContent = 'The browser declined clipboard access; the visible context remains available.' }
})
document.querySelector('#create-handoff').addEventListener('click', async () => {
  const prompt = handoffPrompt.value.trim(); if (!prompt) return
  try {
    const result = await evaluate(`window.__QCG_DEVTOOLS_V1__ ? window.__QCG_DEVTOOLS_V1__.createGeminiManualHandoff(${JSON.stringify({ intent: handoffIntent.value, prompt })}) : null`)
    if (!result) throw new Error('QCG bridge unavailable.')
    handoffPreview.textContent = JSON.stringify(result, null, 2)
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2))
    status.textContent = 'Manual Gemini packet copied. Paste it into Gemini DevTools yourself.'
  } catch (error) { status.textContent = error.message || 'Unable to create the manual handoff.' }
})
document.querySelector('#preview-reply').addEventListener('click', async () => {
  try {
    const result = await evaluate(`window.__QCG_DEVTOOLS_V1__ ? window.__QCG_DEVTOOLS_V1__.previewGeminiManualReply(${JSON.stringify(geminiReply.value)}) : ({accepted:false,error:'QCG bridge unavailable.'})`)
    if (!result?.accepted) throw new Error(result?.error || 'The reply was rejected.')
    handoffPreview.textContent = result.summary
    status.textContent = 'Untrusted reply previewed; it has not been imported.'
  } catch (error) { status.textContent = error.message }
})
document.querySelector('#import-reply').addEventListener('click', async () => {
  try {
    const result = await evaluate(`window.__QCG_DEVTOOLS_V1__ ? window.__QCG_DEVTOOLS_V1__.queueGeminiManualReply(${JSON.stringify(geminiReply.value)}) : ({accepted:false,error:'QCG bridge unavailable.'})`)
    if (!result?.accepted) throw new Error(result?.error || 'The reply was rejected.')
    status.textContent = 'Untrusted Gemini reply queued in the isolated ledger.'
    window.setTimeout(() => { void refresh() }, 100)
  } catch (error) { status.textContent = error.message }
})
void refresh()
