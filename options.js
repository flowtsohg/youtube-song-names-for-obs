const form = document.getElementById('form');
const format = document.getElementById('format');
const defaultFormat = '{title}';

// Get the existing format.
// If it doesn't exist (first time the options are opened), set it to the default.
chrome.storage.local.get('format', (result) => {
  if (result.format) {
    format.value = result.format;
  } else {
    format.value = defaultFormat;
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  chrome.storage.local.set({ format: format.value });
});
