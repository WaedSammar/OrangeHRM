///<reference types = "cypress" />
describe('Login Page Test Cases', () => {

  beforeEach(() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
  });

  it('Login Test Successfully', () => {

    cy.get("[name='username']").type("Admin")
    cy.get("[name='password']").type("admin123")
    cy.get("[type='submit']").click()

    cy.get("img[alt='client brand banner']")
      .should('be.visible')
      .log("Login Successfully :)")

    // cy.url().should('include', '/dashboard')
  });

  it('Test wrong Password', () => {
    cy.get("[name='username']").type("Admin")
    cy.get("[name='password']").type("admin12345")
    cy.get("[type='submit']").click()

    cy.get('.oxd-alert-content-text').should('contain.text', 'Invalid credentials')
  });

  it('Test wrong Username', () => {
    cy.get("[name='username']").type("AdminAdmin")
    cy.get("[name='password']").type("admin123")
    cy.get("[type='submit']").click()

    cy.get('.oxd-alert-content-text').should('contain.text', 'Invalid credentials')
  });

  it('Test wrong Password and Username', () => {
    cy.get("[name='username']").type("AdminAdmin")
    cy.get("[name='password']").type("admin12345")
    cy.get("[type='submit']").click()

    cy.get('.oxd-alert-content-text').should('contain.text', 'Invalid credentials')
  });

  it('Test empty Username and Password', () => {
    cy.get("[type='submit']").click()

    cy.get('.oxd-input-field-error-message').should('contain.text', 'Required')
  });

  it('Test empty Username', () => {
    cy.get("[name='password']").type("admin12345")
    cy.get("[type='submit']").click()

    cy.get('.oxd-input-field-error-message').should('have.length', 1)
    cy.get(".oxd-input-field-error-message").first().should('contain.text', 'Required')
  });

  it('Test empty Password', () => {
    cy.get("[name='username']").type("Admin")
    cy.get("[type='submit']").click()
    
    cy.get('.oxd-input-field-error-message').should('have.length', 1)
    cy.get(".oxd-input-field-error-message").first().should('contain.text', 'Required')
  });

});