// Youtube updates the title with song names.
let element = document.querySelector('title');

// Sends the name.
function sendName() {
    let name = element.textContent;

    if (name !== 'YouTube Music') {
        // www.youtube.com/watch titles end with " - YouTube".
        // music.youtube.com/watch titles end with " - YouTube Music".
        chrome.runtime.sendMessage({ name: name.slice(0, name.lastIndexOf(' - YouTube')) });
    }
}

// Send the current name.
sendName();

// Observe changes on the element, and send the names.
new MutationObserver(() => {
    sendName();
}).observe(element, { childList: true });
