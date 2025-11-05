/**
 * Instacart DOM Inspector
 *
 * Copy and paste this entire script into the browser console on an Instacart page
 * to identify the correct selectors for product elements.
 */

(function() {
  console.log('=== Instacart DOM Inspector ===\n');

  // Find all possible product containers
  const possibleContainers = [
    { selector: '[data-testid="product-card"]', name: 'data-testid=product-card' },
    { selector: '[data-testid="item-card"]', name: 'data-testid=item-card' },
    { selector: '[data-testid*="product"]', name: 'data-testid contains product' },
    { selector: '[class*="ProductCard"]', name: 'class contains ProductCard' },
    { selector: '[class*="ItemCard"]', name: 'class contains ItemCard' },
    { selector: 'article', name: 'article elements' },
    { selector: '[role="article"]', name: 'role=article' },
    { selector: 'li[class*="product"]', name: 'li with product class' },
    { selector: 'li[class*="item"]', name: 'li with item class' },
    { selector: 'div[class*="product"]', name: 'div with product class' },
    { selector: 'div[class*="item"]', name: 'div with item class' }
  ];

  console.log('1. SEARCHING FOR PRODUCT CONTAINERS:\n');
  let bestContainerSelector = null;
  let maxProducts = 0;

  possibleContainers.forEach(({ selector, name }) => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      console.log(`✓ Found ${elements.length} elements: ${name}`);
      console.log(`  Selector: ${selector}`);

      if (elements.length > maxProducts && elements.length < 200) {
        maxProducts = elements.length;
        bestContainerSelector = selector;
      }

      // Show first element's classes
      if (elements[0]) {
        console.log(`  First element classes: ${elements[0].className}`);
        console.log(`  First element data attrs:`, Array.from(elements[0].attributes)
          .filter(attr => attr.name.startsWith('data-'))
          .map(attr => `${attr.name}="${attr.value}"`)
        );
      }
      console.log('');
    }
  });

  if (!bestContainerSelector) {
    console.error('❌ Could not find any product containers!');
    console.log('\nTrying to find any repeating patterns...');

    // Find repeating elements
    const allElements = document.querySelectorAll('*');
    const tagCounts = {};

    allElements.forEach(el => {
      const key = `${el.tagName}${el.className ? `.${el.className.split(' ')[0]}` : ''}`;
      tagCounts[key] = (tagCounts[key] || 0) + 1;
    });

    console.log('Most common elements:');
    Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([tag, count]) => {
        console.log(`  ${tag}: ${count}`);
      });

    return;
  }

  console.log(`\n📦 BEST PRODUCT CONTAINER: ${bestContainerSelector} (${maxProducts} found)\n`);

  // Now inspect the structure of product cards
  const products = document.querySelectorAll(bestContainerSelector);

  if (products.length > 0) {
    const firstProduct = products[0];
    console.log('2. ANALYZING FIRST PRODUCT STRUCTURE:\n');
    console.log('Full HTML of first product:');
    console.log(firstProduct.outerHTML.substring(0, 1000) + '...\n');

    // Find price elements
    console.log('3. SEARCHING FOR PRICE ELEMENTS:\n');
    const priceSelectors = [
      '[data-testid="price"]',
      '[data-testid*="price"]',
      '[class*="Price"]',
      '[class*="price"]',
      '[class*="CurrentPrice"]',
      'span[class*="dollar"]',
      'span[class*="currency"]'
    ];

    priceSelectors.forEach(selector => {
      const priceEl = firstProduct.querySelector(selector);
      if (priceEl) {
        console.log(`✓ Found price with: ${selector}`);
        console.log(`  Text: "${priceEl.textContent.trim()}"`);
        console.log(`  Classes: ${priceEl.className}`);
        console.log('');
      }
    });

    // Find description/title
    console.log('4. SEARCHING FOR PRODUCT TITLE/DESCRIPTION:\n');
    const titleSelectors = [
      '[data-testid="item-name"]',
      '[data-testid="product-name"]',
      '[data-testid*="name"]',
      '[class*="ItemName"]',
      '[class*="ProductName"]',
      '[class*="Title"]',
      'h1', 'h2', 'h3', 'h4', 'h5'
    ];

    titleSelectors.forEach(selector => {
      const titleEl = firstProduct.querySelector(selector);
      if (titleEl) {
        console.log(`✓ Found title with: ${selector}`);
        console.log(`  Text: "${titleEl.textContent.trim().substring(0, 100)}"`);
        console.log(`  Classes: ${titleEl.className}`);
        console.log('');
      }
    });

    // Extract sample data
    console.log('5. SAMPLE PRODUCT DATA:\n');

    const allText = firstProduct.textContent;
    const priceMatch = allText.match(/\$\d+\.?\d*/);
    const quantityMatch = allText.match(/\d+\.?\d*\s*(oz|lb|g|kg|ml|l|fl oz|count|ct)/i);

    console.log(`Price found in text: ${priceMatch ? priceMatch[0] : 'NOT FOUND'}`);
    console.log(`Quantity found in text: ${quantityMatch ? quantityMatch[0] : 'NOT FOUND'}`);
    console.log(`Full text: "${allText.substring(0, 200)}..."`);
  }

  console.log('\n=== RECOMMENDED CONFIGURATION ===\n');
  console.log('Based on this analysis, update instacart.js with:');
  console.log(`
const instacartConfig = {
  productSelector: '${bestContainerSelector}',
  priceSelector: '/* UPDATE BASED ON SECTION 3 ABOVE */',
  descriptionSelector: '/* UPDATE BASED ON SECTION 4 ABOVE */',
  // ...rest of config
};
  `);

  console.log('\n=== NEXT STEPS ===\n');
  console.log('1. Review the selectors found above');
  console.log('2. Update src/content/instacart.js with the correct selectors');
  console.log('3. Reload the extension');
  console.log('4. Test again');

})();
