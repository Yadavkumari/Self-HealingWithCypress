describe('🤖 Gen-AI Self-Healing Demo', () => {

    beforeEach(() => {
        // Suppress app errors
        Cypress.on('uncaught:exception', () => false);
        cy.resetHealingLog();
    });

    it('Scenario: Full E2E Journey with AI Self-Healing', () => {
        // --- AUTHENTICATION PHASE ---
        cy.visit('https://retail-website-two.vercel.app/app/dashboard');
        cy.wait(3000);

        cy.log('🔍 Locating Email field via AI...');
        cy.healGet('#non-existent-email', { label: 'Login Email' }).clear().type('test@demo.com');

        cy.log('🔍 Locating Password field via AI...');
        cy.healGet('[data-testid="wrong-pass-id"]', { label: 'Login Password' }).clear().type('password123');

        cy.log('🔍 Locating Submit button via AI...');
        cy.healClick('button.totally-wrong-class', { label: 'Login Button' });

        // Verify successful login
        cy.url().should('include', '/dashboard');

        // --- NAVIGATION & PRODUCT PHASE ---
        cy.log('🚀 Final validation post-login...');
        cy.wait(6000);

        // Navigate to Products
        cy.resilientClick(
            "//a[contains(., 'Products')]",
            'Products Menu',
            'STEP-NAVIGATION'
        );
        cy.wait(3000);

        cy.log('🛒 Adding product to cart with broken locator...');
        // Broken selector for 'Add to Cart' - This will now trigger on the correct page
        cy.healClick('.missing-cart-btn-selector', { label: 'Add to Cart Button' });

        cy.log('✅ AI successfully bridged the gap to complete the flow!');
    });
});
