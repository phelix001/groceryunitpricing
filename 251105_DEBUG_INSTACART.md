# Debugging Instacart Integration

## Issue
Unit prices not showing on Instacart page.

## Console Errors
The error "await is only valid in async functions" appears to be from another extension, not ours.

## Troubleshooting Steps

###

 1. Enable Debug Mode

Open the extension popup and enable Debug Mode, then check the console for logs from our extension.

### 2. Test Selectors Manually

Open DevTools (F12) on Instacart and run:

```javascript
// Enable debug
window.GroceryUnitPricing.enableDebug();

// Check if our objects are loaded
console.log(window.ProductParser);
console.log(window.UnitCalculator);
console.log(window.UnitConverter);
console.log(window.GroceryUnitPricing);

// Test product selector
document.querySelectorAll('[data-testid="product-card"]');
document.querySelectorAll('[class*="ProductCard"]');

// Test price selector
document.querySelectorAll('[class*="CurrentPrice"]');
document.querySelectorAll('[class*="price"]');

// Test description selector
document.querySelectorAll('[class*="ItemName"]');
document.querySelectorAll('[class*="ItemTitle"]');
```

### 3. Inspect Actual DOM Structure

Instacart's React-based structure changes frequently. Check the actual class names:

```javascript
// Find product containers
const products = document.querySelectorAll('[data-testid], [class*="product"], [class*="item"]');
console.log('Found products:', products);

// Inspect first product
if (products.length > 0) {
  console.log('First product HTML:', products[0].outerHTML);
}
```

### 4. Update Selectors

Based on the actual DOM structure, update `src/content/instacart.js` with correct selectors.

## Common Instacart Selector Patterns

Instacart uses various patterns:
- `[data-testid="product-card"]`
- `[data-testid="item-card"]`
- Classes with "Product", "Item", "Card"
- Price in `[data-testid="price"]` or classes with "Price"
- Titles in classes with "Name", "Title", "Description"

## Quick Fix

If selectors are wrong, update the instacart.js config object with the correct selectors found via DevTools inspection.

## Testing

1. Go to https://www.instacart.com
2. Select a store (e.g., Costco)
3. Search for products
4. Open DevTools Console
5. Run debug commands above
6. Report findings
