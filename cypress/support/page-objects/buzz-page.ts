import dayjs from "dayjs";
import {
  HTML_TAGS,
  HTTP_METHODS,
  PAGES,
  SEPARATORS,
} from "../helpers/constants";
import { URLs } from "../helpers/apis-helpers";
import { ElementHandler } from "../element-handler";

enum POST_FILTER_OPTION {
  MOST_RECENT = "Most Recent Posts",
  MOST_LIKED = "Most Liked Posts",
  MOST_COMMENTED = "Most Commented Posts",
}

enum TIME_FORMATS {
  POST_TIME = "YYYY-DD-MM hh:mm A",
}

class BuzzPage {
  private static LOCATORS = {
    buzzBtn: "span.oxd-main-menu-item--name",
    postPlaceHolder: `${HTML_TAGS.textarea}[placeholder=\"What's on your mind?\"]`,
    postBody: ".orangehrm-buzz-post-body",
    toastAlert: ".oxd-toast",
    userdropDownName: ".oxd-userdropdown-name",
    postEmpName: ".orangehrm-buzz-post-emp-name",
    postTime: ".orangehrm-buzz-post-time",
    postFilter: ".orangehrm-post-filters-button",
    likesState: ".orangehrm-buzz-stats-row",
  };

  /**
   * go to to buzz page
   */
  static goToBuzzPage() {
    cy.get(this.LOCATORS.buzzBtn).contains(PAGES.BUZZ).click();
    ElementHandler.waitLoaderToBeHidden();
  }

  /**
   * writes a post
   * @param {string} text - content of post
   */
  static writePost(text: string) {
    cy.get(this.LOCATORS.postPlaceHolder).type(text);
  }

  /**
   * create post by API
   * @param text - text of post
   */
  static createPostViaAPI(text: string) {
    return cy
      .request(HTTP_METHODS.POST, URLs.posts, {
        type: HTML_TAGS.text,
        text,
      })
      .its(HTML_TAGS.body);
  }

  /**
   * submit a post
   */
  static submitPost() {
    cy.get(HTML_TAGS.button).contains("Post").click();
  }

  /**
   * verify poster name of the post
   * @param {any} employeeInfo - info for the employee
   * @param {number} [postIndex] - the index of the post
   */
  static verifyPosterName(employeeInfo: any, postIndex: number = 0) {
    const { firstName, middleName, lastName } = employeeInfo;
    const fullName = `${firstName} ${middleName} ${lastName}`.trim();

    cy.get(this.LOCATORS.postEmpName)
      .eq(postIndex)
      .invoke(HTML_TAGS.text)
      .should("eq", fullName);
  }

  /**
   * verify post content
   * @param {string} text - expected content for the post
   * @param {number} [postIndex] - index of the post
   */
  static verifyPost(text: string, postIndex: number = 0) {
    cy.get(this.LOCATORS.postBody).eq(postIndex).should("contain.text", text);
  }

  /**
   * verify successes message
   * @param {string} message - The expected text content of the alert
   */
  static verifyToastAlert(message: string) {
    cy.get(this.LOCATORS.toastAlert)
      .should("be.visible")
      .and("contain.text", message);
  }

  /**
   * verify date and time for the post
   * @param {number} [postIndex] - The index of the post to verify
   */
  static verifyDateAndTime(createdAt?: string, postIndex: number = 0) {
    const postCurrentTime = dayjs(createdAt).format(TIME_FORMATS.POST_TIME);
    const postOneMinuteAgo = dayjs(createdAt)
      .subtract(1, "minute")
      .format(TIME_FORMATS.POST_TIME);

    cy.get(this.LOCATORS.postTime)
      .eq(postIndex)
      .invoke(HTML_TAGS.text)
      .then((text) => {
        expect([postCurrentTime, postOneMinuteAgo]).to.include(text.trim());
      });
  }

  /**
   * filter posts according to filter option
   * @param {POST_FILTER_OPTION} filterOption - filter option
   */
  static applyPostFilter(filterOption: POST_FILTER_OPTION) {
    cy.get(this.LOCATORS.postFilter).contains(filterOption).click();
  }

  /**
   * verify most likes post
   */
  static verifyMostLikedPost() {
    const likesCounter = [];
    cy.get(this.LOCATORS.likesState)
      .each(($post, index) => {
        if (index & 1) return;
        cy.wrap($post)
          .find(HTML_TAGS.p)
          .invoke(HTML_TAGS.text)
          .then((text) => {
            likesCounter.push(Number(text.split(SEPARATORS.SPACE)[0]));
          });
      })
      .then(() => {
        const sortedLikesCounter = [...likesCounter].sort((a, b) => b - a);
        expect(likesCounter).to.deep.equal(sortedLikesCounter);
      });
  }
}
export { BuzzPage, POST_FILTER_OPTION };
