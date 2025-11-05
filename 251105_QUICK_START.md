# Quick Start Guide

## Loading the Extension in Chrome

1. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/`
   - Or: Menu (⋮) → Extensions → Manage Extensions

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load the Extension**
   - Click "Load unpacked"
   - Navigate to the `groceryunitpricing` directory
   - Click "Select Folder"

4. **Verify Installation**
   - You should see "Grocery Unit Price Comparison" in your extensions list
   - The extension icon should appear in your Chrome toolbar

## Testing the Extension

### Test on Amazon
1. Go to [amazon.com](https://www.amazon.com)
2. Search for a product (e.g., "chocolate almonds", "coffee", "cereal")
3. Look for blue unit price badges next to product prices
4. Example: "$0.46/oz" should appear next to the total price

### Test on Walmart
1. Go to [walmart.com](https://www.walmart.com)
2. Search for a product
3. Unit prices should appear below the main price

### Test on Instacart
1. Go to [instacart.com](https://www.instacart.com)
2. Select a store
3. Search for products
4. Unit prices will appear after products load

### Test on Costco
1. Go to [costco.com](https://www.costco.com) or [sameday.costco.com](https://sameday.costco.com)
2. Search for products
3. Unit prices should display alongside prices

## Troubleshooting

### Extension Not Working?

1. **Refresh the page** - Press F5 or Ctrl+R (Cmd+R on Mac)

2. **Check extension is enabled**
   - Click the extension icon in toolbar
   - Verify the status shows "Extension Active"

3. **Enable Debug Mode**
   - Click the extension icon
   - Check "Enable Debug Mode"
   - Open Chrome DevTools (F12)
   - Check the Console tab for logs

4. **Common Issues:**
   - **No icon files**: The extension will work without icons, but Chrome will show a default icon
   - **Content not loading**: Some sites load content dynamically - wait a few seconds
   - **Incorrect prices**: Verify the product listing includes quantity/unit information

### Debug Console Commands

Open DevTools (F12) on a shopping site and try:

```javascript
// Enable debug mode
window.GroceryUnitPricing.enableDebug();

// Manually trigger processing
window.GroceryUnitPricing.processAllProducts(/* config from site script */);

// Test parser
window.ProductParser.parsePrice("$12.99");
window.ProductParser.parseQuantityAndUnit("15 oz");

// Test converter
window.UnitConverter.toStandardWeight(15, "oz");
window.UnitConverter.toStandardVolume(8, "fl oz");
```

## Configuration

Click the extension icon to access settings:

- **Preferred Unit System**: Choose Imperial or Metric
- **Site Toggles**: Enable/disable per site
- **Debug Mode**: Show console logs

Settings are saved automatically and sync across Chrome devices.

## Next Steps

### Add Icons (Optional but Recommended)

Create three PNG icon files in the `icons/` directory:
- `icon16.png` (16×16)
- `icon48.png` (48×48)
- `icon128.png` (128×128)

See `icons/README.md` for design guidelines.

### Customize for Your Needs

Edit the content scripts in `src/content/` to adjust:
- Which elements to target
- How unit prices are displayed
- Calculation logic

See [CLAUDE.md](CLAUDE.md) for development documentation.

## Known Limitations

- Extension only works on supported sites (Amazon, Walmart, Instacart, Costco)
- Unit prices require quantity information in product listings
- Site layout changes may affect functionality
- Some multi-pack products may calculate incorrectly if packaging info is unclear

## Getting Help

1. Enable Debug Mode and check console logs
2. Check README.md for detailed documentation
3. Review CLAUDE.md for architecture details
4. Open an issue if you encounter bugs

## Performance Tips

The extension is designed to be lightweight:
- Processes only visible products
- Uses mutation observers for dynamic content
- Caches processed elements
- No external API calls

If you notice slowdown:
1. Disable the extension on unused sites
2. Close tabs you're not actively using
3. Check Debug Mode console for errors
