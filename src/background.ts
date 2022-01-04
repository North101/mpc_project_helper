chrome.runtime.onInstalled.addListener(() => {
  chrome.action.disable();

  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { urlMatches: 'https://www.makeplayingcards.com/*' },
        }),
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { urlMatches: 'https://www.printerstudio.co.uk/*' },
        })
      ],
      actions: [new (chrome.declarativeContent as any).ShowAction()],
    }]);
  });
});

chrome.action.onClicked.addListener((tab: any) => {
  chrome.tabs.sendMessage(tab.id!, {
    message: 'show',
  });
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.message === 'download') {
    chrome.downloads.download({
      url: `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(request.value))}`,
      filename: 'project.txt',
    });
  } else if (request.message === 'open') {
    chrome.tabs.create({
      url: request.url,
    });
  }
});