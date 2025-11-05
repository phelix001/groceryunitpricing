/**
 * Display formatter for unit prices
 * Handles formatting unit prices for display on shopping sites
 */

const UnitFormatter = {
  /**
   * Format a unit price for display
   * @param {object} unitPriceInfo - Result from UnitCalculator
   * @returns {string} - Formatted string like "$0.46/oz"
   */
  formatUnitPrice(unitPriceInfo) {
    if (!unitPriceInfo) {
      return '';
    }

    const price = unitPriceInfo.unitPrice;
    const unit = unitPriceInfo.displayUnit;

    // Format price to 2 decimal places
    const formattedPrice = price.toFixed(2);

    return `$${formattedPrice}/${unit}`;
  },

  /**
   * Format with additional context
   */
  formatWithContext(unitPriceInfo) {
    if (!unitPriceInfo) {
      return '';
    }

    const unitPrice = this.formatUnitPrice(unitPriceInfo);
    const original = `${unitPriceInfo.originalQuantity} ${unitPriceInfo.originalUnit}`;

    return {
      unitPrice,
      originalSize: original
    };
  },

  /**
   * Create HTML element for unit price display
   */
  createUnitPriceElement(unitPriceInfo) {
    if (!unitPriceInfo) {
      return null;
    }

    const span = document.createElement('span');
    span.className = 'unit-price-extension';
    span.textContent = this.formatUnitPrice(unitPriceInfo);
    span.setAttribute('data-unit-price', unitPriceInfo.unitPrice);
    span.setAttribute('data-unit', unitPriceInfo.displayUnit);

    return span;
  },

  /**
   * Create detailed unit price element with tooltip
   */
  createDetailedElement(unitPriceInfo) {
    if (!unitPriceInfo) {
      return null;
    }

    const container = document.createElement('div');
    container.className = 'unit-price-extension-detailed';

    const priceSpan = document.createElement('span');
    priceSpan.className = 'unit-price-value';
    priceSpan.textContent = this.formatUnitPrice(unitPriceInfo);

    const tooltip = document.createElement('span');
    tooltip.className = 'unit-price-tooltip';
    tooltip.textContent = `Based on ${unitPriceInfo.originalQuantity} ${unitPriceInfo.originalUnit}`;

    container.appendChild(priceSpan);
    container.appendChild(tooltip);

    return container;
  },

  /**
   * Format savings information
   */
  formatSavings(savingsInfo) {
    if (!savingsInfo) {
      return '';
    }

    const percent = savingsInfo.percentSavings.toFixed(0);
    const amount = savingsInfo.absoluteSavings.toFixed(2);

    return `Save ${percent}% ($${amount}/${savingsInfo.unit})`;
  },

  /**
   * Create a badge element for best value
   */
  createBestValueBadge() {
    const badge = document.createElement('span');
    badge.className = 'unit-price-best-value';
    badge.textContent = '⭐ Best Value';
    return badge;
  }
};

// Make available globally for content scripts
if (typeof window !== 'undefined') {
  window.UnitFormatter = UnitFormatter;
}
