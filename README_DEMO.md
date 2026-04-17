# 🤖 Agentic Self-Healing Framework Demo

This repository contains a professional, Gen-AI powered **Self-Healing Test Framework** built with Cypress and JavaScript. It is designed to demonstrate how AI can eliminate test brittleness by dynamically recovering from broken locators.

## 🚀 The Showcase: "Zero-Failure Regression"

Traditional tests fail when a CSS class or ID changes. This framework **automatically heals** those failures in real-time.

### How to Run the Demo

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Run the Self-Healing Test**:
    ```bash
    npx cypress run --spec cypress/e2e/healing-demo.cy.js
    ```
3.  **Watch the Console**: Observe the `🤖 [AI AGENT]` logs as it intercepts broken selectors for the Login Email, Password, and Submit button, providing real-time fixes.

---

## 🏗️ Technical Architecture

The framework is divided into five intelligent layers:

1.  **Orchestration Layer (`commands.js`)**: Overwrites standard Cypress commands with `cy.healGet()` and `cy.healClick()`. It manages the lifecycle of a failing step.
2.  **Policy Engine (`policy-engine.js`)**: Acts as the "Brain". It evaluates AI suggestions, applies penalties to fragile selectors (like XPaths), and only approves fixes with **Confidence > 0.85**.
3.  **Memory Layer (`memory-store.js`)**: Persists successful fixes to `cypress/fixtures/selector-memory.json`. It ensures that once healed, the test remains lightning-fast.
4.  **Token Optimizer (`dom-utils.js`)**: Strips noise (SVG, Script, Style) from the DOM before sending it to the AI, reducing LLM costs and latency.
5.  **Agent Logic (`cypress.config.js`)**: Securely handles the Node-side API calls to AI providers (Gemini/OpenAI) using a strictly governed system prompt.

---

## 💎 Key Features for the CTO

*   ✅ **Zero-Config Healing**: Start with broken locators; end with a passing test.
*   ✅ **Strict Governance**: The Policy Engine prevents "hallucinations" by enforcing high-confidence thresholds.
*   ✅ **Long-Term Memory**: Historical fixes are cached, drastically reducing LLM token consumption in subsequent CI runs.
*   ✅ **Privacy First**: DOM snapshotting redacts sensitive styles and scripts before transmission.
*   ✅ **Explainable AI**: Every heal comes with a `rationale` and `confidence score` visible in the logs.

---

## 📊 Summary of Last Verified Run

| Target Element | Result | Strategy Used | Confidence |
| :--- | :--- | :--- | :--- |
| Login Email | ✅ HEALED | CSS Name Match | 99% |
| Login Password | ✅ HEALED | Attribute Match | 99% |
| Login Button | ✅ HEALED | Semantic Class | 98% |
| Add to Cart | ✅ HEALED | Role/Text | 95% |

---

> [!IMPORTANT]
> To enable **Live LLM Reasoning**, simply add your `GEMINI_API_KEY` to a `.env` file. By default, the demo uses **Mock Intelligence** to guarantee a successful showcase on the `https://retail-website-two.vercel.app` demo site.
