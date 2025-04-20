/// <reference types="cypress" />

const correctUsername = 'Admin';
const correctPassword = 'admin123';
const wrongUsername = 'wrongUser';
const wrongPassword = 'wrongPass';

describe('Login Page Test Cases', () => {

  beforeEach(() => {
    cy.visit('/')
  });

  it('Should log in Successfully with correct credentials', () => {

    cy.get("[name='username']").clear().type(correctUsername)
    cy.get("[name='password']").clear().type(correctPassword)
    cy.get("[type='submit']").click()

    cy.get("img[alt='client brand banner']")
      .should('be.visible')
      .log("Login Successfully :)")

    // cy.url().should('include', '/dashboard')
  });

  it('Should allow login with case-insensitive Username', () => {

    cy.get("[name='username']").clear().type(correctUsername.toLocaleUpperCase())
    cy.get("[name='password']").clear().type(correctPassword)
    cy.get("[type='submit']").click()

    cy.url().should('include', '/dashboard')
  });

  it('Should show error for incorrect Password', () => {
    cy.get("[name='username']").clear().type(correctUsername)
    cy.get("[name='password']").clear().type(wrongPassword)
    cy.get("[type='submit']").click()

    cy.get('.oxd-alert-content-text').should('contain.text', 'Invalid credentials')
  });

  it('Should show error for incorrect Username', () => {
    cy.get("[name='username']").clear().type(wrongUsername)
    cy.get("[name='password']").clear().type(correctPassword)
    cy.get("[type='submit']").click()

    cy.get('.oxd-alert-content-text').should('contain.text', 'Invalid credentials')
  });

  it('Should show error for incorrect Username and Password', () => {
    cy.get("[name='username']").clear().type(wrongUsername)
    cy.get("[name='password']").clear().type(wrongPassword)
    cy.get("[type='submit']").click()

    cy.get('.oxd-alert-content-text').should('contain.text', 'Invalid credentials')
  });

  it('Should show validation messages for empty Username and Password', () => {
    cy.get("[type='submit']").click()

    cy.get('.oxd-input-field-error-message').should('have.length', 2)
    cy.get('.oxd-input-field-error-message').eq(0).should('contain.text', 'Required')
    cy.get('.oxd-input-field-error-message').eq(1).should('contain.text', 'Required')

  });

  it('Should show validation message for empty Username and correct Password', () => {
    cy.get("[name='password']").clear().type(correctUsername)
    cy.get("[type='submit']").click()

    cy.get('.oxd-input-field-error-message').should('have.length', 1)
    cy.get(".oxd-input-field-error-message").first().should('contain.text', 'Required')
  });

  it('Should show validation message for empty Username and wrong Password', () => {
    cy.get("[name='password']").clear().type(wrongPassword)
    cy.get("[type='submit']").click()

    cy.get('.oxd-input-field-error-message').should('have.length', 1)
    cy.get(".oxd-input-field-error-message").first().should('contain.text', 'Required')
  });

  it('Should show validation message for empty Password and correct Username', () => {
    cy.get("[name='username']").clear().type(correctUsername)
    cy.get("[type='submit']").click()

    cy.get('.oxd-input-field-error-message').should('have.length', 1)
    cy.get(".oxd-input-field-error-message").first().should('contain.text', 'Required')
  });

  it('Should show validation message for empty Password and wrong Username', () => {
    cy.get("[name='username']").clear().type(wrongUsername)
    cy.get("[type='submit']").click()

    cy.get('.oxd-input-field-error-message').should('have.length', 1)
    cy.get(".oxd-input-field-error-message").first().should('contain.text', 'Required')
  });

  it('Should hide the password field content', () => {
    cy.get("[name='password']").should('have.attr', 'type', 'password')
  });

});