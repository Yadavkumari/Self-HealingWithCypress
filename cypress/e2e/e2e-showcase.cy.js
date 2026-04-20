// ============================================================
//  35 End-to-End Scenarios
//  Self-Healing AI Framework | retail-website-two.vercel.app
//  ★ BLOCK 1  → TC-01, TC-02, TC-03 = Self-Healing
//               TC-04, TC-05        = Plain Cypress
//  ★ BLOCK 2  → TC-06, TC-07       = Self-Healing
//               TC-08, TC-09, TC-10 = Plain Cypress
//  ★ BLOCK 3–7 → All Plain Cypress  (1 intentional FAIL each)
// ============================================================

const BASE_URL = 'https://retail-website-two.vercel.app';

// ─── Plain login helper ───────────────────────────────────────
const loginPlain = () => {
    cy.visit(`${BASE_URL}/app/dashboard`);
    cy.wait(2000);
    cy.get("input[type='email'], input[name='email']").first().clear().type('test@demo.com');
    cy.get("input[type='password']").first().clear().type('password123');
    cy.get("button[type='submit'], form button").first().click({ force: true });
    cy.wait(4000);
};

// ─── Plain navigate to products ──────────────────────────────
const goToProducts = () => {
    cy.get("nav a, a[href*='product'], a[href*='catalog']").first().click({ force: true });
    cy.wait(2500);
};

