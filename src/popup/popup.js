/**
 * Popup UI logic
 * Handles settings and user preferences
 */

// Default settings
const DEFAULT_SETTINGS = {
  preferredUnit: 'imperial',
  enableAmazon: true,
  enableWalmart: true,
  enableInstacart: true,
  enableCostco: true,
  debugMode: false
};

// Load settings from storage
function loadSettings() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
    // Update UI with loaded settings
    document.getElementById('preferredUnit').value = settings.preferredUnit;
    document.getElementById('enableAmazon').checked = settings.enableAmazon;
    document.getElementById('enableWalmart').checked = settings.enableWalmart;
    document.getElementById('enableInstacart').checked = settings.enableInstacart;
    document.getElementById('enableCostco').checked = settings.enableCostco;
    document.getElementById('debugMode').checked = settings.debugMode;
  });
}

// Save settings to storage
function saveSettings() {
  const settings = {
    preferredUnit: document.getElementById('preferredUnit').value,
    enableAmazon: document.getElementById('enableAmazon').checked,
    enableWalmart: document.getElementById('enableWalmart').checked,
    enableInstacart: document.getElementById('enableInstacart').checked,
    enableCostco: document.getElementById('enableCostco').checked,
    debugMode: document.getElementById('debugMode').checked
  };

  chrome.storage.sync.set(settings, () => {
    // Show save confirmation
    const button = document.getElementById('saveSettings');
    const originalText = button.textContent;
    button.textContent = 'Saved!';
    button.style.backgroundColor = '#4caf50';

    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = '';
    }, 2000);

    // Notify content scripts to reload
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.url && (
          tab.url.includes('amazon.com') ||
          tab.url.includes('walmart.com') ||
          tab.url.includes('instacart.com') ||
          tab.url.includes('costco.com')
        )) {
          chrome.tabs.sendMessage(tab.id, { action: 'settingsUpdated', settings }, () => {
            // Ignore errors if content script not loaded
            if (chrome.runtime.lastError) {
              console.log('Could not notify tab:', tab.id);
            }
          });
        }
      });
    });
  });
}

// Check if extension is active on current tab
function checkStatus() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].url) {
      const url = tabs[0].url;
      const isSupported = url.includes('amazon.com') ||
                         url.includes('walmart.com') ||
                         url.includes('instacart.com') ||
                         url.includes('costco.com');

      const statusDot = document.getElementById('statusDot');
      const statusText = document.getElementById('statusText');

      if (isSupported) {
        statusDot.classList.add('active');
        statusText.textContent = 'Extension Active';
      } else {
        statusDot.classList.remove('active');
        statusText.textContent = 'Visit a supported site';
      }
    }
  });
}

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  checkStatus();

  // Setup event listeners
  document.getElementById('saveSettings').addEventListener('click', saveSettings);

  // Auto-save on checkbox changes
  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', saveSettings);
  });

  // Auto-save on select changes
  document.getElementById('preferredUnit').addEventListener('change', saveSettings);
});
