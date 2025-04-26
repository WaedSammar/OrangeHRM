const dayjs = require('dayjs')

class BuzzPage {

  private static LOCATORS = {
    buzzBtn: "span.oxd-main-menu-item--name",
    postBtn: 'button',
    postPlaceHolder: `textarea[placeholder="What's on your mind?"]`,
    postBody: '.orangehrm-buzz-post-body',
    toastAlert: ".oxd-toast",
    userdropDownName: '.oxd-userdropdown-name',
    postEmpName: '.orangehrm-buzz-post-emp-name',
    postTime: '.orangehrm-buzz-post-time',
    mostLiked: '.orangehrm-post-filters-button',
    likesState: '.orangehrm-buzz-stats-row',
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

  static verifyDateAndTime() {
    const postCurrentTime = dayjs().format('YYYY-DD-MM hh:mm A');
    const postOneMinuteAgo = dayjs().subtract(1, 'minute').format('YYYY-DD-MM hh:mm A');
    cy.get(this.LOCATORS.postTime).first().invoke('text').then((text) => {
      expect([postCurrentTime, postOneMinuteAgo]).to.include(text.trim());
    })
  }

  static getMostLikedPost() {
    cy.get(this.LOCATORS.mostLiked).contains('Most Liked Posts').click();
  }

  static verifyMostLikedPost() {
    cy.get(this.LOCATORS.likesState).then((posts) => {
      let likesArr = [];
      cy.wrap(posts).each(($post) => {
        cy.wrap($post).invoke('text').then((text) => {
          const words = text.split(' ');
          const likesNum = parseInt(words[0]);
          likesArr.push(likesNum);
        })
      }).then(() => {
        const mostLikedPost = likesArr[0];
        const maxLiked = Math.max(...likesArr);
        expect(mostLikedPost).to.equal(maxLiked);
      });
    });
  }
}
export { BuzzPage };