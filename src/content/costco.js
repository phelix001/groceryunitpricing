/**
 * Costco-specific content script
 * Handles unit pricing for Costco.com and sameday.costco.com (Instacart-powered)
 */

(function() {
  'use strict';

  const costcoConfig = {
    // Product container selector (covers both regular Costco and Instacart-powered)
    productSelector: '[data-testid="product-card"], [automation-id="productTile"], .product, .product-tile',

    // Price selector
    priceSelector: '[class*="price"], [data-testid="price"], .price-current, [automation-id="productPrice"]',

    // Description/title selector
    descriptionSelector: '[class*="description"], [data-testid="item-name"], .description, [automation-id="productTitle"]',

    // Custom injection point finder
    getInjectionPoint: (productElement) => {
      // Find the price element
      const priceElement = productElement.querySelector('[class*="price"], .price-current');
      if (priceElement) {
        return priceElement.parentElement;
      }

      // Fallback
      return productElement;
    },

    // Enable dynamic content observation
    observeDynamic: true,

    // Re-process on scroll
    reprocessEvents: ['scroll']
  };

  // Wait for DOM to be ready (with delay for React-based rendering)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        window.GroceryUnitPricing.init(costcoConfig);
      }, 1000);
    });
  } else {
    setTimeout(() => {
      window.GroceryUnitPricing.init(costcoConfig);
    }, 1000);
  }

})();
