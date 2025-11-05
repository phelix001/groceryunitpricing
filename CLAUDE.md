# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Chrome extension** that automatically displays unit pricing information on grocery shopping websites to help consumers compare products and make cost-effective purchasing decisions.

### Supported Shopping Sites
- Amazon.com
- Instacart.com
- Walmart.com
- Costco (via sameday.costco.com and instacart integration)
- Additional grocery sites can be added as needed

### Core Functionality
The extension injects content scripts into supported shopping sites to:
1. Parse product information (price, quantity, unit of measurement)
2. Calculate standardized unit prices (e.g., price per ounce, price per pound)
3. Display unit prices prominently on product listings
4. Enable easy comparison between similar products

## Development Commands

### Building the Extension
```bash
# Install dependencies
npm install

# Build for development (with source maps)
npm run build:dev

# Build for production
npm run build

# Watch mode for development
npm run watch
```

### Testing
```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run integration tests
npm run test:integration

# Test a single file
npm test -- path/to/test-file.test.js
```

### Linting
```bash
# Lint all files
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Loading Extension in Chrome
1. Build the extension: `npm run build`
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked"
5. Select the `dist/` or `build/` directory

## Architecture

### Extension Structure

```
groceryunitpricing/
├── manifest.json          # Extension manifest (v3)
├── src/
│   ├── background/        # Background service worker
│   │   └── service-worker.js
│   ├── content/           # Content scripts for each site
│   │   ├── amazon.js      # Amazon-specific parsing
│   │   ├── walmart.js     # Walmart-specific parsing
│   │   ├── instacart.js   # Instacart-specific parsing
│   │   ├── costco.js      # Costco-specific parsing
│   │   └── common.js      # Shared content script utilities
│   ├── lib/               # Shared libraries
│   │   ├── parser.js      # Product info extraction
│   │   ├── calculator.js  # Unit price calculations
│   │   ├── converter.js   # Unit conversions
│   │   └── formatter.js   # Display formatting
│   ├── popup/             # Extension popup UI
│   │   ├── popup.html
│   │   ├── popup.js
│   │   └── popup.css
│   └── styles/            # Injected CSS
│       └── content.css
├── tests/                 # Test files
└── dist/                  # Built extension (generated)
```

### Key Components

#### Content Scripts
Each shopping site requires a custom content script due to different DOM structures:

- **Amazon (`content/amazon.js`)**: Parses price from `.a-price`, quantity from product titles/descriptions
- **Walmart (`content/walmart.js`)**: Extracts price from `.price-main`, unit info from `.price-unit`
- **Instacart (`content/instacart.js`)**: Handles dynamic loading, parses React component data
- **Costco (`content/costco.js`)**: Similar to Instacart (uses same platform)

Each content script should:
1. Identify product containers on the page
2. Extract price, quantity, and unit information
3. Calculate standardized unit price
4. Inject unit price display into the DOM
5. Handle dynamic content loading (infinite scroll, AJAX)

#### Parser Library (`lib/parser.js`)
Centralized logic for parsing product information:
- Extract numerical price from various formats ($12.99, 12,99€, etc.)
- Parse quantity and unit from text (e.g., "15 oz", "2.5 lbs", "500g")
- Handle edge cases (multi-packs, count-based items, fluid vs weight)

#### Calculator Library (`lib/calculator.js`)
Unit price calculation logic:
- Normalize different units to standard measurements
- Calculate price per standard unit (oz, lb, kg, ml, L)
- Handle special cases (per-count for discrete items)

#### Converter Library (`lib/converter.js`)
Unit conversion utilities:
- Weight conversions (oz ↔ lb ↔ g ↔ kg)
- Volume conversions (fl oz ↔ cup ↔ pt ↔ qt ↔ gal ↔ ml ↔ L)
- Count-based units (per item, per 100g, etc.)

### Site-Specific Considerations

#### Amazon
- Multiple price formats (`.a-price`, `.a-offscreen`)
- Unit info often in product title or attributes
- Subscribe & Save pricing variants
- Multi-pack handling (e.g., "Pack of 3")

#### Walmart
- Price in `.price-main` or similar classes
- Native unit pricing sometimes shown (`.price-unit`)
- Need to distinguish between total price and unit price
- Rollback/sale pricing handling

#### Instacart/Costco
- React-based dynamic rendering
- Product cards load on scroll
- Need to use MutationObserver for new content
- Prices in `[data-test]` or custom attributes
- May need to query internal React state

### Extension Manifest (manifest.json)

Key configuration for Chrome Extension Manifest V3:
- **content_scripts**: Define match patterns for each shopping site
- **permissions**: Minimal permissions (activeTab, storage)
- **host_permissions**: Specific domains (amazon.com, walmart.com, etc.)
- **background**: Service worker for extension lifecycle
- **action**: Popup for user settings/preferences

## Testing Strategy

### Unit Tests
- Test parser functions with various product string formats
- Test calculator with different unit combinations
- Test converter with edge cases

### Integration Tests
- Mock DOM structures for each shopping site
- Test end-to-end: parse → calculate → display
- Test dynamic content handling

### Manual Testing
For each supported site, test:
1. Product listing pages (search results)
2. Individual product pages
3. Infinite scroll/pagination
4. Price updates (AJAX)
5. Different product categories (food, beverages, household items)

## Common Development Patterns

### Adding a New Shopping Site

1. Create new content script: `src/content/newsite.js`
2. Add match pattern to `manifest.json`:
   ```json
   {
     "matches": ["*://*.newsite.com/*"],
     "js": ["content/common.js", "content/newsite.js"],
     "css": ["styles/content.css"]
   }
   ```
3. Implement site-specific parsing:
   - Identify product container selector
   - Extract price selector/format
   - Extract quantity/unit information
   - Determine injection point for unit price display
4. Test thoroughly on multiple product types
5. Add tests for the new site parser

### Handling Dynamic Content

Use MutationObserver to detect new products:
```javascript
const observer = new MutationObserver((mutations) => {
  // Process new product elements
});
observer.observe(document.body, {
  childList: true,
  subtree: true
});
```

### Unit Price Display Strategy

Inject unit price as a sibling or child of the existing price element:
- Use distinctive class names (e.g., `.unit-price-extension`)
- Style consistently across sites
- Make it visually distinct but not intrusive
- Consider mobile responsiveness

## File Naming Conventions

Per user's global settings, all MD files should follow the format:
- `YYMMDD_DESCRIPTION.md`
- Example: `251105_ARCHITECTURE_NOTES.md`

## Known Challenges

### Price Extraction
- Multiple price formats (sales, subscriptions, bulk pricing)
- Currency variations (though primarily USD for initial sites)
- Discount badges and promotional pricing

### Unit Parsing
- Inconsistent text formatting ("15oz" vs "15 oz" vs "15-oz")
- Multi-pack quantities ("2 x 15 oz")
- Irregular units ("each", "count", "servings")
- Metric vs Imperial (oz vs g, fl oz vs ml)

### Performance
- Avoid blocking page load
- Minimize DOM manipulation
- Efficient MutationObserver patterns
- Cache calculations where possible

### Site Changes
- Shopping sites frequently update their HTML structure
- Implement resilient selectors (fallback strategies)
- Add logging/error reporting for failed parsing
- Version tracking for site-specific parsers

## Browser Compatibility

Primary target: **Chrome** (Manifest V3)

Consider future support for:
- Edge (Chromium-based, should work with minimal changes)
- Firefox (requires Manifest V2 or V3 adaptation)
- Safari (requires additional adaptation)

## Privacy & Security

- No external API calls (all processing client-side)
- No data collection or analytics
- No permissions beyond necessary host access
- Minimal storage usage (user preferences only)

## User Settings (Future Enhancement)

Potential settings to implement:
- Preferred unit (oz vs g, fl oz vs ml)
- Display format (inline, tooltip, highlight)
- Enable/disable per site
- Custom price threshold highlighting
