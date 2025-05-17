import { ElementHandler } from "../../support/element-handler";
import APIsHelper from "../../support/helpers/apis-helpers";
import CommonHelper from "../../support/helpers/common-helper";
import { MyInfo } from "../../support/page-objects/my-info-page";
import { PIMPage } from "../../support/page-objects/pim-page";

describe("Employee management - Add and Save Test Cases", () => {

  let employeeMockData, employeeInfo;

  before(() => {
    cy.fixture("employee-page-mock").then((addEmployeeData) => {
      employeeMockData = addEmployeeData;
    });
    cy.login();
  });

  beforeEach(() => {
    const randomNum = CommonHelper.generateRandomNumber();
    employeeInfo = {
      ...employeeMockData,
      employeeId: `${employeeMockData.employeeId}${randomNum}`,
      userName: `${employeeMockData.userName}${randomNum}`
    };
  });

  it("Adding a new employee, saving information and verifying it", () => {

    const createLoadPIM = CommonHelper.generate_random_string(
      7,
      "loadPIM_"
    );
    APIsHelper.interceptPIMEmployee(createLoadPIM);
    PIMPage.goToPIMPage();
    APIsHelper.waitForApiResponse(createLoadPIM);
    PIMPage.clickAddBtn();

    PIMPage.fillEmployeeInfo(employeeInfo);

    const createLoadPersonalDetails = CommonHelper.generate_random_string(
      7,
      "loadPersonalDetails"
    );
    APIsHelper.interceptEmployeePersonalDetails(createLoadPersonalDetails);
    PIMPage.clickSave();
    APIsHelper.waitForApiResponse(createLoadPersonalDetails);

    PIMPage.fillPersonalDetails(employeeInfo);
    PIMPage.clickSave();
    PIMPage.fillAdditionalEmployeeDetails(employeeInfo);
    PIMPage.clickSave(1);

    ElementHandler.logout();

    cy.login(employeeInfo.userName, employeeInfo.password);

    const verifyEmployeeInfo = CommonHelper.generate_random_string(
      7,
      "employeeInfo"
    );
    APIsHelper.interceptEmployeePersonalDetails(verifyEmployeeInfo);
  
    MyInfo.goToMyInfoPage();
    PIMPage.verifyEmployeeInfo(employeeInfo);
  });
})
