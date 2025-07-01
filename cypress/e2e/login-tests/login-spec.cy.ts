import { LoginPage, LOGIN_PAGE_MSGS } from '../../support/page-objects/login-page'

describe('Login Page Test Cases', () => {
  let correctUsername: string, correctPassword: string, wrongUsername: string, wrongPassword: string

  beforeEach(() => {
    cy.fixture('login-page-mock').then((loginData) => {
      correctUsername = loginData.correctUsername
      correctPassword = loginData.correctPassword
      wrongUsername = loginData.wrongUsername
      wrongPassword = loginData.wrongPassword
    })
  })

  it('Should log in Successfully with correct credentials', () => {
    LoginPage.fillUsernameField(correctUsername)
    LoginPage.fillPasswordField(correctPassword)
    LoginPage.clickSubmit()
    LoginPage.checkDashboardURL()
  })

  it('Should allow login with case-insensitive Username', () => {
    LoginPage.fillUsernameField(correctUsername.toUpperCase())
    LoginPage.fillPasswordField(correctPassword)
    LoginPage.clickSubmit()
    LoginPage.checkDashboardURL()
  })

  it('Should show error for incorrect Password', () => {
    LoginPage.fillUsernameField(correctUsername)
    LoginPage.fillPasswordField(wrongPassword)
    LoginPage.clickSubmit()
    LoginPage.checkErrorMessage(LOGIN_PAGE_MSGS.INVALID_CREDENTIALS)
  })

  it('Should show error for incorrect Username', () => {
    LoginPage.fillUsernameField(wrongUsername)
    LoginPage.fillPasswordField(correctPassword)
    LoginPage.clickSubmit()
    LoginPage.checkErrorMessage(LOGIN_PAGE_MSGS.INVALID_CREDENTIALS)
  })

  it('Should show error for incorrect Username and Password', () => {
    LoginPage.fillUsernameField(wrongUsername)
    LoginPage.fillPasswordField(wrongPassword)
    LoginPage.clickSubmit()
    LoginPage.checkErrorMessage(LOGIN_PAGE_MSGS.INVALID_CREDENTIALS)
  })

  it('Should show validation messages for empty Username and Password', () => {
    LoginPage.clickSubmit()
    LoginPage.checkRequiredField(2)
  })

  it('Should show validation message for empty Username and correct Password', () => {
    LoginPage.fillPasswordField(correctPassword)
    LoginPage.clickSubmit()
    LoginPage.checkRequiredField(1)
  })

  it('Should show validation message for empty Username and wrong Password', () => {
    LoginPage.fillPasswordField(wrongPassword)
    LoginPage.clickSubmit()
    LoginPage.checkRequiredField(1)
  })

  it('Should show validation message for empty Password and correct Username', () => {
    LoginPage.fillUsernameField(correctUsername)
    LoginPage.clickSubmit()
    LoginPage.checkRequiredField(1)
  })

  it('Should show validation message for empty Password and wrong Username', () => {
    LoginPage.fillUsernameField(wrongUsername)
    LoginPage.clickSubmit()
    LoginPage.checkRequiredField(1)
  })

  it('Should hide the password field content', () => {
    LoginPage.checkPasswordHidden()
  })

  it('Should shown red color in the Required field', () => {
    LoginPage.clickSubmit()
    LoginPage.checkRequiredColor()
  })
})
