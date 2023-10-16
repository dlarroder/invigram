namespace magic {
  let isActive = true;

  chrome.browserAction.setBadgeBackgroundColor({
    color: isActive ? '#00FF00' : '#880808',
  });

  chrome.browserAction.setBadgeText({
    text: isActive ? 'On' : 'Off',
  });

  chrome.browserAction.onClicked.addListener(() => {
    isActive = !isActive;

    chrome.browserAction.setBadgeBackgroundColor({
      color: isActive ? '#00FF00' : '#880808',
    });

    chrome.browserAction.setBadgeText({
      text: isActive ? 'On' : 'Off',
    });
  });

  chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      if (details && details.requestBody && details.requestBody.formData) {
        const {
          requestBody: { formData },
        } = details;

        const statusBlocking = formData.fb_api_req_friendly_name.includes(
          'PolarisAPIReelSeenMutation'
        );

        return { cancel: isActive && statusBlocking };
      } else {
        return { cancel: false };
      }
    },
    {
      urls: [
        '*://*.instagram.com/api/v1/stories/reel/seen*',
        '*://*.instagram.com/api/graphql*',
      ],
    },
    ['blocking', 'requestBody']
  );
}
