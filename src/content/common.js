/**
 * Common utilities for all content scripts
 * Shared functionality across different shopping sites
 */

const GroceryUnitPricing = {
  // Track processed elements to avoid duplicates
  processedElements: new WeakSet(),

  /**
   * Process a single product element
   */
  processProduct(productElement, config) {
    // Skip if already processed
    if (this.processedElements.has(productElement)) {
      return;
    }

    try {
      // Extract price
      const priceElement = productElement.querySelector(config.priceSelector);
      if (!priceElement) return;

      const priceText = priceElement.textContent || priceElement.innerText;

      // Extract description/title for quantity info
      const descElement = productElement.querySelector(config.descriptionSelector);
      if (!descElement) return;

      const descText = descElement.textContent || descElement.innerText;

      // Parse product info
      const productInfo = window.ProductParser.parseProductInfo(priceText, descText);

      if (!productInfo || !productInfo.quantity) {
        return;
      }

      // Calculate unit price
      const unitPriceInfo = window.UnitCalculator.fromProductInfo(productInfo);

      if (!unitPriceInfo) {
        return;
      }

      // Create and inject unit price display
      const unitPriceElement = window.UnitFormatter.createUnitPriceElement(unitPriceInfo);

      // Find injection point
      const injectionPoint = config.getInjectionPoint
        ? config.getInjectionPoint(productElement)
        : priceElement.parentElement;

      if (injectionPoint && unitPriceElement) {
        // Check if unit price already exists at injection point
        const existingUnitPrice = injectionPoint.querySelector('.unit-price-extension');
        if (!existingUnitPrice) {
          injectionPoint.appendChild(unitPriceElement);
        }
      }

      // Mark as processed
      this.processedElements.add(productElement);

      // Log for debugging
      if (window.GUP_DEBUG) {
        console.log('Processed product:', {
          price: productInfo.price,
          quantity: productInfo.quantity,
          unit: productInfo.unit,
          unitPrice: unitPriceInfo.unitPrice,
          displayUnit: unitPriceInfo.displayUnit
        });
      }

    } catch (error) {
      console.error('Error processing product:', error);
    }
  },

  /**
   * Process all products on the page
   */
  processAllProducts(config) {
    const products = document.querySelectorAll(config.productSelector);

    if (window.GUP_DEBUG) {
      console.log(`Found ${products.length} products to process`);
    }

    products.forEach(product => {
      this.processProduct(product, config);
    });
  },

  /**
   * Setup mutation observer for dynamic content
   */
  observeDynamicContent(config) {
    const observer = new MutationObserver((mutations) => {
      // Debounce to avoid excessive processing
      clearTimeout(this.observerTimeout);
      this.observerTimeout = setTimeout(() => {
        this.processAllProducts(config);
      }, 500);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return observer;
  },

  /**
   * Initialize extension on a site
   */
  init(config) {
    if (window.GUP_DEBUG) {
      console.log('Initializing Grocery Unit Pricing extension');
    }

    // Validate config
    if (!config.productSelector || !config.priceSelector || !config.descriptionSelector) {
      console.error('Invalid configuration for site');
      return;
    }

    // Process existing products
    this.processAllProducts(config);

    // Setup observer for dynamic content
    if (config.observeDynamic !== false) {
      this.observeDynamicContent(config);
    }

    // Re-process on certain events
    if (config.reprocessEvents) {
      config.reprocessEvents.forEach(eventName => {
        window.addEventListener(eventName, () => {
          setTimeout(() => this.processAllProducts(config), 1000);
        });
      });
    }
  },

  /**
   * Enable debug mode
   */
  enableDebug() {
    window.GUP_DEBUG = true;
    console.log('Grocery Unit Pricing: Debug mode enabled');
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.GroceryUnitPricing = GroceryUnitPricing;
}

// Enable debug mode via console: window.GroceryUnitPricing.enableDebug()
