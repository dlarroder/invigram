var magic;
(function (magic) {
    var isActive = true;
    chrome.browserAction.setBadgeBackgroundColor({
        color: isActive ? '#00FF00' : '#880808',
    });
    chrome.browserAction.setBadgeText({
        text: isActive ? 'On' : 'Off',
    });
    chrome.browserAction.onClicked.addListener(function () {
        isActive = !isActive;
        chrome.browserAction.setBadgeBackgroundColor({
            color: isActive ? '#00FF00' : '#880808',
        });
        chrome.browserAction.setBadgeText({
            text: isActive ? 'On' : 'Off',
        });
    });
    chrome.webRequest.onBeforeRequest.addListener(function () { return ({
        cancel: isActive,
    }); }, {
        urls: [
            '*://*.instagram.com/api/v1/stories/reel/seen*',
            '*://*.instagram.com/api/graphql*',
        ],
    }, ['blocking']);
})(magic || (magic = {}));
