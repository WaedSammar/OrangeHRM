import dayjs from 'dayjs';
import { HTML_TAGS, HTTP_METHODS } from '../helpers/constants';

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
    buzzBtn: 'span.oxd-main-menu-item--name',
    postBtn: 'button',
    postPlaceHolder: `textarea[placeholder="What's on your mind?"]`,
    postBody: '.orangehrm-buzz-post-body',
    toastAlert: '.oxd-toast',
    userdropDownName: '.oxd-userdropdown-name',
    postEmpName: '.orangehrm-buzz-post-emp-name',
    postTime: '.orangehrm-buzz-post-time',
    postFilter: '.orangehrm-post-filters-button',
    likesState: '.orangehrm-buzz-stats-row'
  };

  /**
   * Navigates to the Buzz page by clicking the Buzz button.
   * @param
   */
  static goToBuzzPage() {
    cy.get(this.LOCATORS.buzzBtn).contains("Buzz").click();
  }

  /**
   * Writes a post by typing the provided text into the post input field.
   * @param {string} text - The text content to post
   */
  static writePost(text: string) {
    cy.get(this.LOCATORS.postPlaceHolder).type(text)
  }

  /**
   * Creates a post by sending a POST request to the API with the given text content
   * @param {string} text - The text content of the post
   */
  static createPostViaAPI(text: string) {
    return cy
      .request(
        HTTP_METHODS.POST,
        URLs.posts,
        {
          type: "text",
          text,
        }
      ).as(HTML_TAGS.body)
  }

  /**
   * Intercepts the POST request to create a post and assigns an alias
   * @param {string} aliasName - The alias to assign to the intercepted request
   */
  static interceptPostRequest(aliasName: string) {
    cy.intercept({
      method: HTTP_METHODS.POST,
      url: URLs.posts,
    }).as(aliasName);
  }

  /**
   * Clicks the "Post" button to submit a post
   */
  static submitPost() {
    cy.get(this.LOCATORS.postBtn).contains("Post").click()
  }

  /**
   * Waits for the post request to complete and asserts a successful (200) status code
   */
  static waitForSucceedPost(aliasName: string) {
    return new Cypress.Promise((resolve) => {
      cy.wait(`@${aliasName}`).then((response) => {
        expect(response.response.statusCode).to.eq(200);
        resolve(response);
      });
    });
  }

  /**
   * Verifies that the name of the post's author matches the name in the response body
   * @param {string} aliasName - The alias of the intercepted POST request
   * @param {number} [postIndex] - The index of the post to verify 
   */
  static verifyPosterName(aliasName: string, postIndex: number = 0) {
    cy.wait(`@${aliasName}`).then((response) => {
      const { firstName, middleName, lastName } = response.response.body.data.employee;
      const fullName = `${firstName} ${middleName} ${lastName}`.trim();

      cy.get(this.LOCATORS.postEmpName)
        .eq(postIndex)
        .invoke(HTML_TAGS.text)
        .should("eq", fullName);
    })
  }

  /**
   * Verifies that the post content matches the expected text
   * @param {string} text - The expected post content
   * @param {number} [postIndex] - The index of the post to verify
   */
  static verifyPost(text: string, postIndex: number = 0) {
    cy.get(this.LOCATORS.postBody).eq(postIndex).should('contain.text', text);
  }

  /**
   * Verifies that a visible toast alert contains the expected message
   * @param {string} message - The expected text content of the alert
   */
  static verifyToastAlert(message: string) {
    cy.get(this.LOCATORS.toastAlert)
      .should('be.visible')
      .and('contain.text', message);
  }

  /**
   * Verifies that the post timestamp is either the current time or one minute ago
   * @param {number} [postIndex] - The index of the post to verify
   */
  static verifyDateAndTime(createdAt?: string, postIndex: number = 0) {
    const postCurrentTime = dayjs(createdAt).format('YYYY-DD-MM hh:mm A');
    const postOneMinuteAgo = dayjs(createdAt).subtract(1, 'minute').format('YYYY-DD-MM hh:mm A');

    cy.get(this.LOCATORS.postTime)
      .eq(postIndex)
      .invoke(HTML_TAGS.text)
      .then((text) => {
        expect([postCurrentTime, postOneMinuteAgo]).to.include(text.trim());
      })
  }

  /**
   * Applies a filter to the posts based on the given option
   * @param {POST_FILTER_OPTION} filterOption - The filter to apply
   */
  static applyPostFilter(filterOption: POST_FILTER_OPTION) {
    cy.get(this.LOCATORS.postFilter).contains(filterOption).click();
  }

  /**
   * Verifies that the top post displayed has the highest number of likes
   */
  static verifyMostLikedPost() {
    cy.get(this.LOCATORS.likesState).then((posts) => {
      let max = Number.NEGATIVE_INFINITY;
      cy.wrap(posts).each(($post) => {
        cy.wrap($post).invoke(HTML_TAGS.text).then((text) => {
          const words = text.split(" ");
          const likesNum = parseInt(words[0]);
          if (likesNum > max) {
            max = likesNum;
          }
          const mostLikedPost = parseInt(posts[0].innerText.split(" ")[0]);
          expect(mostLikedPost).to.equal(max);
        })
      })
    })
  }

}
export { BuzzPage, POST_FILTER_OPTION };