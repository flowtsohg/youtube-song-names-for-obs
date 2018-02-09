// For now hardcoded for YouTube.
function transformTitle(name) {
  return name.replace(' - YouTube', '');
}

function stringToUrl(s) {
  return URL.createObjectURL(new Blob([s], { type: "text/plain" }));
}

function getTab(callback, justRemoved) {
  // We want YouTube video tabs.
  let queryInfo = {
    url: 'https://www.youtube.com/watch*'
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    for (let tab of tabs) {
      // getTab() is used also when tabs are removed.
      // For some reason, the onRemoved event happens before the tab is actually removed, but at the same time doesn't pass in the tab.
      // Therefore, the removed tab's id is passed here, and if its tab is found, it is simply ignored.
      // Other than that, We only care about currently audible tabs.
      if (tab.id !== justRemoved && tab.audible) {
        callback(tab);
        return;
      }
    }

    // If no relevant tab was found, the callback is still called, because we also care if there is no music playing at all.
    callback();
  });
}

let lastTab;

function saveTab(tab) {
  // If there is no relevant tab, and there wasn't a relevant tab also on the last change, don't do anything.
  // No need to pointlessly clear the file more than once.
  // This will happen when there are no relevant tabs, and there are tab title changes.
  if (!tab && !lastTab) {
    return;
  }

  // Keep a reference so the condition above works.
  lastTab = tab;

  let saveData = '';

  // If this is a new tab, save its title.
  // Otherwise the file will be cleared.
  if (tab) {
    saveData = transformTitle(tab.title);
  }

  // Incognito mode to hide the download spam.
  chrome.downloads.download({ url: stringToUrl(saveData), filename: 'currentsong.txt', conflictAction: 'overwrite', incognito: true });
}

// Listen to tab updates.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only update after title or audible changes.
  if (tab.url.startsWith('https://www.youtube.com/watch') && (changeInfo.title !== undefined || changeInfo.audible !== undefined)) {
    getTab(saveTab);
  }
});

// Listen to tabs being removed.
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  getTab(saveTab, tabId);
});

// Start.
getTab(saveTab);
