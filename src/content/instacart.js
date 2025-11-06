/**
 * Instacart-specific content script
 * Handles unit pricing for Instacart.com product listings
 */

(function() {
  'use strict';

  const instacartConfig = {
    // Product container selector - Updated for 2025 Instacart structure
    // Targets both ad banners (li elements) and main product grid (div.e-fsno8i)
    productSelector: 'li[data-testid^="item_list_item"], div.e-fsno8i, div[role="group"][aria-label*="product card"], [data-testid="product-card"], [data-testid="item-card"], [class*="ProductCard"], [class*="ItemCard"]',

    // Price selector - Updated for current Instacart class structure
    // The e-1632met class contains the price, e-gx2pr0 is the formatted display
    priceSelector: '.e-1632met, .e-gx2pr0, [data-testid="price"], [data-testid="product-price"], [class*="Price"]',

    // Description/title selector - Updated to target both ad banners (.e-xahufp) and main grid (.e-1gh06cz)
    descriptionSelector: '.e-xahufp, .e-1gh06cz, [data-testid="item-name"], [data-testid="product-name"], h3, h4',

    // Quantity selector - targets the e-cauxk8 class for size/quantity info
    quantitySelector: '.e-cauxk8',

    // Custom injection point finder
    getInjectionPoint: (productElement) => {
      // Find the price element with current selectors
      let priceElement = productElement.querySelector('.e-1632met, .e-gx2pr0');

      if (!priceElement) {
        priceElement = productElement.querySelector('[data-testid="price"], [data-testid="product-price"]');
      }

      if (!priceElement) {
        priceElement = productElement.querySelector('[class*="Price"], [class*="price"]');
      }

      if (priceElement) {
        // Find the price container parent (usually has e-1916dlq class)
        let container = priceElement.closest('.e-1916dlq');
        if (container) {
          return container;
        }
        return priceElement.parentElement;
      }

      // Fallback to product card
      return productElement;
    },

    // Enable dynamic content observation (critical for Instacart's React-based UI)
    observeDynamic: true,

    // Re-process on scroll (for infinite scroll)
    reprocessEvents: ['scroll']
  };

  // Debug logging
  if (window.GUP_DEBUG) {
    console.log('[GUP] Instacart: Initializing with config:', instacartConfig);
  }

  // Track current URL to detect SPA navigation
  let currentUrl = window.location.href;

  // Initialize extension
  function initialize() {
    if (window.GUP_DEBUG) {
      console.log('[GUP] Instacart: Initializing on:', window.location.href);
    }

    if (typeof window.GroceryUnitPricing !== 'undefined') {
      window.GroceryUnitPricing.init(instacartConfig);
    } else {
      console.error('[GUP] GroceryUnitPricing not loaded!');
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initialize, 1000); // Delay for React to render
    });
  } else {
    setTimeout(initialize, 1000);
  }

  // Handle SPA navigation (Instacart uses React Router)
  // Listen for URL changes without page reload
  function checkUrlChange() {
    if (currentUrl !== window.location.href) {
      if (window.GUP_DEBUG) {
        console.log('[GUP] Instacart: URL changed from', currentUrl, 'to', window.location.href);
      }
      currentUrl = window.location.href;

      // Wait for React to render new content, then re-initialize
      setTimeout(initialize, 1500);
    }
  }

  // Monitor for SPA navigation using multiple methods
  // 1. Listen for popstate (browser back/forward)
  window.addEventListener('popstate', () => {
    if (window.GUP_DEBUG) {
      console.log('[GUP] Instacart: popstate event detected');
    }
    setTimeout(checkUrlChange, 100);
  });

  // 2. Override pushState and replaceState to detect programmatic navigation
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function() {
    originalPushState.apply(this, arguments);
    setTimeout(checkUrlChange, 100);
  };

  history.replaceState = function() {
    originalReplaceState.apply(this, arguments);
    setTimeout(checkUrlChange, 100);
  };

  // 3. Fallback: Check URL every 2 seconds (for cases we might miss)
  setInterval(checkUrlChange, 2000);

})();
