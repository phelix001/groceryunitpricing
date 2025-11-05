/**
 * Unit price calculator
 * Calculates standardized unit prices for product comparison
 */

const UnitCalculator = {
  /**
   * Calculate unit price (price per standard unit)
   * @param {number} price - Total price
   * @param {number} quantity - Quantity value
   * @param {string} unit - Unit of measurement
   * @returns {object} - { unitPrice, displayUnit, quantity, standardQuantity }
   */
  calculateUnitPrice(price, quantity, unit) {
    if (!price || !quantity || !unit) {
      return null;
    }

    // Convert to standard unit if needed
    const standardized = window.UnitConverter.toStandardUnit(quantity, unit);

    // Calculate price per standard unit
    const unitPrice = price / standardized.value;

    return {
      unitPrice: unitPrice,
      displayUnit: standardized.unit,
      originalQuantity: quantity,
      originalUnit: unit,
      standardQuantity: standardized.value,
      standardUnit: standardized.unit
    };
  },

  /**
   * Calculate unit price from parsed product info
   */
  fromProductInfo(productInfo) {
    if (!productInfo || !productInfo.price) {
      return null;
    }

    // If no quantity/unit, we can't calculate
    if (!productInfo.quantity || !productInfo.unit) {
      return null;
    }

    return this.calculateUnitPrice(
      productInfo.price,
      productInfo.quantity,
      productInfo.unit
    );
  },

  /**
   * Compare two unit prices
   * Returns: -1 if price1 is better (cheaper), 1 if price2 is better, 0 if equal
   */
  compare(unitPriceInfo1, unitPriceInfo2) {
    if (!unitPriceInfo1 || !unitPriceInfo2) {
      return 0;
    }

    // Make sure units are compatible
    if (unitPriceInfo1.displayUnit !== unitPriceInfo2.displayUnit) {
      console.warn('Cannot compare unit prices with different units');
      return 0;
    }

    const diff = unitPriceInfo1.unitPrice - unitPriceInfo2.unitPrice;

    if (Math.abs(diff) < 0.001) {
      return 0;
    }

    return diff < 0 ? -1 : 1;
  },

  /**
   * Calculate savings between two unit prices
   */
  calculateSavings(higherPriceInfo, lowerPriceInfo) {
    if (!higherPriceInfo || !lowerPriceInfo) {
      return null;
    }

    if (higherPriceInfo.displayUnit !== lowerPriceInfo.displayUnit) {
      return null;
    }

    const difference = higherPriceInfo.unitPrice - lowerPriceInfo.unitPrice;
    const percentSavings = (difference / higherPriceInfo.unitPrice) * 100;

    return {
      absoluteSavings: difference,
      percentSavings: percentSavings,
      unit: higherPriceInfo.displayUnit
    };
  }
};

// Make available globally for content scripts
if (typeof window !== 'undefined') {
  window.UnitCalculator = UnitCalculator;
}
