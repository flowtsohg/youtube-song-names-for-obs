// Youtube update the title with song names.
let element = document.querySelector('title');

// Sends the name.
function sendName() {
    chrome.runtime.sendMessage({ name: element.textContent.replace(' - YouTube', '') });
}

// Send the current name.
sendName();

// Observe changes on the element, and send the names.
new MutationObserver(() => {
    sendName();
}).observe(element, { childList: true });
