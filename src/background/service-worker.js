/**
 * Background service worker
 * Handles extension lifecycle and message passing
 */

// Initialize extension
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Grocery Unit Pricing extension installed');

    // Set default settings
    chrome.storage.sync.set({
      preferredUnit: 'imperial',
      enableAmazon: true,
      enableWalmart: true,
      enableInstacart: true,
      enableCostco: true,
      debugMode: false
    });

    // Open welcome page (optional)
    // chrome.tabs.create({ url: 'welcome.html' });
  } else if (details.reason === 'update') {
    console.log('Grocery Unit Pricing extension updated');
  }
});

// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getSettings') {
    // Return current settings
    chrome.storage.sync.get(null, (settings) => {
      sendResponse({ settings });
    });
    return true; // Keep message channel open for async response
  }

  if (message.action === 'log') {
    // Debug logging from content scripts
    console.log('Content script:', message.data);
  }

  if (message.action === 'error') {
    // Error reporting from content scripts
    console.error('Content script error:', message.error);
  }
});

// Monitor tab updates to inject content scripts dynamically if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const url = tab.url;

    // Check if on a supported site
    const isSupported = url.includes('amazon.com') ||
                       url.includes('walmart.com') ||
                       url.includes('instacart.com') ||
                       url.includes('costco.com');

    if (isSupported) {
      console.log('Grocery Unit Pricing active on:', url);
    }
  }
});

// Handle browser action click (optional - currently using popup)
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked');
});
