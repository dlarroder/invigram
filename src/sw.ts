import { injectInterceptor } from './injector';

let isActive = true;

function updateBadge() {
  chrome.action.setBadgeBackgroundColor({
    color: isActive ? '#00FF00' : '#880808',
  });
  chrome.action.setBadgeText({
    text: isActive ? 'On' : 'Off',
  });
}

updateBadge();

chrome.action.onClicked.addListener(() => {
  isActive = !isActive;
  updateBadge();

  chrome.tabs.query({ url: 'https://*.instagram.com/*' }, (tabs) => {
    for (const tab of tabs) {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, { type: 'setActive', isActive });
      }
    }
  });
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg && msg.type === 'getActive') {
    sendResponse({ isActive });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('instagram.com')) {
    chrome.scripting.executeScript({
      target: { tabId },
      func: injectInterceptor,
      args: [isActive],
      world: 'MAIN',
    });
  }
});
