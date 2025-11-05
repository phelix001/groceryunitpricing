# Quick Debug Steps - Instacart Not Showing Prices

## The Issue
The error `content-script.js:276 Uncaught SyntaxError: await is only valid in async functions` is from **another extension** you have installed, not ours. Our extension may still work, but we need to verify.

## Fix in 3 Minutes

### Step 1: Open Console (15 seconds)
1. On the Instacart page, press **F12**
2. Click the **Console** tab
3. Clear it (click 🚫 or press Ctrl+L)

### Step 2: Check Extension Loaded (30 seconds)
Copy and paste this into console:

```javascript
console.log('Extension loaded:', typeof window.GroceryUnitPricing !== 'undefined');
```

**If it says `false`:**
- Go to chrome://extensions/
- Find "Grocery Unit Price Comparison"
- Click reload 🔄
- Refresh Instacart page
- Try again

**If it says `true`:**
- Great! Extension loaded. Continue to Step 3.

### Step 3: Run Inspector (1 minute)
1. Open this file in your editor: `debug-inspector.js`
2. Copy **ALL** the code (Ctrl+A, Ctrl+C)
3. Paste into console (Ctrl+V)
4. Press Enter
5. Read the output

Look for this section:
```
📦 BEST PRODUCT CONTAINER: [some selector] (24 found)
```

That's your answer! Take note of that selector.

### Step 4: Update the Code (1 minute)
1. Open `src/content/instacart.js` in your editor
2. Find line that starts with `productSelector:`
3. Replace it with the selector from Step 3

Example:
```javascript
productSelector: 'article', // ← Use the selector you found
```

Also update `priceSelector` and `descriptionSelector` if the inspector found better ones.

### Step 5: Reload Extension (30 seconds)
1. Save the file
2. Go to chrome://extensions/
3. Find "Grocery Unit Price Comparison"
4. Click reload 🔄
5. Go back to Instacart
6. Refresh page (F5)
7. **Look for blue unit price badges!**

---

## Still Not Working?

Run this quick test:

```javascript
// Enable debug
window.GroceryUnitPricing.enableDebug();

// Manually trigger
const config = {
  productSelector: 'article', // Use what debug-inspector.js told you
  priceSelector: '[data-testid="price"]',
  descriptionSelector: '[data-testid="item-name"]',
  observeDynamic: false
};

window.GroceryUnitPricing.processAllProducts(config);

// Check if it worked
console.log('Unit prices added:', document.querySelectorAll('.unit-price-extension').length);
```

If `Unit prices added: 0`, then:
1. The selectors are still wrong, OR
2. The price/quantity parsing is failing

---

## Report Back

Tell me:
1. ✅ or ❌ Extension loaded? (from Step 2)
2. What selector did debug-inspector.js find? (from Step 3)
3. How many unit prices added? (from Step 5 or test)
4. Any errors in console that mention "GUP" or "GroceryUnitPricing"?

Then I can help fix it!

---

## Alternative: Test on Amazon First

Instacart is tricky because of their React UI. Try Amazon first to verify the extension works:

1. Go to https://www.amazon.com
2. Search for "chocolate almonds"
3. Look for blue unit price badges like `$0.46/oz`

If it works on Amazon but not Instacart, it's just a selector issue!
