/// <reference types="cypress" />

const correctUsername = 'Admin';
const correctPassword = 'admin123';
const wrongUsername = 'wrongUser';
const wrongPassword = 'wrongPass';

describe('Login Page Test Cases', () => {

  beforeEach(() => {
    cy.visit('/')
  });

  it('Login Test Successfully', () => {

    cy.get("[name='username']").clear().type(correctUsername)
    cy.get("[name='password']").clear().type(correctPassword)
    cy.get("[type='submit']").click()

    cy.get("img[alt='client brand banner']")
      .should('be.visible')
      .log("Login Successfully :)")

    // cy.url().should('include', '/dashboard')
  });

  it('Sensitive Username', () => {

    cy.get("[name='username']").clear().type(correctUsername.toLocaleUpperCase())
    cy.get("[name='password']").clear().type(correctPassword)
    cy.get("[type='submit']").click()

    cy.url().should('include', '/dashboard')
  });

  it('Test wrong Password', () => {
    cy.get("[name='username']").clear().type(correctUsername)
    cy.get("[name='password']").clear().type(wrongPassword)
    cy.get("[type='submit']").click()

    cy.get('.oxd-alert-content-text').should('contain.text', 'Invalid credentials')
  });

  it('Test wrong Username', () => {
    cy.get("[name='username']").clear().type(wrongUsername)
    cy.get("[name='password']").clear().type(correctPassword)
    cy.get("[type='submit']").click()

    cy.get('.oxd-alert-content-text').should('contain.text', 'Invalid credentials')
  });

  it('Test wrong Password and Username', () => {
    cy.get("[name='username']").clear().type(wrongUsername)
    cy.get("[name='password']").clear().type(wrongPassword)
    cy.get("[type='submit']").click()

    cy.get('.oxd-alert-content-text').should('contain.text', 'Invalid credentials')
  });

  it('Test empty Username and Password', () => {
    cy.get("[type='submit']").click()

    cy.get('.oxd-input-field-error-message').should('have.length', 2)
    cy.get('.oxd-input-field-error-message').eq(0).should('contain.text', 'Required')
    cy.get('.oxd-input-field-error-message').eq(1).should('contain.text', 'Required')

  });

  it('Test empty Username with correct Password', () => {
    cy.get("[name='password']").clear().type(correctUsername)
    cy.get("[type='submit']").click()

    cy.get('.oxd-input-field-error-message').should('have.length', 1)
    cy.get(".oxd-input-field-error-message").first().should('contain.text', 'Required')
  });

  it('Test empty Username with wrong Password', () => {
    cy.get("[name='password']").clear().type(wrongPassword)
    cy.get("[type='submit']").click()

    cy.get('.oxd-input-field-error-message').should('have.length', 1)
    cy.get(".oxd-input-field-error-message").first().should('contain.text', 'Required')
  });

  it('Test empty Password with correct Username', () => {
    cy.get("[name='username']").clear().type(correctUsername)
    cy.get("[type='submit']").click()

    cy.get('.oxd-input-field-error-message').should('have.length', 1)
    cy.get(".oxd-input-field-error-message").first().should('contain.text', 'Required')
  });

  it('Test empty Password with wrong Username', () => {
    cy.get("[name='username']").clear().type(wrongUsername)
    cy.get("[type='submit']").click()

    cy.get('.oxd-input-field-error-message').should('have.length', 1)
    cy.get(".oxd-input-field-error-message").first().should('contain.text', 'Required')
  });

  it('Hidden Password', () => {
    cy.get("[name='password']").should('have.attr', 'type', 'password')
  });

});