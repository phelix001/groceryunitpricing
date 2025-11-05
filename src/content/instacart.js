/**
 * Instacart-specific content script
 * Handles unit pricing for Instacart.com product listings
 */

(function() {
  'use strict';

  const instacartConfig = {
    // Product container selector
    productSelector: '[data-testid="product-card"], [class*="ProductCard"], [data-radix-aspect-ratio-wrapper]',

    // Price selector (Instacart uses various formats)
    priceSelector: '[class*="CurrentPrice"], [class*="price"], [data-testid="price"]',

    // Description/title selector
    descriptionSelector: '[class*="ItemName"], [class*="ItemTitle"], [data-testid="item-name"], [class*="product-name"]',

    // Custom injection point finder
    getInjectionPoint: (productElement) => {
      // Find the price element
      const priceElement = productElement.querySelector('[class*="CurrentPrice"], [class*="price"]');
      if (priceElement) {
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

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        window.GroceryUnitPricing.init(instacartConfig);
      }, 1000); // Delay for React to render
    });
  } else {
    setTimeout(() => {
      window.GroceryUnitPricing.init(instacartConfig);
    }, 1000);
  }

})();
