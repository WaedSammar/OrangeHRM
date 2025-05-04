import dayjs from "dayjs";
import {
  HTML_TAGS,
  HTTP_METHOD,
  HTTP_STATUS_CODE,
  SEPARATORS,
} from "../helpers/constants";
import CommonHelper from "../helpers/common-helper";
import ElementsHandler from "../elements-handler";

const baseURL = Cypress.config().baseUrl;

export const URLs = {
  posts: `${baseURL}/web/index.php/api/v2/buzz/posts`,
  feed: `${baseURL}/web/index.php/api/v2/buzz/feed**`,
};

export enum POST_FILTER_OPTION {
  MOST_RECENT = "Most Recent Posts",
  MOST_LIKED = "Most Liked Posts",
  MOST_COMMENTED = "Most Commented Posts",
}

enum TIME_FORMATS {
  POST_TIME = "YYYY-DD-MM hh:mm A",
}

export default class BuzzPage {
  private static LOCATORS = {
    buzzBtn: "span.oxd-main-menu-item--name",
    postBtn: "button",
    postPlaceHolder: `textarea[placeholder="What's on your mind?"]`,
    postBody: ".orangehrm-buzz-post-body",
    toastAlert: ".oxd-toast",
    userdropDownName: ".oxd-userdropdown-name",
    postEmpName: ".orangehrm-buzz-post-emp-name",
    postTime: ".orangehrm-buzz-post-time",
    postFilter: ".orangehrm-post-filters-button",
    likesState: ".orangehrm-buzz-stats-row",
  };

  /**
   * Go to Buzz page
   */
  static goToBuzzPage() {
    cy.get(this.LOCATORS.buzzBtn).contains("Buzz").click();
    ElementsHandler.waitLoaderToBeHidden();
  }

  /**
   * Write post
   * @param {string} text
   */
  static writePost(text: string) {
    cy.get(this.LOCATORS.postPlaceHolder).type(text);
  }

  /**
   * Create post via API
   * @param {string} text
   */
  static createPostViaAPI(text: string) {
    return cy
      .request(HTTP_METHOD.POST, URLs.posts, {
        type: "text",
        text,
      })
      .its(HTML_TAGS.body);
  }

  /**
   * Click on post button
   */
  static submitPost() {
    cy.get(this.LOCATORS.postBtn).contains("Post").click();
  }

  /**
   * Verify the name of the employee who created the post
   * @param {object} employeeInfo
   * @param {number} postIndex
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
   * Verify the post content
   * @param {string} text
   * @param {number} postIndex
   */
  static verifyPost(text: string, postIndex: number = 0) {
    cy.get(this.LOCATORS.postBody).eq(postIndex).should("contain.text", text);
  }

  /**
   * Verify the post creation alert
   */
  static verifyPostByAlert() {
    cy.get(this.LOCATORS.toastAlert)
      .should("be.visible")
      .and("contain.text", "Successfully Saved");
  }

  /**
   * Verify the date and time of the post
   * @param {string} createdAt
   * @param {number} postIndex
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
   * Filters the posts based on the selected option
   * @param {POST_FILTER_OPTION} filterOption
   */
  static applyPostFilter(filterOption: POST_FILTER_OPTION) {
    cy.get(this.LOCATORS.postFilter).contains(filterOption).click();
  }

  /**
   * Verify the most liked posts
   */
  static verifyMostLikedPosts() {
    const likeCounts = [];

    cy.get(this.LOCATORS.likesState)
      .each(($post, index) => {
        if (index & 1) return;
        cy.wrap($post)
          .find(HTML_TAGS.p)
          .invoke(HTML_TAGS.text)
          .then((text) => {
            likeCounts.push(Number(text.split(SEPARATORS.SPACE)[0]));
          });
      })
      .then(() => {
        const sortedLikeCounts = [...likeCounts].sort((a, b) => b - a);
        expect(likeCounts).to.deep.equal(sortedLikeCounts);
      });
  }
}
