/**
 * MemoryStore — Interface for persistent healing memory.
 */
class MemoryStore {
  /**
   * Checks if a broken selector already has a proven fix.
   * @param {string} url - Current page URL
   * @param {string} locatorDescription - Friendly name or the broken selector itself
   * @returns {Cypress.Chainable<string|null>}
   */
  getHeal(url, locatorDescription) {
    return cy.task('checkMemory', { url, label: locatorDescription }).then(result => {
      return result ? result.selector : null;
    });
  }

  /**
   * Persists a successful heal to memory.
   * @param {string} url 
   * @param {string} locatorDescription 
   * @param {string} healedSelector 
   */
  saveHeal(url, locatorDescription, healedSelector) {
    return cy.task('saveToMemory', { url, label: locatorDescription, healedSelector });
  }
}

export default new MemoryStore();
