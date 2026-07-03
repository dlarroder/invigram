chrome.runtime.onMessage.addListener((msg: { type: string; isActive: boolean }) => {
  if (msg?.type === 'setActive') {
    window.dispatchEvent(new CustomEvent('invigram-setActive', { detail: { isActive: msg.isActive } }));
  }
});
