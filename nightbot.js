// Nightbot creates the song title element at runtime.
// Observe mutations to body until the element is created.
new MutationObserver((mutationList, observer) => {
    for (let mutation of mutationList) {
        let element = mutation.target;

        // The properties of the song title element.
        if (element.nodeName === 'STRONG' && element.className === 'ng-binding' && element.textContent !== 'Song Requests') {
            // No need to observe any further mutations.
            observer.disconnect();

            // Sends the name.
            function sendName() {
                chrome.runtime.sendMessage({ name: element.textContent });
            }

            // Send the current name.
            sendName();

            // Observe changes on the element, and send the names.
            new MutationObserver(() => {
                sendName();
            }).observe(element, { characterData: true, subtree: true });
        }
    }
}).observe(document.body, { childList: true, subtree: true });
