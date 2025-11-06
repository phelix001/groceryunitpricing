# Instacart Selector Fix - Nov 5, 2025

## Problem
Extension was working on Instacart ad banners but NOT on the main product grid on single-retailer pages (e.g., `https://www.instacart.com/store/giant-food-stores/s?k=chocolate`).

## Root Cause
**Instacart uses DIFFERENT CSS classes for ad banners vs. main product grid:**

| Element | Ad Banners | Main Product Grid |
|---------|-----------|-------------------|
| Product Container | `li[data-testid^="item_list_item"]` | `div.e-fsno8i` |
| Description/Name | `.e-xahufp` | `.e-1gh06cz` |
| Price | `.e-1632met` or `.e-gx2pr0` | `.e-gx2pr0` (same) |
| Quantity | `.e-cauxk8` | `.e-cauxk8` (same) |

The extension was only finding **10 products** (ads) instead of **60+ products** (full page) because:
1. Product selector only matched ad banner containers
2. Description selector only matched ad banner product names
3. `common.js` line 28 has early return if description element not found

## The Fix

### 1. Updated Product Selector (`src/content/instacart.js` line 12)
**Before:**
```javascript
productSelector: 'li[data-testid^="item_list_item"], [data-testid="product-card"]...'
```

**After:**
```javascript
productSelector: 'li[data-testid^="item_list_item"], div.e-fsno8i, div[role="group"][aria-label*="product card"]...'
```

### 2. Updated Description Selector (`src/content/instacart.js` line 19)
**Before:**
```javascript
descriptionSelector: '.e-xahufp, [data-testid="item-name"]...'
```

**After:**
```javascript
descriptionSelector: '.e-xahufp, .e-1gh06cz, [data-testid="item-name"]...'
```

## Diagnostic Process (CRITICAL FOR FUTURE FIXES)

### IMPORTANT: Instacart Class Name Randomization
Instacart likely uses CSS-in-JS with hashed class names (e.g., `.e-fsno8i`, `.e-1gh06cz`). These classes **MAY CHANGE** on Instacart deployments. The class names we found are **NOT guaranteed to be stable**.

### If Extension Breaks in Future, Use This Diagnostic Approach:

#### Step 1: Check Product Detection
```javascript
// How many products are we finding?
console.log('Products found:', document.querySelectorAll('li[data-testid^="item_list_item"], div.e-fsno8i').length);
console.log('Unit prices shown:', document.querySelectorAll('.unit-price-extension').length);

// If low numbers, classes have changed
```

#### Step 2: Find Current Product Container Class
```javascript
// Look for product links to identify containers
const productLinks = document.querySelectorAll('a[href*="/products/"]');
console.log('Total product links:', productLinks.length);

// Inspect first non-ad product (skip first 10 which are usually ads)
const regularProduct = productLinks[10];
console.log('Product container:', regularProduct.closest('div[role="group"]'));
console.log('Container classes:', regularProduct.closest('div[role="group"]').className);
```

#### Step 3: Find Current Description Element Class
```javascript
const productContainer = document.querySelectorAll('a[href*="/products/"]')[10].closest('div[role="group"]');

// Use aria-label as reference (usually has full product name)
console.log('aria-label:', productContainer.getAttribute('aria-label'));

// Find which element contains the product name
const walker = document.createTreeWalker(productContainer, NodeFilter.SHOW_TEXT);
let node;
while (node = walker.nextNode()) {
  const text = node.textContent.trim();
  // Look for product name (check first few words from aria-label)
  if (text.length > 20 && text.includes('PRODUCT_NAME_WORD')) {
    console.log('Description element:', node.parentElement.tagName, node.parentElement.className);
    console.log('Text:', text.substring(0, 100));
    break;
  }
}
```

#### Step 4: Verify Other Selectors Still Work
```javascript
const sample = document.querySelectorAll('a[href*="/products/"]')[10].closest('div[role="group"]');

// Price (should work - usually stable)
const price = sample.querySelector('.e-1632met, .e-gx2pr0');
console.log('Price found:', !!price, price?.textContent);

// Quantity (should work - usually stable)
const qty = sample.querySelector('.e-cauxk8');
console.log('Quantity found:', !!qty, qty?.textContent);
```

## Fallback Strategies

### If Classes Change Completely

1. **Use aria-label for description:**
   - Main grid products have `aria-label` with full product info
   - Could parse this as fallback

2. **Use DOM structure instead of classes:**
   - Product containers always have `role="group"`
   - Product links always contain `/products/` in href
   - Price elements usually have `$` in textContent

3. **Use data-testid attributes (if available):**
   - More stable than hashed class names
   - Check for `data-testid="product-card"`, `data-testid="item-name"`, etc.

## File Changes Made
- `src/content/instacart.js` - Updated `productSelector` and `descriptionSelector`

## Testing Commands
```javascript
// Quick test
console.log('Products:', document.querySelectorAll('li[data-testid^="item_list_item"], div.e-fsno8i').length, 'Unit prices:', document.querySelectorAll('.unit-price-extension').length);

// Should show ~60-70 products and matching unit prices
```

## Key Lesson
**Always test on both cross-retailer pages AND single-retailer pages** - they use different markup!
- Cross-retailer: `https://www.instacart.com/store/search?k=chocolate` (has .e-xahufp)
- Single-retailer: `https://www.instacart.com/store/RETAILER/s?k=chocolate` (has .e-1gh06cz)
