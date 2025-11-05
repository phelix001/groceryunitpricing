/**
 * Instacart-specific content script
 * Handles unit pricing for Instacart.com product listings
 */

(function() {
  'use strict';

  const instacartConfig = {
    // Product container selector - try multiple patterns
    productSelector: '[data-testid="product-card"], [data-testid="item-card"], [class*="ProductCard"], [class*="ItemCard"], article, [role="article"], li[class*="item"]',

    // Price selector (Instacart uses various formats) - expanded patterns
    priceSelector: '[data-testid="price"], [data-testid="product-price"], [class*="Price"], [class*="price"], span[class*="currency"]',

    // Description/title selector - expanded patterns
    descriptionSelector: '[data-testid="item-name"], [data-testid="product-name"], [class*="ItemName"], [class*="ItemTitle"], [class*="ProductName"], [class*="ProductTitle"], h3, h4',

    // Custom injection point finder
    getInjectionPoint: (productElement) => {
      // Find the price element with multiple fallbacks
      let priceElement = productElement.querySelector('[data-testid="price"], [data-testid="product-price"]');

      if (!priceElement) {
        priceElement = productElement.querySelector('[class*="Price"], [class*="price"]');
      }

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

  // Debug logging
  if (window.GUP_DEBUG) {
    console.log('[GUP] Instacart: Initializing with config:', instacartConfig);
  }

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
