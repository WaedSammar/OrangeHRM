class BuzzPage {

  private static LOCATORS = {
    buzzBtn: "span.oxd-main-menu-item--name",
    postBtn: 'button',
    postPlaceHolder: `textarea[placeholder="What's on your mind?"]`,
    postBody: '.orangehrm-buzz-post-body',
    toastAlert: ".oxd-toast",
    userdropDownName: '.oxd-userdropdown-name',
    postEmpName: '.orangehrm-buzz-post-emp-name',
  };

  static goToBuzzPage() {
    cy.get(this.LOCATORS.buzzBtn).contains("Buzz").click();
  }

  static writePost(text: string) {
    cy.get(this.LOCATORS.postPlaceHolder).type(text)
  }

  static submitPost() {
    cy.get(this.LOCATORS.postBtn).contains("Post").click()
  }

  static verifyPost(text: string) {
    cy.get(this.LOCATORS.postBody).first().should('contain.text', text);
    cy.get(this.LOCATORS.toastAlert)
      .should('be.visible')
      .and('contain.text', 'Successfully Saved');
  }

  static verifyPosterMatchesLoggedInUser() {
    cy.get(this.LOCATORS.userdropDownName).invoke('text')
      .then((currentUser) => {
        const firstName = currentUser.split(' ')[0].toLocaleUpperCase();
        cy.get(this.LOCATORS.postEmpName).first()
          .invoke('text')
          .then((posterName) => {
            expect(posterName.trim().toLocaleUpperCase())
              .to.include(firstName);
          });
      });
  }
}
export { BuzzPage };