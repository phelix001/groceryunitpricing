# Console Commands for Debugging

## Step 1: Check if Extension Scripts Loaded

Paste this into the console on Instacart:

```javascript
// Check if our libraries are loaded
console.log('Parser loaded?', typeof window.ProductParser);
console.log('Calculator loaded?', typeof window.UnitCalculator);
console.log('Converter loaded?', typeof window.UnitConverter);
console.log('GroceryUnitPricing loaded?', typeof window.GroceryUnitPricing);
```

**Expected output:**
```
Parser loaded? object
Calculator loaded? object
Converter loaded? object
GroceryUnitPricing loaded? object
```

If you see `undefined`, the scripts aren't loading.

---

## Step 2: Enable Debug Mode

```javascript
// Enable debug mode
window.GroceryUnitPricing.enableDebug();
```

Then refresh the page and look for logs starting with `[GUP]`

---

## Step 3: Run the DOM Inspector

Copy and paste the ENTIRE contents of `debug-inspector.js` into the console.

This will show you the correct selectors to use.

---

## Step 4: Manually Test Selectors

Try these selectors to find products:

```javascript
// Try different product selectors
console.log('data-testid=product-card:', document.querySelectorAll('[data-testid="product-card"]').length);
console.log('data-testid=item-card:', document.querySelectorAll('[data-testid="item-card"]').length);
console.log('articles:', document.querySelectorAll('article').length);
console.log('li items:', document.querySelectorAll('li[class*="item"]').length);

// Find what works best
const products = document.querySelectorAll('article'); // Or whichever worked
console.log('Found', products.length, 'products');

// Inspect first product
if (products[0]) {
  console.log('First product HTML:', products[0].outerHTML.substring(0, 500));
  console.log('First product text:', products[0].textContent.substring(0, 200));
}
```

---

## Step 5: Test Price Extraction

```javascript
// Assuming you found products with 'article'
const product = document.querySelector('article');

// Try to find price
const priceEl = product.querySelector('[data-testid="price"]');
console.log('Price element:', priceEl);
console.log('Price text:', priceEl ? priceEl.textContent : 'NOT FOUND');

// Try our parser
if (priceEl) {
  const price = window.ProductParser.parsePrice(priceEl.textContent);
  console.log('Parsed price:', price);
}
```

---

## Step 6: Test Description Extraction

```javascript
const product = document.querySelector('article');

// Try to find description
const descEl = product.querySelector('[data-testid="item-name"]');
console.log('Description element:', descEl);
console.log('Description text:', descEl ? descEl.textContent : 'NOT FOUND');

// Try our parser
if (descEl) {
  const quantity = window.ProductParser.parseQuantityAndUnit(descEl.textContent);
  console.log('Parsed quantity:', quantity);
}
```

---

## Step 7: Manually Process a Product

```javascript
// Select a product
const product = document.querySelector('article'); // or whatever selector works

// Get config (update with your working selectors)
const config = {
  productSelector: 'article',
  priceSelector: '[data-testid="price"]',
  descriptionSelector: '[data-testid="item-name"]',
  getInjectionPoint: (el) => el
};

// Try to process it
window.GroceryUnitPricing.processProduct(product, config);

// Check if unit price was added
console.log('Unit price element:', product.querySelector('.unit-price-extension'));
```

---

## Step 8: Process All Products

```javascript
// After you've verified the config works
const config = {
  productSelector: 'article', // UPDATE THIS
  priceSelector: '[data-testid="price"]', // UPDATE THIS
  descriptionSelector: '[data-testid="item-name"]', // UPDATE THIS
  observeDynamic: false
};

window.GroceryUnitPricing.processAllProducts(config);

// Check results
console.log('Unit prices added:', document.querySelectorAll('.unit-price-extension').length);
```

---

## Common Issues

### "undefined is not an object"
- Extension scripts didn't load
- Reload the extension at chrome://extensions/
- Refresh the page

### "Found 0 products to process"
- Wrong product selector
- Run the debug-inspector.js to find the right one

### "Cannot read property 'textContent' of null"
- Price or description selector is wrong
- Inspect the HTML manually to find the right selectors

### No unit prices appear
- Selectors are finding elements but parsing is failing
- Check if price/quantity format is unusual
- Look at the raw text being parsed

---

## Quick Test Sequence

Run this complete test:

```javascript
// 1. Check extension loaded
console.log('Extension loaded:', typeof window.GroceryUnitPricing !== 'undefined');

// 2. Enable debug
window.GroceryUnitPricing.enableDebug();

// 3. Find products
const products = document.querySelectorAll('article');
console.log('Found', products.length, 'products');

// 4. Test first product
if (products[0]) {
  const priceText = products[0].textContent;
  console.log('Product text sample:', priceText.substring(0, 100));

  // Test parsing
  const price = priceText.match(/\$\d+\.?\d*/);
  const quantity = priceText.match(/\d+\.?\d*\s*(oz|lb|g|kg)/i);

  console.log('Price in text:', price);
  console.log('Quantity in text:', quantity);
}
```

---

## Report Results

After running these commands, report:
1. Which selectors worked (from Step 4)
2. Sample price text (from Step 5)
3. Sample description text (from Step 6)
4. Any errors in console

Then I can update the extension with the correct selectors!
