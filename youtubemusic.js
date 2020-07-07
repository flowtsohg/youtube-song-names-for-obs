// Sends the name.
function sendName(name) {
    chrome.runtime.sendMessage({ name });
}

// If this is a new tab, then the player bar won't be there, in which case mutations need to be observed until it's created.
// Otherwise just get it directly.
let element = document.querySelector('ytmusic-player-bar .title');

if (element) {
    sendName(element.title);

    // Observe changes on the element, and send the names.
    new MutationObserver(() => {
        sendName(element.title);
    }).observe(element, { attributes: true });
} else {
    // First wait for the shared player bar to be created.
    new MutationObserver((mutationList, observer) => {
        for (let mutation of mutationList) {
            let topElement = mutation.target;

            // The shared player bar.
            if (topElement.nodeName === 'YTMUSIC-PLAYER-BAR') {
                observer.disconnect();

                // By the time the code reaches this, the page already seems to create all of the DOM, so no further mutation observing is needed.
                let element = topElement.querySelector('.title');

                sendName(element.title);

                // Observe changes on the element, and send the names.
                new MutationObserver(() => {
                    sendName(element.title);
                }).observe(element, { attributes: true });
            }
        }
    }).observe(document.body, { childList: true, subtree: true });
}