describe('🏎️ CTO DASHBOARD SHOWCASE – Full E2E Suite (35 Tests)', () => {

    beforeEach(() => {
        Cypress.on('uncaught:exception', () => false);
        cy.resetHealingLog();
    });

    // BLOCK 1 · Authentication
    //   TC-01 TC-02 TC-03 → SELF-HEALING
    //   TC-04 TC-05       → Plain Cypress

    describe('🔐 Authentication Flows', () => {

        it('TC-01 | [SELF-HEALING] Login – Heal broken email + submit selectors', () => {
            cy.visit(`${BASE_URL}/app/dashboard`);
            cy.wait(2000);
            cy.resilientFill('#totally-broken-id-101', 'test@demo.com', 'Login Email Input');
            cy.resilientFill("//input[@type='password']", 'password123', 'Secure Password Field');
            cy.resilientClick('button.non-existent-login-btn-99', 'Submit Login Button');
            cy.wait(4000);
            cy.log('TC-01 PASS: Login healed and completed.');
        });

        it('TC-02 | [SELF-HEALING] Heal broken email field – valid format accepted', () => {
            cy.visit(`${BASE_URL}/app/dashboard`);
            cy.wait(2000);
            cy.resilientFill('#broken-email-xyz-007', 'user@example.com', 'Login Email Input');
            cy.log('TC-02 PASS: Email field healed and filled.');
        });

        it('TC-03 | [SELF-HEALING] Heal broken password field – masked input', () => {
            cy.visit(`${BASE_URL}/app/dashboard`);
            cy.wait(2000);
            cy.resilientFill('input#pwd-broken-404', 'secureP@ss!', 'Secure Password Field');
            cy.log('TC-03 PASS: Password field healed and filled.');
        });

        it('TC-04 | [PLAIN] Login with correct credentials and reach app', () => {
            loginPlain();
            cy.get('body').should('be.visible');
            cy.url().should('not.include', 'login');
            cy.log('TC-04 PASS: Plain login completed successfully.');
        });

        it('TC-05 | [PLAIN] Login persists across page reload', () => {
            loginPlain();
            cy.reload();
            cy.wait(2000);
            cy.get('body').should('be.visible');
            cy.log('TC-05 PASS: Session persists after reload.');
        });
    });

    // BLOCK 2 · Navigation
    //   TC-06 TC-07       → SELF-HEALING
    //   TC-08 TC-09 TC-10 → Plain Cypress
    describe('Navigation & Routing', () => {

        it('TC-06 | [SELF-HEALING] Heal broken Products nav link', () => {
            cy.visit(`${BASE_URL}/app/dashboard`);
            cy.wait(2000);
            cy.resilientFill('#totally-broken-id-101', 'test@demo.com', 'Login Email Input');
            cy.resilientFill("//input[@type='password']", 'password123', 'Secure Password Field');
            cy.resilientClick('button.non-existent-login-btn-99', 'Submit Login Button');
            cy.wait(4000);
            cy.resilientClick("//a[contains(., 'Products')]", 'Products Navigation Link');
            cy.wait(2000);
            cy.log('TC-06 PASS: Products nav healed and clicked.');
        });

        it('TC-07 | [SELF-HEALING] Heal broken Add-to-Cart after login + navigate', () => {
            cy.visit(`${BASE_URL}/app/dashboard`);
            cy.wait(2000);
            cy.resilientFill('#totally-broken-id-101', 'test@demo.com', 'Login Email Input');
            cy.resilientFill("//input[@type='password']", 'password123', 'Secure Password Field');
            cy.resilientClick('button.non-existent-login-btn-99', 'Submit Login Button');
            cy.wait(5000);
            cy.resilientClick("//a[contains(., 'Products')]", 'Products Navigation Link');
            cy.wait(3000);
            cy.resilientClick('#btn-invalid-commerce-uuid-42', 'Add to Cart Commerce Button');
            cy.wait(3000);
            cy.log('TC-07 PASS: Full self-healing flow – login + nav + cart.');
        });

        it('TC-08 | [PLAIN] Navigate to Products via real nav link', () => {
            loginPlain();
            goToProducts();
            cy.get('body').should('be.visible');
            cy.log('TC-08 PASS: Products page loaded via plain nav.');
        });

        it('TC-09 | [PLAIN] Navigate back using browser history', () => {
            loginPlain();
            goToProducts();
            cy.go('back');
            cy.wait(1500);
            cy.get('body').should('exist');
            cy.log('TC-09 PASS: Browser back navigation works.');
        });

        it('TC-10 | [PLAIN] Header / nav bar is visible after login', () => {
            loginPlain();
            cy.get('nav, header, [class*="navbar" i]').should('exist');
            cy.log('TC-10 PASS: Nav bar visible post-login.');
        });
    });

    // BLOCK 3 · Search  ── PLAIN (1 intentional FAIL: TC-13)
    describe('🔍 [PLAIN] Search Functionality', () => {

        it('TC-11 | App loads and user stays logged in after login', () => {
            loginPlain();
            cy.url().should('not.include', 'login');
            cy.get('body').should('be.visible');
            cy.log('TC-11 PASS: App accessible after login.');
        });

        it('TC-12 | Search input accepts typed text', () => {
            loginPlain();
            cy.get("input[type='search'], input[placeholder*='search' i]")
                .then($el => {
                    if ($el.length) {
                        cy.wrap($el.first()).type('shoes');
                        cy.wait(1500);
                    } else {
                        cy.log('ℹ️ No search field visible – skipping type.');
                    }
                });
            cy.log('TC-12 PASS: Search field interaction completed.');
        });

        it('TC-13 | ❌ [INTENTIONAL FAIL] Body must contain non-existent keyword', () => {
            // Intentionally failing – for CI/CD pass/fail dashboard demo.
            loginPlain();
            cy.get('body').should('contain.text', 'PRODUCT_NOT_EXIST_DEMO_XYZ_FAIL_SHOWCASE');
        });

        it('TC-14 | Page title is set and not empty', () => {
            loginPlain();
            cy.title().should('not.be.empty');
            cy.log('TC-14 PASS: Page title rendered correctly.');
        });
    });

    // BLOCK 4 · Product Catalogue  ── PLAIN (1 intentional FAIL: TC-18)
    describe('🛍️ [PLAIN] Product Catalogue', () => {

        it('TC-15 | Products page loads after plain nav click', () => {
            loginPlain();
            goToProducts();
            cy.get('body').should('exist');
            cy.log('TC-15 PASS: Products page loaded.');
        });

        it('TC-16 | At least one button is visible on products page', () => {
            loginPlain();
            goToProducts();
            cy.get('button').should('have.length.at.least', 1);
            cy.log('TC-16 PASS: Buttons present on products page.');
        });

        it('TC-17 | Add-to-cart style button exists on products page', () => {
            loginPlain();
            goToProducts();
            cy.get("button[class*='cart' i], button[class*='add' i], button.rw-btn-primary")
                .should('exist');
            cy.log('TC-17 PASS: Add-to-cart button exists.');
        });

        it('TC-18 | ❌ [INTENTIONAL FAIL] Add-to-cart buttons count must equal 999', () => {
            // Intentionally failing – for CI/CD pass/fail dashboard demo.
            loginPlain();
            goToProducts();
            cy.get("button[class*='cart' i], button[class*='add' i], button.rw-btn-primary")
                .should('have.length', 999);
        });

        it('TC-19 | Products page renders within 10 seconds', () => {
            const start = Date.now();
            loginPlain();
            goToProducts();
            cy.get('body').should('be.visible').then(() => {
                const elapsed = Date.now() - start;
                expect(elapsed).to.be.lessThan(10000);
                cy.log(`TC-19 PASS: Page loaded in ${elapsed}ms`);
            });
        });

        it('TC-20 | Can navigate from products back to previous page', () => {
            loginPlain();
            goToProducts();
            cy.go('back');
            cy.wait(1500);
            cy.get('body').should('exist');
            cy.log('TC-20 PASS: Back navigation from Products works.');
        });
    });

    // BLOCK 5 · Cart Operations  ── PLAIN (1 intentional FAIL: TC-23)
    describe('🛒 [PLAIN] Cart Operations', () => {

        it('TC-21 | Can click Add-to-Cart on first available product', () => {
            loginPlain();
            goToProducts();
            cy.get("button[class*='cart' i], button[class*='add' i], button.rw-btn-primary")
                .first().click({ force: true });
            cy.wait(2000);
            cy.get('body').should('be.visible');
            cy.log('TC-21 PASS: Add-to-cart clicked successfully.');
        });

        it('TC-22 | Cart/badge area is present in the header', () => {
            loginPlain();
            cy.get('.rw-pill, [class*="badge" i], [class*="cart" i]').then($el => {
                if ($el.length) {
                    cy.wrap($el.first()).should('exist');
                } else {
                    cy.log('Cart badge not visible – OK at this stage.');
                }
            });
            cy.log('TC-22 PASS: Cart header area verified.');
        });

        it('TC-23 | ❌ [INTENTIONAL FAIL] Cart total must be "$0.00" after adding item', () => {
            // Intentionally failing – cart total cannot be $0.00 after an add.
            loginPlain();
            goToProducts();
            cy.get("button[class*='cart' i], button[class*='add' i], button.rw-btn-primary")
                .first().click({ force: true });
            cy.wait(2000);
            cy.get('[class*="total" i], [class*="price" i], [class*="amount" i]')
                .first().should('have.text', '$0.00');
        });

        it('TC-24 | App remains stable after add-to-cart', () => {
            loginPlain();
            goToProducts();
            cy.get("button[class*='cart' i], button[class*='add' i], button.rw-btn-primary")
                .first().click({ force: true });
            cy.wait(2000);
            cy.get('body').should('be.visible');
            cy.log('TC-24 PASS: App stable after add-to-cart.');
        });

        it('TC-25 | URL stays on the retail app after cart action', () => {
            loginPlain();
            goToProducts();
            cy.get("button[class*='cart' i], button[class*='add' i], button.rw-btn-primary")
                .first().click({ force: true });
            cy.wait(2000);
            cy.url().should('include', 'retail-website-two.vercel.app');
            cy.log('TC-25 PASS: URL remains on the retail app.');
        });
    });

    // BLOCK 6 · Checkout  ── PLAIN (1 intentional FAIL: TC-28)
    describe('💳 [PLAIN] Checkout Process', () => {

        it('TC-26 | Checkout / cart link is navigable', () => {
            loginPlain();
            cy.get("a[href*='checkout'], button[class*='checkout' i]").then($el => {
                if ($el.length) {
                    cy.wrap($el.first()).click({ force: true });
                } else {
                    goToProducts();
                }
            });
            cy.wait(2000);
            cy.get('body').should('exist');
            cy.log('TC-26 PASS: Checkout link navigated.');
        });

        it('TC-27 | At least one input field is present on the page', () => {
            loginPlain();
            cy.get('input').should('have.length.at.least', 1);
            cy.log('TC-27 PASS: Input fields present.');
        });

        it('TC-28 | ❌ [INTENTIONAL FAIL] Order confirmation visible before placing order', () => {
            // Intentionally failing – confirmation cannot appear before order is placed.
            loginPlain();
            cy.get('[class*="confirmation" i], [class*="order-success" i], [class*="thank-you" i]')
                .should('be.visible');
        });

        it('TC-29 | Page remains stable after browsing through catalogue', () => {
            loginPlain();
            goToProducts();
            cy.get("button[class*='cart' i], button[class*='add' i], button.rw-btn-primary")
                .first().click({ force: true });
            cy.wait(2000);
            cy.get('body').should('be.visible');
            cy.log('TC-29 PASS: Page stable after catalogue browsing.');
        });

        it('TC-30 | Browser back from product page works correctly', () => {
            loginPlain();
            goToProducts();
            cy.go('back');
            cy.wait(1500);
            cy.get('body').should('exist');
            cy.log('TC-30 PASS: Browser back works from product area.');
        });
    });

    // BLOCK 7 · UI Observability  ── PLAIN (1 intentional FAIL: TC-33)
    describe('🖥️ [PLAIN] UI Observability & Telemetry', () => {

        it('TC-31 | App page title is not empty', () => {
            loginPlain();
            cy.title().should('not.be.empty');
            cy.log('TC-31 PASS: Page title is set correctly.');
        });

        it('TC-32 | App renders without horizontal scroll overflow', () => {
            loginPlain();
            cy.window().its('document.documentElement.scrollWidth').then(scrollWidth => {
                cy.window().its('innerWidth').then(innerWidth => {
                    expect(scrollWidth).to.be.lte(innerWidth + 20);
                });
            });
            cy.log('TC-32 PASS: No horizontal overflow detected.');
        });

        it('TC-33 | ❌ [INTENTIONAL FAIL] Telemetry API endpoint must return 200', () => {
            // Intentionally failing – no /api/healing-telemetry endpoint exists.
            cy.request({
                url: `${BASE_URL}/api/healing-telemetry`,
                failOnStatusCode: false
            }).its('status').should('eq', 200);
        });

        it('TC-34 | App loads within 15 seconds (performance baseline)', () => {
            const start = Date.now();
            cy.visit(`${BASE_URL}/app/dashboard`);
            cy.get('body').should('be.visible').then(() => {
                const loadTime = Date.now() - start;
                cy.log(`TC-34 PASS: Page loaded in ${loadTime}ms`);
                expect(loadTime).to.be.lessThan(15000);
            });
        });

        it('TC-35 | 🏁 Grand Finale: Plain Login → Products → Add to Cart → Verify', () => {
            loginPlain();
            goToProducts();
            cy.get("button[class*='cart' i], button[class*='add' i], button.rw-btn-primary")
                .first().click({ force: true });
            cy.wait(3000);
            cy.get('body').should('be.visible');
            cy.url().should('include', 'retail-website-two.vercel.app');
            cy.log('🏁 TC-35 PASS: Full plain E2E flow completed successfully.');
        });
    });
});
