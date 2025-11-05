/**
 * Amazon-specific content script
 * Handles unit pricing for Amazon.com product listings
 */

(function() {
  'use strict';

  const amazonConfig = {
    // Product container selector
    productSelector: '[data-component-type="s-search-result"], .s-result-item[data-asin], [data-cel-widget*="search_result"]',

    // Price selector (Amazon has multiple formats)
    priceSelector: '.a-price .a-offscreen, .a-price-whole, .a-price',

    // Description/title selector
    descriptionSelector: 'h2 a span, .a-size-base-plus, .a-size-medium, [data-cy="title-recipe-card"]',

    // Custom injection point finder
    getInjectionPoint: (productElement) => {
      // Try to find the price container
      const priceContainer = productElement.querySelector('.a-price');
      if (priceContainer) {
        return priceContainer.parentElement;
      }

      // Fallback to main product container
      return productElement.querySelector('.s-title-instructions-style');
    },

    // Enable dynamic content observation
    observeDynamic: true,

    // Re-process on scroll (for infinite scroll)
    reprocessEvents: ['scroll']
  };

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.GroceryUnitPricing.init(amazonConfig);
    });
  } else {
    window.GroceryUnitPricing.init(amazonConfig);
  }

})();
