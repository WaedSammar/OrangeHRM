import { HTTP_METHOD } from "./constants";

export default class CommonHelper {
  /**
   * Generate a random string of a given length with prefix and suffix
   * @param {number} length
   * @param {string} prefix
   * @param {string} suffix
   * @returns {string}
   */
  static generate_random_string(
    length: number = 5,
    prefix: string = "",
    suffix: string = ""
  ): string {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const text = Array.from({ length }, () =>
      possible.charAt(Math.floor(Math.random() * possible.length))
    ).join("");
    return `${prefix}${text}${suffix}`;
  }

  /**
   * Intercept the requests
   * @param {string} requestURL
   * @param {HTTP_METHOD} httpRequestMethod
   * @param {string} aliasName
   */
  static interceptRequests(
    requestURL: string,
    httpRequestMethod: HTTP_METHOD,
    aliasName: string
  ) {
    return new Cypress.Promise((resolve) => {
      cy.intercept({
        url: requestURL,
        method: httpRequestMethod,
      })
        .as(aliasName)
        .then(resolve);
    });
  }
}
