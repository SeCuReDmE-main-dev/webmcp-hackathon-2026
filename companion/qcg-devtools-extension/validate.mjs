import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = new URL('.', import.meta.url)
const read = (name) => readFileSync(new URL(name, root), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(message) }
const manifest = JSON.parse(read('manifest.json'))
const development = JSON.parse(read('manifest.dev.json'))

for (const [name, value] of [['production', manifest], ['development', development]]) {
  assert(value.manifest_version === 3, `${name}: Manifest V3 is required`)
  assert(value.devtools_page === 'devtools.html', `${name}: missing DevTools entrypoint`)
  assert(value.side_panel?.default_path === 'panel.html', `${name}: missing shared side-panel UI`)
  assert(value.background?.service_worker === 'background.js', `${name}: missing service worker`)
  assert(value.permissions?.includes('sidePanel'), `${name}: sidePanel permission is required`)
  assert(!value.permissions?.includes('tabs') && !value.permissions?.includes('scripting'), `${name}: broad permissions are not allowed`)
  assert(value.content_scripts?.length === 2 && value.content_scripts[0].world === 'MAIN', `${name}: require MAIN and isolated bridge pair`)
}
assert(JSON.stringify(manifest.host_permissions) === JSON.stringify(['https://qcg.securedme.ca/*']), 'production: only qcg.securedme.ca may receive a bridge')
assert(development.host_permissions.includes('http://localhost:5173/*') && development.host_permissions.includes('http://127.0.0.1:5173/*'), 'development: local QCG hosts are required')

const background = read('background.js')
const pageBridge = read('pageBridge.js')
const panel = read('panel.js')
for (const kind of ['human_review_disposition', 'human_memory_disposition', 'human_message', 'human_decision', 'gemini_manual_handoff_create', 'gemini_manual_reply_preview', 'gemini_manual_reply_import']) {
  assert(background.includes(`'${kind}'`) && pageBridge.includes(`'${kind}'`) && panel.includes(`'${kind}'`), `command ${kind} must be allowlisted end-to-end`)
}
for (const forbidden of ['run_bounded_local_simulation', 'consent', 'provider_calls', 'qpu_submission']) {
  assert(!background.includes(forbidden), `broker must not expose ${forbidden}`)
}
assert(pageBridge.includes('__QCG_CONSOLE_V2__') && pageBridge.includes('executeConsoleCommand') && pageBridge.includes('queueHumanReviewDisposition'), 'bridge must prefer v2 and retain collaboration-only v1 fallback')
assert(background.includes("value.schema_version !== 'qcg-console-command.v1'") && background.includes("value.kind === 'human_decision'"), 'commands require the v1 console schema and human decisions')
assert(panel.includes("kind: 'human_decision'") && panel.includes("available_commands"), 'human decisions must be explicit UI actions gated by v2 availability')
assert(panel.includes("qcg-console-devtools.v1") && panel.includes("qcg-console-side-panel.v1"), 'DevTools and side panel must share the console transport')
console.log('QCG extension validation passed: MV3 manifests, restricted hosts, strict command allowlist, and v1/v2 bridge fallback.')
