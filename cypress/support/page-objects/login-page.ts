class LoginPage {

  private static LOCATORS = {
    username: "[name='username']",
    password: "[name='password']",
    loginBtn: "[type='submit']",
    errorMsg: '.oxd-alert-content-text',
    requiredMsg: ".oxd-input-field-error-message",
    logo: "img[alt='client brand banner']"
  };

  //Actions

  static fill_username_field(username: string) {
    cy.get(this.LOCATORS.username).type(username);
  }

  static fill_password_field(password: string) {
    cy.get(this.LOCATORS.password).type(password);
  }

  static click_submit() {
    cy.get(this.LOCATORS.loginBtn).click();
  }

  static check_dashboard_url() {
    cy.url().should('include', '/dashboard');
  }

  static check_password_hidden() {
    cy.get(this.LOCATORS.password).should('have.attr', 'type', 'password');
  }

  static check_error_message(message: string) {
    cy.get(this.LOCATORS.errorMsg).should('contain.text', message);
  }

  static check_required_field(counter: number) {
    cy.get(this.LOCATORS.requiredMsg).should('have.length', counter);
  }

  static check_required_color() {
    cy.get(this.LOCATORS.requiredMsg).each(($el) => {
      cy.wrap($el).should('contain.text', 'Required');
      cy.wrap($el).should('have.css', 'color', 'rgb(235, 9, 16)');
    });
  }

}
export default LoginPage;