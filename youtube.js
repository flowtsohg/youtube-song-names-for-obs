// Youtube updates the title with song names.
let element = document.querySelector('title');

// Sends the name.
function sendName() {
    let name = element.textContent;
    
    // Titles end with " - YouTube".
    chrome.runtime.sendMessage({ name: name.slice(0, name.lastIndexOf(' - YouTube')) });
}

// Observe changes on the element, and send the names.
new MutationObserver(() => {
    sendName();
}).observe(element, { childList: true });
