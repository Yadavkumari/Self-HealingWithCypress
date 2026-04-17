export const loginPage = {
    visit() {
        cy.visit('/app/login');
    },
    
    // Using broken selectors intentionally to show healing
    doLogin(email, password) {
        cy.log(`🔐 Logging in as ${email}...`);
        cy.healGet('#broken-email-id', { label: 'Login Email Field' }).clear().type(email);
        cy.healGet('[data-testid="wrong-password"]', { label: 'Login Password Field' }).clear().type(password);
        cy.healClick('button.wrong-class', { label: 'Login Submit Button' });
        
        // Wait for potential network request/cold start
        cy.url({ timeout: 15000 }).should('not.include', '/login');
    }
};
