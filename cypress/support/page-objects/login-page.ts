import { COMMON_URLs } from '../helpers/apis-helpers'
import { COLORS, INPUT_TYPE } from '../helpers/constants'

enum LOGIN_PAGE_MSGS {
  INVALID_CREDENTIALS = 'Invalid credentials',
  REQUIRED_FIELD = 'Required'
}

class LoginPage {
  private static LOCATORS = {
    username: "[name='username']",
    password: "[name='password']",
    loginBtn: "[type='submit']",
    errorMsg: '.oxd-alert-content-text',
    requiredMsg: '.oxd-input-field-error-message'
  }

  static login(username: string, password: string) {
    this.fillUsernameField(username)
    this.fillPasswordField(password)
    this.clickSubmit()
  }

  static fillUsernameField(username: string) {
    cy.get(this.LOCATORS.username).clear().type(username)
  }

  static fillPasswordField(password: string) {
    cy.get(this.LOCATORS.password).clear().type(password)
  }

  static clickSubmit() {
    cy.get(this.LOCATORS.loginBtn).click()
  }

  static checkDashboardURL() {
    cy.url().should('include', COMMON_URLs.DASHBOARD)
  }

  static checkPasswordHidden() {
    cy.get(this.LOCATORS.password).should('have.attr', 'type', INPUT_TYPE.PASSWORD)
  }

  static checkErrorMessage(message: string) {
    cy.get(this.LOCATORS.errorMsg).should('contain.text', message)
  }

  static checkRequiredField(counter: number) {
    cy.get(this.LOCATORS.requiredMsg).should('have.length', counter)
  }

  static checkRequiredColor() {
    cy.get(this.LOCATORS.requiredMsg).each(($el) => {
      cy.wrap($el).should('contain.text', LOGIN_PAGE_MSGS.REQUIRED_FIELD)
      cy.wrap($el).should('have.css', 'color', COLORS.RED)
    })
  }
}
export { LoginPage, LOGIN_PAGE_MSGS }
