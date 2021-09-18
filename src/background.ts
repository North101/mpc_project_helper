chrome.tabs.onUpdated.addListener((tabId: number, _changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
  if (tab.url?.indexOf('https://www.makeplayingcards.com/') == 0) {
    (chrome as any).action.enable(tabId);
  } else {
    (chrome as any).action.disable(tabId);
  }
});