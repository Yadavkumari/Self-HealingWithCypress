/**
 * DomSnapshotTool
 * Responsible for producing a token-efficient, clean DOM snapshot.
 */

class DomSnapshotTool {
  /**
   * Captures and cleans the DOM for AI analysis.
   * @param {HTMLElement} rootElement 
   * @returns {string} Cleaned HTML string
   */
  capture(rootElement) {
    // Clone the element to avoid modifying the actual page
    const clone = rootElement.cloneNode(true);

    // 1. Remove scripts, styles, and SVG paths (keep SVG tag for role)
    const noise = clone.querySelectorAll('script, style, link, noscript');
    noise.forEach(el => el.remove());

    // 2. Simplify SVGs
    clone.querySelectorAll('svg').forEach(svg => {
      svg.innerHTML = '';
      if (!svg.getAttribute('aria-label') && !svg.getAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
    });

    // 3. Keep only essential attributes
    const essentialAttrs = ['id', 'class', 'name', 'type', 'value', 'placeholder', 'aria-label', 'role', 'data-testid', 'data-cy', 'href', 'title'];
    
    const allElements = clone.querySelectorAll('*');
    allElements.forEach(el => {
      const attributes = el.attributes;
      for (let i = attributes.length - 1; i >= 0; i--) {
        const attrName = attributes[i].name;
        if (!essentialAttrs.includes(attrName) && !attrName.startsWith('data-')) {
          el.removeAttribute(attrName);
        }
      }
      
      // 4. Trim text content to avoid bloat
      if (el.children.length === 0 && el.textContent) {
        el.textContent = el.textContent.trim().substring(0, 100);
      }
    });

    return clone.innerHTML;
  }
}

export default new DomSnapshotTool();
