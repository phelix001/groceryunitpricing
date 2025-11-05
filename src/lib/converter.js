/**
 * Unit conversion utilities
 * Handles weight and volume conversions between different measurement systems
 */

const UnitConverter = {
  // Weight conversions (all to grams)
  WEIGHT_TO_GRAMS: {
    'g': 1,
    'gram': 1,
    'grams': 1,
    'kg': 1000,
    'kilogram': 1000,
    'kilograms': 1000,
    'oz': 28.3495,
    'ounce': 28.3495,
    'ounces': 28.3495,
    'lb': 453.592,
    'lbs': 453.592,
    'pound': 453.592,
    'pounds': 453.592,
  },

  // Volume conversions (all to milliliters)
  VOLUME_TO_ML: {
    'ml': 1,
    'milliliter': 1,
    'milliliters': 1,
    'l': 1000,
    'liter': 1000,
    'liters': 1000,
    'fl oz': 29.5735,
    'fl. oz': 29.5735,
    'fluid ounce': 29.5735,
    'fluid ounces': 29.5735,
    'cup': 236.588,
    'cups': 236.588,
    'pt': 473.176,
    'pint': 473.176,
    'pints': 473.176,
    'qt': 946.353,
    'quart': 946.353,
    'quarts': 946.353,
    'gal': 3785.41,
    'gallon': 3785.41,
    'gallons': 3785.41,
  },

  // Standard display units
  STANDARD_WEIGHT_UNIT: 'oz',
  STANDARD_VOLUME_UNIT: 'fl oz',

  /**
   * Convert any weight unit to standard weight unit (oz)
   */
  toStandardWeight(value, unit) {
    const normalizedUnit = unit.toLowerCase().trim();
    const gramsPerUnit = this.WEIGHT_TO_GRAMS[normalizedUnit];

    if (!gramsPerUnit) {
      console.warn(`Unknown weight unit: ${unit}`);
      return { value, unit };
    }

    const grams = value * gramsPerUnit;
    const ounces = grams / this.WEIGHT_TO_GRAMS['oz'];

    return {
      value: ounces,
      unit: 'oz'
    };
  },

  /**
   * Convert any volume unit to standard volume unit (fl oz)
   */
  toStandardVolume(value, unit) {
    const normalizedUnit = unit.toLowerCase().trim();
    const mlPerUnit = this.VOLUME_TO_ML[normalizedUnit];

    if (!mlPerUnit) {
      console.warn(`Unknown volume unit: ${unit}`);
      return { value, unit };
    }

    const ml = value * mlPerUnit;
    const flOz = ml / this.VOLUME_TO_ML['fl oz'];

    return {
      value: flOz,
      unit: 'fl oz'
    };
  },

  /**
   * Determine if a unit is a weight unit
   */
  isWeightUnit(unit) {
    const normalized = unit.toLowerCase().trim();
    return normalized in this.WEIGHT_TO_GRAMS;
  },

  /**
   * Determine if a unit is a volume unit
   */
  isVolumeUnit(unit) {
    const normalized = unit.toLowerCase().trim();
    return normalized in this.VOLUME_TO_ML;
  },

  /**
   * Convert to appropriate standard unit based on unit type
   */
  toStandardUnit(value, unit) {
    if (this.isWeightUnit(unit)) {
      return this.toStandardWeight(value, unit);
    } else if (this.isVolumeUnit(unit)) {
      return this.toStandardVolume(value, unit);
    } else {
      // Count-based or unknown units
      return { value, unit };
    }
  }
};

// Make available globally for content scripts
if (typeof window !== 'undefined') {
  window.UnitConverter = UnitConverter;
}
