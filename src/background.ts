chrome.action.onClicked.addListener((tab: any) => {
  chrome.tabs.sendMessage(tab.id!, {
    message: 'show',
  });
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.message === 'download') {
    chrome.downloads.download({
      url: `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(request.value))}`,
      filename: 'project.json',
    });
  } else if (request.message === 'open') {
    chrome.tabs.create({
      url: request.url,
    });
  }
});