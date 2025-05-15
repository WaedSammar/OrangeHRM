import CommonHelper from "./common-helper";
import { HTTP_METHODS, HTTP_STATUS_CODE } from "./constants";

const URLs = {
  employees: `/api/v2/pim/employees`,
  personalDetails: `/pim/employees/**/personal-details`
}

class APIsHelper {

  static interceptPIMEmployee(aliasName: string) {
    CommonHelper.interceptRequests(URLs.employees, HTTP_METHODS.GET, aliasName)
  }

  static interceptEmployeePersonalDetails(aliasName: string) {
    CommonHelper.interceptRequests(URLs.personalDetails, HTTP_METHODS.GET, aliasName);
  }

  static waitForApiResponse(
    aliasName: string,
    expectedStatus: number = HTTP_STATUS_CODE.success
  ) {
    cy.wait(`@${aliasName}`).then((interception) => {
      expect(interception.response.statusCode).to.equal(expectedStatus);
    });
  }

  static getInterceptionApiResponse(aliasName: string) {
    return new Cypress.Promise((resolve) => {
      cy.wait(`@${aliasName}`).then(({ response }) => {
        expect(response.statusCode).not.to.equal(HTTP_STATUS_CODE.error);
        resolve(response.body);
      });
    });
  }
}
export default APIsHelper;