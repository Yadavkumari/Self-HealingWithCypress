/**
 * PolicyEngine — Governs healing decisions with confidence thresholds.
 */
class PolicyEngine {
  constructor(threshold = 0.85) {
    this.threshold = threshold;
  }

  /**
   * Evaluates AI suggestions and returns the best approved selector.
   * @param {Array} candidates - Array of { selector, strategy, confidence, rationale }
   * @returns {Object|null} - Approved candidate or null
   */
  evaluate(candidates) {
    if (!candidates || candidates.length === 0) return null;

    // Apply penalties to fragile selectors (like long XPaths)
    const scoredCandidates = candidates.map(c => {
      let score = c.confidence;
      
      // Penalty for complex XPaths
      if (c.selector.includes('/') && c.selector.split('/').length > 5) {
        score -= 0.15;
      }
      
      // Bonus for data-testid
      if (c.selector.includes('data-testid') || c.selector.includes('data-cy')) {
        score += 0.05;
      }

      return { ...c, finalScore: Math.min(score, 1.0) };
    });

    // Pick the best one above threshold
    const best = scoredCandidates.sort((a, b) => b.finalScore - a.finalScore)[0];
    
    if (best && best.finalScore >= this.threshold) {
      return best;
    }

    return null;
  }
}

export default new PolicyEngine();
