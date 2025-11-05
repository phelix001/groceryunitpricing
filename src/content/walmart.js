/**
 * Walmart-specific content script
 * Handles unit pricing for Walmart.com product listings
 */

(function() {
  'use strict';

  const walmartConfig = {
    // Product container selector
    productSelector: '[data-item-id], [data-testid="list-view"], [data-automation-id="product"]',

    // Price selector
    priceSelector: '[data-automation-id="product-price"] .w_iUH7, .price-main, [aria-label*="current price"], .f2',

    // Description/title selector
    descriptionSelector: '[data-automation-id="product-title"], [link-identifier], span[data-automation-id="product-title"]',

    // Custom injection point finder
    getInjectionPoint: (productElement) => {
      // Find price container
      const priceContainer = productElement.querySelector('[data-automation-id="product-price"]');
      if (priceContainer) {
        return priceContainer;
      }

      // Fallback
      const priceElement = productElement.querySelector('.price-main, .f2');
      if (priceElement) {
        return priceElement.parentElement;
      }

      return productElement;
    },

    // Enable dynamic content observation
    observeDynamic: true,

    // Re-process on scroll
    reprocessEvents: ['scroll']
  };

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.GroceryUnitPricing.init(walmartConfig);
    });
  } else {
    window.GroceryUnitPricing.init(walmartConfig);
  }

})();
