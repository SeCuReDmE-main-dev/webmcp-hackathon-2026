import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'

const source = readFileSync(new URL('./contentBridge.js', import.meta.url), 'utf8')
const listeners = new Map()
const posted = []
const sent = []

class FakeElement {
  constructor(requestId) { this.requestId = requestId }
  closest(selector) { return selector === '[data-qcg-open-companion]' ? this : null }
  getAttribute(name) { return name === 'data-qcg-open-companion' ? this.requestId : null }
}

const port = {
  onMessage: { addListener() {} },
  postMessage() {}
}

const context = {
  Element: FakeElement,
  location: { origin: 'https://qcg.securedme.ca' },
  window: {
    addEventListener(type, listener) { listeners.set(`window:${type}`, listener) },
    postMessage(message, origin) { posted.push({ message, origin }) },
    setInterval() { return 1 }
  },
  document: {
    addEventListener(type, listener, capture) { listeners.set(`document:${type}`, { listener, capture }) }
  },
  chrome: {
    runtime: {
      connect() { return port },
      async sendMessage(message) { sent.push(message); return { opened: 'side_panel', reason: 'opened' } }
    }
  }
}

vm.runInNewContext(source, context, { filename: 'contentBridge.js' })

const click = listeners.get('document:click')
assert.equal(click.capture, true, 'the companion trigger must use the capture phase')

const requestId = '7310b1d5-2f9f-45a9-9f77-55f73d1f5189'
click.listener({ isTrusted: false, target: new FakeElement(requestId) })
assert.equal(sent.length, 0, 'untrusted synthetic clicks must be ignored')

click.listener({ isTrusted: true, target: new FakeElement(requestId) })
await new Promise((resolve) => setImmediate(resolve))

assert.equal(JSON.stringify(sent), JSON.stringify([{ type: 'qcg-console-open-side-panel', request_id: requestId }]))
assert.equal(posted.at(-1).origin, 'https://qcg.securedme.ca')
assert.equal(JSON.stringify(posted.at(-1).message), JSON.stringify({
  channel: 'qcg-console-extension-control.v1',
  type: 'open_companion_result',
  request_id: requestId,
  status: 'side_panel',
  reason: 'opened'
}))

console.log('QCG Companion trusted-click handshake passed.')
