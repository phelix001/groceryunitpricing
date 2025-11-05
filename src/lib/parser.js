/**
 * Product information parser
 * Extracts price, quantity, and unit information from product text
 */

const ProductParser = {
  /**
   * Extract price from text (handles various formats)
   * Returns null if no valid price found
   */
  parsePrice(text) {
    if (!text) return null;

    // Remove commas and normalize
    const normalized = text.replace(/,/g, '');

    // Match various price formats: $12.99, 12.99, $12, etc.
    const priceRegex = /\$?\s*(\d+\.?\d*)/;
    const match = normalized.match(priceRegex);

    if (match) {
      const price = parseFloat(match[1]);
      return isNaN(price) ? null : price;
    }

    return null;
  },

  /**
   * Extract quantity and unit from text
   * Returns { quantity, unit } or null
   */
  parseQuantityAndUnit(text) {
    if (!text) return null;

    // Normalize text
    const normalized = text.toLowerCase().trim();

    // Pattern 1: "15 oz", "2.5 lbs", "500 g", "12 fl oz"
    let match = normalized.match(/(\d+\.?\d*)\s*(fl\.\s*oz|fl\s*oz|fluid\s*ounce[s]?|oz|ounce[s]?|lb[s]?|pound[s]?|g|gram[s]?|kg|kilogram[s]?|ml|milliliter[s]?|l|liter[s]?|gal|gallon[s]?|qt|quart[s]?|pt|pint[s]?|cup[s]?|ct|count)/i);

    if (match) {
      return {
        quantity: parseFloat(match[1]),
        unit: match[2].replace(/\s+/g, ' ').trim()
      };
    }

    // Pattern 2: "15oz" (no space)
    match = normalized.match(/(\d+\.?\d*)(fl\.?oz|oz|lbs?|g|kg|ml|l)/i);
    if (match) {
      return {
        quantity: parseFloat(match[1]),
        unit: match[2]
      };
    }

    // Pattern 3: "Pack of 3" or "3 count"
    match = normalized.match(/(?:pack\s+of\s+|count\s*[:=]?\s*)(\d+)/);
    if (match) {
      return {
        quantity: parseFloat(match[1]),
        unit: 'count'
      };
    }

    // Pattern 4: Just a count number at the end
    match = normalized.match(/(\d+)\s*ct\b/);
    if (match) {
      return {
        quantity: parseFloat(match[1]),
        unit: 'count'
      };
    }

    return null;
  },

  /**
   * Parse multi-pack information
   * E.g., "2 x 15 oz" or "Pack of 3"
   */
  parseMultiPack(text) {
    if (!text) return null;

    const normalized = text.toLowerCase().trim();

    // Pattern: "2 x 15 oz" or "3 × 500g"
    const match = normalized.match(/(\d+)\s*[x×]\s*(\d+\.?\d*)\s*(fl\.?\s*oz|oz|lb[s]?|g|kg|ml|l)/i);

    if (match) {
      return {
        packCount: parseFloat(match[1]),
        quantity: parseFloat(match[2]),
        unit: match[3].replace(/\s+/g, ' ').trim()
      };
    }

    return null;
  },

  /**
   * Extract all product information from combined text
   */
  parseProductInfo(priceText, descriptionText) {
    const price = this.parsePrice(priceText);

    if (!price) {
      return null;
    }

    // Try to find multi-pack first
    const multiPack = this.parseMultiPack(descriptionText);
    if (multiPack) {
      return {
        price,
        quantity: multiPack.quantity * multiPack.packCount,
        unit: multiPack.unit,
        packCount: multiPack.packCount
      };
    }

    // Otherwise parse single quantity
    const quantityInfo = this.parseQuantityAndUnit(descriptionText);
    if (quantityInfo) {
      return {
        price,
        quantity: quantityInfo.quantity,
        unit: quantityInfo.unit
      };
    }

    return { price, quantity: null, unit: null };
  },

  /**
   * Parse price per unit that's already displayed on the site
   * This helps validate our calculations
   */
  parseUnitPrice(text) {
    if (!text) return null;

    // Match formats like "$0.46/oz" or "46¢/oz" or "$1.24/oz"
    const match = text.match(/\$?(\d+\.?\d*)[¢]?\s*\/\s*([a-z\s.]+)/i);

    if (match) {
      let price = parseFloat(match[1]);
      // Convert cents to dollars if necessary
      if (text.includes('¢')) {
        price = price / 100;
      }

      return {
        unitPrice: price,
        unit: match[2].trim()
      };
    }

    return null;
  }
};

// Make available globally for content scripts
if (typeof window !== 'undefined') {
  window.ProductParser = ProductParser;
}
