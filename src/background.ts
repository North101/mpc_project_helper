export {}

const conditions = chrome.runtime.getManifest().content_scripts?.flatMap((e) => {
  if (e.matches == null || !e.js?.includes('src/content.js')) return []

  return e.matches.map(e => new chrome.declarativeContent.PageStateMatcher({
    pageUrl: { urlMatches: e },
  })) ?? []
}) ?? []

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.disable()

  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: conditions,
      actions: [new chrome.declarativeContent.ShowAction()],
    }])
  })
})

chrome.action.onClicked.addListener(tab => {
  chrome.tabs.sendMessage(tab.id!, {
    message: 'show',
  })
})

chrome.runtime.onMessage.addListener(request => {
  if (request.message === 'open') {
    chrome.tabs.create({
      url: request.url,
    })
  }
})
