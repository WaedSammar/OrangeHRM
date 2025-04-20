/// <reference types="cypress" />

import LoginPage from "../../support/page-objects/login-page";

describe('Login Page Test Cases', () => {

  let correctUsername, correctPassword, wrongUsername, wrongPassword;

  beforeEach(() => {
    cy.visit('/')

    cy.fixture("login-page-mock").then((loginData) => {
      correctUsername = loginData.correctUsername;
      correctPassword = loginData.correctPassword;
      wrongUsername = loginData.wrongUsername;
      wrongPassword = loginData.wrongPassword;
    })
  });

  it('Should log in Successfully with correct credentials', () => {

    LoginPage.fill_username_field(correctUsername);
    LoginPage.fill_password_field(correctPassword);
    LoginPage.click_submit();
    LoginPage.check_dashboard_url();
  });

  it('Should allow login with case-insensitive Username', () => {

    LoginPage.fill_username_field(correctUsername.toUpperCase());
    LoginPage.fill_password_field(correctPassword);
    LoginPage.click_submit();
    LoginPage.check_dashboard_url();
  });

  it('Should show error for incorrect Password', () => {

    LoginPage.fill_username_field(correctUsername);
    LoginPage.fill_password_field(wrongPassword);
    LoginPage.click_submit();
    LoginPage.check_error_message('Invalid credentials');
  });

  it('Should show error for incorrect Username', () => {

    LoginPage.fill_username_field(wrongUsername);
    LoginPage.fill_password_field(correctPassword);
    LoginPage.click_submit();
    LoginPage.check_error_message('Invalid credentials');
  });

  it('Should show error for incorrect Username and Password', () => {

    LoginPage.fill_username_field(wrongUsername);
    LoginPage.fill_password_field(wrongPassword);
    LoginPage.click_submit();
    LoginPage.check_error_message('Invalid credentials');
  });

  it('Should show validation messages for empty Username and Password', () => {

    LoginPage.click_submit();
    LoginPage.check_required_field(2);
  });

  it('Should show validation message for empty Username and correct Password', () => {

    LoginPage.fill_password_field(correctPassword);
    LoginPage.click_submit();
    LoginPage.check_required_field(1);
  });

  it('Should show validation message for empty Username and wrong Password', () => {

    LoginPage.fill_password_field(wrongPassword);
    LoginPage.click_submit();
    LoginPage.check_required_field(1);
    cy.get("[name='password']").clear().type(wrongPassword)
  });

  it('Should show validation message for empty Password and correct Username', () => {

    LoginPage.fill_username_field(correctUsername);
    LoginPage.click_submit();
    LoginPage.check_required_field(1);
  });

  it('Should show validation message for empty Password and wrong Username', () => {

    LoginPage.fill_username_field(wrongUsername);
    LoginPage.click_submit();
    LoginPage.check_required_field(1);
  });

  it('Should hide the password field content', () => {

    LoginPage.check_password_hidden();
  });

  it('Should shown red color in the Required field', () => {

    LoginPage.click_submit();
    LoginPage.check_required_color();
  });

});