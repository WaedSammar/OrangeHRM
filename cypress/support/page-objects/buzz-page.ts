class BuzzPage {

  private static LOCATORS = {
    username: "[name='username']",
    password: "[name='password']",
    loginBtn: "[type='submit']",
    buzzBtn: "span.oxd-main-menu-item--name",
  };

  static login(username: string, password: string) {
    cy.get(this.LOCATORS.username).clear().type(username);
    cy.get(this.LOCATORS.password).clear().type(password);
    cy.get(this.LOCATORS.loginBtn).click();
  }

  static goToBuzzPage() {
    cy.get(this.LOCATORS.buzzBtn).contains("Buzz").click();
  }

  static writePost(text: string) {
    cy.get(`textarea[placeholder="What's on your mind?"]`).type(text)
    cy.get('button[type="submit"]').contains('Post').click()
  }

  static verifyPost(text: string) {
    cy.get('.orangehrm-buzz-post-body').first().should('contain.text', text);
  }
}
export { BuzzPage };