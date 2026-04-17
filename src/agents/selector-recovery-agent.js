/**
 * SelectorRecoveryAgent
 * Purpose: recover the best selector for a failed step using AI reasoning.
 */

class SelectorRecoveryAgent {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * Generates candidates for a broken selector.
   * @param {object} context 
   * @returns {Promise<object>} Recovery result with candidates
   */
  async recover(context) {
    const { targetDescription, brokenSelector, domSnapshot, url } = context;

    const prompt = `
You are an expert Test Automation Engineer using Cypress.
A primary CSS selector has failed to find an element during an E2E test.

CONTEXT:
- Target Element Description: "${targetDescription}"
- Failed Selector: "${brokenSelector}"
- Page URL: "${url}"

TASK:
Analyze the provided DOM snapshot (simplified) and recommend the most stable, unique CSS selector to find this element. 
Prefer selectors in this order: data-testid > id > aria-label > role/name > unique class > generic tag with text.

DOM SNAPSHOT:
${domSnapshot}

OUTPUT FORMAT:
Return ONLY a valid JSON object with this structure:
{
  "candidates": [
    {
      "selector": "css-selector",
      "strategy": "testid | id | aria | role | css",
      "confidence": 0.0 to 1.0,
      "rationale": "Why this selector was chosen"
    }
  ],
  "recommendedSelector": "best-css-selector",
  "recommendedConfidence": 0.95
}
`;

    if (!this.apiKey || this.apiKey === 'YOUR_API_KEY') {
       return this.mockRecovery(targetDescription);
    }

    try {
      // Logic to call Gemini/OpenAI would go here. 
      // For this demo, we'll use a fetch-based call to Gemini in the config task,
      // but this agent class encapsulates the reasoning logic.
      return null; // Signals the orchestrator to use the task-level API call
    } catch (e) {
      console.error('Agent Recovery Error:', e);
      return this.mockRecovery(targetDescription);
    }
  }

  mockRecovery(targetDescription) {
    console.log(`[SelectorRecoveryAgent] Mocking recovery for: ${targetDescription}`);
    // Heuristics for the demo retail app
    if (targetDescription.toLowerCase().includes('products')) {
        return {
            recommendedSelector: 'a[href*="products"]',
            recommendedConfidence: 0.98,
            candidates: [{ selector: 'a[href*="products"]', strategy: 'css', confidence: 0.98, rationale: 'Matches navigation link' }]
        };
    }
    if (targetDescription.toLowerCase().includes('add to cart')) {
        return {
            recommendedSelector: 'button.rw-btn-primary',
            recommendedConfidence: 0.92,
            candidates: [{ selector: 'button.rw-btn-primary', strategy: 'css', confidence: 0.92, rationale: 'Primary action button matches' }]
        };
    }
    return null;
  }
}

export default SelectorRecoveryAgent;
