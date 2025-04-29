import dayjs from 'dayjs';
import { HTML_METHODS } from '../helpers/constants';

enum POST_FILTER_OPTION {
  MOST_RECENT = 'Most Recent Posts',
  MOST_LIKED = 'Most Liked Posts',
  MOST_COMMENTED = 'Most Commented Posts'
}

const baseURL = Cypress.config().baseUrl;
const URLs = {
  posts: `${baseURL}/web/index.php/api/v2/buzz/posts`
}

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
    postFilter: '.orangehrm-post-filters-button',
    likesState: '.orangehrm-buzz-stats-row'
  };

  static goToBuzzPage() {
    cy.get(this.LOCATORS.buzzBtn).contains("Buzz").click();
  }

  static writePost(text: string) {
    cy.get(this.LOCATORS.postPlaceHolder).type(text)
  }

  static createPostViaAPI(text: string) {
    cy.request(
      HTML_METHODS.POST,
      URLs.posts,
      {
        type: "text",
        text,
      }
    )
    cy.reload();
  }

  static interceptPostRequest() {
    cy.intercept({
      method: HTML_METHODS.POST,
      url: URLs.posts,
    }).as("post");
  }

  static submitPost() {
    cy.get(this.LOCATORS.postBtn).contains("Post").click()
  }

  static waitForSucceedPost() {
    cy.wait("@post").its("response.statusCode").should("eq", 200);
  }

  static verifyPosterName() {
    cy.wait("@post").then((response) => {
      const { firstName, middleName, lastName } = response.response.body.data.employee;
      const fullName = `${firstName} ${middleName} ${lastName}`.trim();
      cy.get(this.LOCATORS.postEmpName)
        .eq(0)
        .invoke("text")
        .should("eq", fullName);
    })
  }

  static verifyPost(text: string, postIndex: number = 0) {
    cy.get(this.LOCATORS.postBody).eq(postIndex).should('contain.text', text);
  }

  static verifyPostByAlert() {
    cy.get(this.LOCATORS.toastAlert)
      .should('be.visible')
      .and('contain.text', 'Successfully Saved');
  }

  static verifyDateAndTime(postIndex: number = 0) {
    const postCurrentTime = dayjs().format('YYYY-DD-MM hh:mm A');
    const postOneMinuteAgo = dayjs().subtract(1, 'minute').format('YYYY-DD-MM hh:mm A');
    cy.get(this.LOCATORS.postTime).eq(postIndex).invoke('text').then((text) => {
      expect([postCurrentTime, postOneMinuteAgo]).to.include(text.trim());
    })
  }

  static getMostLikedPost() {
    cy.get(this.LOCATORS.postFilter).contains(POST_FILTER_OPTION.MOST_LIKED).click();
  }

  static verifyMostLikedPost() {
    cy.get(this.LOCATORS.likesState).then((posts) => {
      let max = Number.NEGATIVE_INFINITY;
      cy.wrap(posts).each(($post, index) => {
        cy.wrap($post).invoke('text').then((text) => {
          const words = text.split(' ');
          const likesNum = parseInt(words[0]);
          if (likesNum > max) {
            max = likesNum;
          }
          if (index === posts.length - 1) {
            const mostLikedPost = parseInt(posts[0].innerText.split(' ')[0]);
            expect(mostLikedPost).to.equal(max);
          }
        })
      })
    })
  }
}
export { BuzzPage };