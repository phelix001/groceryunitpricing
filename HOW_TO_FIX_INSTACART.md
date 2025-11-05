# How to Fix Instacart Selectors

## Quick Fix Steps

### 1. Open Instacart in Chrome
- Go to https://www.instacart.com
- Select a store (e.g., Costco)
- Search for "chocolate" or any product

### 2. Open DevTools
- Press F12 or right-click → Inspect
- Click the Console tab

### 3. Run the Inspector Script
- Open the file `debug-inspector.js` in this repository
- Copy ALL the code
- Paste it into the Console
- Press Enter

### 4. Review the Output
The script will show you:
```
=== Instacart DOM Inspector ===

1. SEARCHING FOR PRODUCT CONTAINERS:
✓ Found 24 elements: [selector name]
  Selector: [the actual CSS selector]
  First element classes: [class names]

...etc
```

### 5. Find the Best Selectors
Look for sections labeled:
- **BEST PRODUCT CONTAINER** - This is your `productSelector`
- **PRICE ELEMENTS** - Pick one that works for `priceSelector`
- **PRODUCT TITLE/DESCRIPTION** - Pick one for `descriptionSelector`

### 6. Update instacart.js
Edit `src/content/instacart.js` and update the config:

```javascript
const instacartConfig = {
  productSelector: '[THE-SELECTOR-FROM-STEP-5]',
  priceSelector: '[THE-PRICE-SELECTOR-FROM-STEP-5]',
  descriptionSelector: '[THE-DESCRIPTION-SELECTOR-FROM-STEP-5]',
  // ... rest stays the same
};
```

### 7. Reload the Extension
- Go to chrome://extensions/
- Find "Grocery Unit Price Comparison"
- Click the reload icon 🔄
- Refresh the Instacart page
- Unit prices should now appear!

## Alternative: Enable Debug Mode

1. Click the extension icon
2. Check "Enable Debug Mode"
3. Refresh Instacart page
4. Open Console (F12)
5. Look for logs starting with `[GUP]`
6. They will show what selectors are being used and what's being found

## Example Output You Might See

```javascript
// Good output:
[GUP] Instacart: Initializing with config: {...}
[GUP] Found 24 products to process

// Bad output (means selectors don't match):
[GUP] Instacart: Initializing with config: {...}
[GUP] Found 0 products to process
```

## Common Instacart Patterns (2025)

Based on typical Instacart structure:

**Product containers:**
- `[data-testid="product-card"]`
- `li[class*="item"]`
- `article`

**Prices:**
- `[data-testid="price"]`
- `span[class*="price"]`
- Look for dollar amounts in the text

**Descriptions:**
- `[data-testid="item-name"]`
- `h3`, `h4`
- `[class*="name"]`

## If Still Not Working

1. Take a screenshot of the Instacart page
2. Take a screenshot of the console output from debug-inspector.js
3. Open a GitHub issue with both screenshots
4. I'll help identify the correct selectors

## Manual Testing

You can also test selectors manually in the console:

```javascript
// Test product selector
document.querySelectorAll('[data-testid="product-card"]').length;

// Test price selector on first product
const product = document.querySelector('[data-testid="product-card"]');
product.querySelector('[data-testid="price"]');

// Test description selector
product.querySelector('[data-testid="item-name"]').textContent;
```

The numbers should match the number of products you see on screen!
