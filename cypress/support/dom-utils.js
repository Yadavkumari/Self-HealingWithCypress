/**
 * utils/dom-capture.js — Token-efficient DOM snapshotting.
 */
export function getOptimizedDomSnapshot() {
  const bodyClone = document.body.cloneNode(true);
  
  // Strip non-semantic tags to save tokens
  const stripSelectors = ['script', 'style', 'svg', 'noscript', 'link', 'iframe'];
  stripSelectors.forEach(selector => {
    bodyClone.querySelectorAll(selector).forEach(el => el.remove());
  });

  // Keep only relevant interactive attributes
  const interactiveAttrs = ['id', 'class', 'name', 'type', 'value', 'role', 'aria-label', 'data-testid', 'data-cy', 'placeholder', 'href'];
  
  bodyClone.querySelectorAll('*').forEach(el => {
    const attrs = el.attributes;
    for (let i = attrs.length - 1; i >= 0; i--) {
      const attrName = attrs[i].name;
      if (!interactiveAttrs.includes(attrName) && !attrName.startsWith('data-')) {
        el.removeAttribute(attrName);
      }
    }
    // Trim text content
    if (el.children.length === 0 && el.textContent) {
      el.textContent = el.textContent.trim().substring(0, 50);
    }
  });

  return bodyClone.innerHTML;
}
