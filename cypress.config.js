const { defineConfig } = require("cypress");
const fs = require('fs');
const path = require('path');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://retail-website-two.vercel.app',
    viewportWidth: 1280,
    viewportHeight: 800,
    setupNodeEvents(on, config) {
      on('task', {
        /**
         * The Node.js Agent - Heals selectors based on intent
         */
        healSelector({ intent, domSnapshot, stepId, originalSelector }) {
          console.log(`\n🤖 [AI AGENT] Healing: "${intent}"`);

          let healedSelector = null;
          let confidence = 0;
          const normalizedIntent = intent.toLowerCase();

          // Robust Heuristic Mapping
          if (normalizedIntent.includes('email')) {
            healedSelector = "//input[@type='email']";
            confidence = 0.95;
          } else if (normalizedIntent.includes('password')) {
            healedSelector = "//input[@type='password']";
            confidence = 0.98;
          } else if (normalizedIntent.includes('sign in') || normalizedIntent.includes('login')) {
            healedSelector = "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'sign in') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'login')]";
            confidence = 0.92;
          } else if (normalizedIntent.includes('products')) {
            healedSelector = "//a[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'products')]";
            confidence = 0.90;
          } else if (normalizedIntent.includes('add to cart') || normalizedIntent.includes('cart button')) {
            // Very robust commerce "Add to Cart" finder
            healedSelector = "button:contains('Add to cart'), button:contains('Add to Cart'), button.add-to-cart, [aria-label*='cart']";
            // Check for XPath version if preferred
            if (normalizedIntent.includes('button')) {
              healedSelector = "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'cart')]";
            }
            confidence = 0.88;
          }

          if (!healedSelector || confidence < 0.80) {
            throw new Error(`[FATAL] AI Agent failed to heal "${intent}".`);
          }

          // Auditing
          const reportPath = path.resolve(__dirname, 'healing-report.md');
          const timestamp = new Date().toLocaleString();
          const reportEntry = `
## 🛠 Healing Event: ${timestamp}
- **Step ID:** ${stepId}
- **Intent:** ${intent}
- **Original Tracker:** \`${originalSelector}\`
- **Healed Locator:** \`${healedSelector}\`
- **Confidence:** \`${(confidence * 100).toFixed(2)}%\`
---
`;
          if (!fs.existsSync(reportPath)) {
            fs.writeFileSync(reportPath, '# 🛡 Agentic Self-Healing Audit Report\n\n');
          }
          fs.appendFileSync(reportPath, reportEntry);

          return { healedSelector, confidence };
        }
      });
      return config;
    },
  },
});
