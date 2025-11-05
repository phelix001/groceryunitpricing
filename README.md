# 🛒 Grocery Unit Price Comparison

**A Chrome extension that automatically displays unit pricing on grocery shopping websites, helping you compare products and save money.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue.svg)](https://www.google.com/chrome/)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/phelix001/groceryunitpricing)

![Extension Icon](icons/icon128.png)

## 📋 Overview

Shopping for groceries online? Tired of doing mental math to compare product sizes? This extension automatically calculates and displays unit prices (price per ounce, pound, etc.) right on the product listings, making it easy to find the best value.

### ✨ Key Features

- 🎯 **Automatic Unit Price Calculation** - Instantly see price per ounce, pound, or other units
- 🌐 **Multi-Site Support** - Works seamlessly on Amazon, Walmart, Instacart, and Costco
- 📊 **Easy Comparison** - Compare products side-by-side with standardized pricing
- ⚡ **Real-Time Updates** - Handles dynamic content and infinite scroll automatically
- 🎨 **Clean Display** - Non-intrusive styling that blends naturally with each site
- 🔒 **Privacy Focused** - All processing happens locally in your browser
- ⚙️ **Customizable** - Control which sites to enable and your preferred units

## 🌍 Supported Sites

| Site | Status | Notes |
|------|--------|-------|
| 🛍️ **Amazon.com** | ✅ Active | Search results and product pages |
| 🏪 **Walmart.com** | ✅ Active | All product listings |
| 📦 **Instacart.com** | ✅ Active | All stores and categories |
| 🏬 **Costco.com** | ✅ Active | Including sameday.costco.com |

## 🚀 Installation

### Option 1: From Source (Current)

1. **Clone or Download**
   ```bash
   git clone https://github.com/phelix001/groceryunitpricing.git
   cd groceryunitpricing
   ```

2. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top-right corner)
   - Click **Load unpacked**
   - Select the `groceryunitpricing` directory
   - Done! 🎉

3. **Verify Installation**
   - Look for the grocery cart icon 🛒 in your Chrome toolbar
   - Click it to access settings

### Option 2: Chrome Web Store (Coming Soon)

*The extension will be published to the Chrome Web Store for easy one-click installation.*

## 💡 How It Works

### Example

**Before:**
```
Blue Diamond Dark Chocolate Almonds, 40 oz
$18.37
```

**After (with extension):**
```
Blue Diamond Dark Chocolate Almonds, 40 oz
$18.37  $0.46/oz ← Added by extension!
```

### The Process

1. 🔍 **Detects** - Recognizes when you're on a supported shopping site
2. 📝 **Parses** - Extracts product price, quantity, and unit information
3. 🧮 **Calculates** - Computes standardized unit prices with smart conversions
4. 🎨 **Displays** - Shows results clearly next to each product

### Supported Units

**Weight:**
- Imperial: oz (ounces), lb (pounds)
- Metric: g (grams), kg (kilograms)

**Volume:**
- Imperial: fl oz (fluid ounces), cup, pint, quart, gallon
- Metric: ml (milliliters), L (liters)

**Other:**
- Count-based units (ct, count, each)
- Multi-pack handling (e.g., "2 x 15 oz")

## 🎮 Usage

1. **Install the extension** (see Installation above)
2. **Visit any supported grocery site**
3. **Search for products** (e.g., "chocolate", "coffee", "cereal")
4. **See unit prices automatically** - Look for blue badges like `$0.46/oz`
5. **Compare and save money!**

### Configuration

Click the extension icon to access settings:

- ✅ **Enable/Disable per site** - Toggle extension for each shopping site
- 🔧 **Preferred units** - Choose Imperial or Metric
- 🐛 **Debug mode** - Enable detailed console logging

Settings sync across all your Chrome devices!

## 🛠️ Technical Details

### Architecture

```
groceryunitpricing/
├── manifest.json              # Chrome Extension Manifest V3
├── src/
│   ├── lib/                  # Core libraries
│   │   ├── parser.js         # Extract prices & quantities
│   │   ├── calculator.js     # Calculate unit prices
│   │   ├── converter.js      # Convert between units
│   │   └── formatter.js      # Format display output
│   ├── content/              # Site-specific scripts
│   │   ├── common.js         # Shared utilities
│   │   ├── amazon.js         # Amazon integration
│   │   ├── walmart.js        # Walmart integration
│   │   ├── instacart.js      # Instacart integration
│   │   └── costco.js         # Costco integration
│   ├── popup/                # Extension popup UI
│   ├── background/           # Service worker
│   └── styles/               # CSS styles
└── icons/                    # Extension icons
```

