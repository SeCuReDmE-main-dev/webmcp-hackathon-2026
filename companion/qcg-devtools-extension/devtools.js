const root = document.documentElement

root.dataset.qcgPanel = 'registering'

function signalVisibility(visible) {
  root.dataset.qcgPanelVisible = String(visible)
  void chrome.runtime.sendMessage({ type: 'qcg-devtools-panel-visibility', visible }).catch(() => undefined)
}

chrome.devtools.panels.create('QCG', '', 'panel.html', (panel) => {
  if (chrome.runtime.lastError) {
    root.dataset.qcgPanel = 'error'
    root.dataset.qcgPanelError = chrome.runtime.lastError.message
    return
  }

  root.dataset.qcgPanel = 'created'
  panel.onShown.addListener(() => { signalVisibility(true) })
  panel.onHidden.addListener(() => { signalVisibility(false) })
})
