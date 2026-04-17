describe('🚀 STARTING E2E SELF-HEALING SHOWCASE 🚀', () => {

  it('testSelfHealingE2EFlow: Full checkout journey with broken selectors', () => {
    // 1. Navigate to target application
    cy.log('--- 🌐 STEP 0: NAVIGATE TO DASHBOARD ---');
    cy.visit('https://retail-website-two.vercel.app/app/dashboard');
    cy.wait(3000); // Wait for React initial load (as per Java Thread.sleep)

    // ============================================
    // STEP 1: FILL EMAIL (INTENTIONAL FAILURE HERE)
    // ============================================
    cy.log('\n--- 🔴 STEP 1: EMAIL INPUT (BROKEN SELECTOR) ---');
    // Using old selector 'input.old-email-field'
    cy.resilientFill(
      'input.old-email-field', 
      'test@demo.com', 
      'Email Input', 
      'step-fill-email'
    );
    cy.wait(500);

    // ============================================
    // STEP 2: FILL PASSWORD (STABLE DETERMINISTIC)
    // ============================================
    cy.log('\n--- 🟢 STEP 2: PASSWORD INPUT (STABLE SELECTOR) ---');
    cy.resilientFill(
      "//input[@type='password']", 
      'password123', 
      'Password Input', 
      'step-fill-password'
    );
    cy.wait(500);

    // ============================================
    // STEP 3: CLICK SIGN IN (INTENTIONAL FAILURE)
    // ============================================
    cy.log('\n--- 🔴 STEP 3: SIGN IN BUTTON (BROKEN SELECTOR) ---');
    cy.resilientClick(
      '#legacy-login-btn-99', 
      'Sign In Button', 
      'step-click-signin'
    );
    cy.wait(6000); // Wait for dashboard to load after login (as per Java Thread.sleep)

    // ============================================
    // STEP 4: NAVIGATE TO PRODUCTS (STABLE)
    // ============================================
    cy.log('\n--- 🟢 STEP 4: CLICK PRODUCTS MENU (STABLE) ---');
    cy.resilientClick(
      "//a[contains(., 'Products')]", 
      'Products Menu', 
      'step-click-products'
    );
    cy.wait(3000); // Wait for products to load (as per Java Thread.sleep)

    // ============================================
    // STEP 5: ADD PRODUCT TO CART (INTENTIONAL FAILURE)
    // ============================================
    cy.log('\n--- 🔴 STEP 5: ADD TO CART (BROKEN SELECTOR) ---');
    // Using old ID 'btn-legacy-cart-add-42'
    cy.resilientClick(
      '#btn-legacy-cart-add-42', 
      'Add to Cart Button', 
      'step-click-add-cart'
    );
    cy.wait(2000); // Wait to see the item added!

    cy.log('--- ✅ FULL E2E TEST PASSED ---');
    cy.log('The script completed successfully despite multiple broken selectors!');
  });
});