### Key Components

**Parser** - Flexible extraction of price and quantity data
- Handles various formats: `$12.99`, `12.99`, `15 oz`, `15oz`, `2 x 15 oz`
- Regex-based with fallback patterns
- Multi-pack detection

**Calculator** - Accurate unit price computation
- Standardizes to common units (oz, fl oz)
- Handles edge cases and special units
- Comparison and savings calculation

**Converter** - Comprehensive unit conversions
- Weight: g ↔ oz ↔ lb ↔ kg
- Volume: ml ↔ fl oz ↔ L ↔ gal
- Auto-detection of unit types

**Site Scripts** - Custom integration for each site
- DOM selector targeting
- Dynamic content observation
- Site-specific injection points

### Technologies

- **JavaScript** (ES6+)
- **Chrome Extension API** (Manifest V3)
- **CSS3** (with dark mode support)
- **MutationObserver** (for dynamic content)

## 🔒 Privacy & Permissions

### What We Do

✅ All processing happens **locally in your browser**
✅ **No data collection** or analytics
✅ **No external API calls** or servers
✅ **Minimal permissions** (only storage for settings)

### Permissions Used

- `storage` - Save your settings preferences
- `host_permissions` - Access supported shopping sites

We only request the absolute minimum permissions needed to function.

## 🐛 Troubleshooting

### Unit prices not showing?

1. **Refresh the page** (F5 or Ctrl+R)
2. **Wait a few seconds** for dynamic content to load
3. **Check extension status** - Click icon to verify it's enabled for that site
4. **Enable debug mode** - Check browser console (F12) for error messages

### Incorrect calculations?

- Verify product listing includes clear quantity information
- Some products with unusual packaging may be difficult to parse
- Enable debug mode and report issues on GitHub

### Debug Commands

Open DevTools (F12) on a shopping site:

```javascript
// Enable debug logging
window.GroceryUnitPricing.enableDebug();

// Test parser
window.ProductParser.parsePrice("$12.99");
window.ProductParser.parseQuantityAndUnit("15 oz");

// Test converter
window.UnitConverter.toStandardWeight(15, "oz");
```

## 📈 Roadmap

### Planned Features

- [ ] 🏆 **Best Value Highlighting** - Automatically highlight the best deal
- [ ] 📱 **Mobile Browser Support** - Extend to mobile Chrome/Edge
- [ ] 🛍️ **More Sites** - Target, Kroger, Safeway, etc.
- [ ] 💾 **Price History** - Track price changes over time
- [ ] 📊 **Comparison Mode** - Side-by-side product comparison
- [ ] 🔔 **Price Alerts** - Notify when prices drop
- [ ] 🧪 **Unit Tests** - Comprehensive test coverage
- [ ] 🌐 **Internationalization** - Support multiple languages/currencies

### Future Enhancements

- Export shopping lists with unit price data
- Integration with budgeting apps
- Custom unit preferences per product category
- Browser extension for Firefox and Edge

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report Bugs** - Open an issue with details and screenshots
2. **Suggest Features** - Share your ideas for improvements
3. **Submit PRs** - Fork, make changes, and submit a pull request
4. **Test** - Try the extension and report your experience
5. **Spread the Word** - Share with friends who shop online

### Development Setup

```bash
# Clone the repository
git clone https://github.com/phelix001/groceryunitpricing.git
cd groceryunitpricing

# Load in Chrome (Developer mode)
# See Installation section above

# Make changes to src/ files
# Reload extension in chrome://extensions/

# Test on shopping sites
```

See [CLAUDE.md](CLAUDE.md) for detailed development documentation.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Claude Code
- Icons designed with SVG
- Inspired by the need for smarter grocery shopping

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/phelix001/groceryunitpricing/issues)
- **Discussions**: [GitHub Discussions](https://github.com/phelix001/groceryunitpricing/discussions)

## ⭐ Star Us!

If this extension helps you save money, please consider giving it a star on GitHub!

---

**Made with ❤️ for smarter grocery shopping**

*Save money, one unit price at a time!* 🛒💰
