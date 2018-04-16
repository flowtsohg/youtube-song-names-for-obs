// Youtube updates the title with song names.
let element = document.querySelector('title');

// Sends the name.
function sendName() {
    // Slice out the " - YouTube" part.
    chrome.runtime.sendMessage({ name: element.textContent.slice(0, -10) });
}

// Send the current name.
sendName();

// Observe changes on the element, and send the names.
new MutationObserver(() => {
    sendName();
}).observe(element, { childList: true });
