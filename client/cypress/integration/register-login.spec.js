describe('Scenario: A user registers an account, logs in and deactivates the account', () => {
  it('Should allow user to register, login and deactivate', () => {
    cy.visit('https://cis557-group20-project.herokuapp.com/register');

    // register
    cy.get('#inputRegistrationUsername')
      .type('E2eTestUsername');
    cy.get('#inputRegistrationEmail')
      .type('E2eTestEmail@test.com');
    cy.get('#inputRegistrationPassword0')
      .type('E2eTestPassword');
    cy.get('#inputRegistrationPassword1')
      .type('E2eTestPassword');
    cy.contains('button', 'Register')
      .click();
    cy.contains(/Successfully registered/i)
      .should('be.visible');
    cy.contains('button', 'Close')
      .click();

    // log in
    cy.url()
      .should('include', '/login');
    cy.get('#inputLoginUsername')
      .type('E2eTestUsername');
    cy.get('#inputLoginPassword')
      .type('E2eTestPassword');
    cy.contains('button', 'Login')
      .click();
    cy.contains(/Successfully logged in/i)
      .should('be.visible');
    cy.contains('button', 'Close')
      .click();
    cy.contains(/Welcome back,\W*E2eTestUsername/i)
      .should('be.visible');

    // deactivate
    cy.contains('button', 'Deactivate Account')
      .click();
    cy.contains(/Successfully deactivated/i)
      .should('be.visible');
  });
});
