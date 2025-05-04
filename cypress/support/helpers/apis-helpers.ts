import { URLs } from "../page-objects/buzz-page";
import CommonHelper from "./common-helper";
import { HTTP_METHOD, HTTP_STATUS_CODE } from "./constants";

export default class APIsHelper {
  /**
   * Intercept the posts filter request
   * @param {string} aliasName
   */
  static interceptPostsFilter(aliasName: string) {
    CommonHelper.interceptRequests(URLs.feed, HTTP_METHOD.GET, aliasName);
  }

  /**
   * Intercept post creation request
   * @param {string} aliasName
   */
  static interceptPostRequest(aliasName: string) {
    CommonHelper.interceptRequests(URLs.posts, HTTP_METHOD.POST, aliasName);
  }

  /**
   * Wait for the API response
   * @param {string} aliasName
   * @param {number} expectStatus
   */
  static waitForApiResponse(
    aliasName: string,
    expectStatus: number = HTTP_STATUS_CODE.success
  ) {
    cy.wait(`@${aliasName}`).then((interception) => {
      expect(interception.response.statusCode).to.equal(expectStatus);
    });
  }

  /**
   * Get the API response
   * @param {string} aliasName
   */
  static getInterceptionApiResponse(aliasName: string) {
    return new Cypress.Promise((resolve) => {
      cy.wait(`@${aliasName}`).then(({ response }) => {
        expect(response.statusCode).not.to.equal(HTTP_STATUS_CODE.error);
        resolve(response.body);
      });
    });
  }
}
