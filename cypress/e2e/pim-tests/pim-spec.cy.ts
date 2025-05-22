import { ElementHandler } from "../../support/element-handler";
import { APIsHelper } from "../../support/helpers/apis-helpers";
import CommonHelper from "../../support/helpers/common-helper";
import { MyInfo } from "../../support/page-objects/my-info-page";
import { PIMPage } from "../../support/page-objects/pim-page";
import { IEmployeeInfo } from "../../support/types/employee.types";

describe("Employee management - Add and Save Test Cases", () => {
  let employeeMockData: IEmployeeInfo, employeeInfo: IEmployeeInfo;

  before(() => {
    cy.fixture("employee-page-mock").then((addEmployeeData) => {
      employeeMockData = addEmployeeData;
    });
  });

  beforeEach(() => {
    const randomNum = CommonHelper.generateRandomNumber();
    employeeInfo = {
      ...employeeMockData,
      employeeId: `${employeeMockData.employeeId}${randomNum}`,
      userName: `${employeeMockData.userName}${randomNum}`,
    };
    cy.login();
  });

  it("Adding a new employee, saving information and verifying it", () => {
    PIMPage.goToPIMPage();
    PIMPage.clickAddBtn();
    PIMPage.fillEmployeeInfo(employeeInfo);

    const createLoadPersonalDetails = CommonHelper.generateRandomString(
      7,
      "loadPersonalDetails"
    );
    APIsHelper.interceptGetEmployeeDetailsRequest(createLoadPersonalDetails);
    PIMPage.clickSave();
    APIsHelper.waitForApiResponse(createLoadPersonalDetails);

    PIMPage.fillPersonalDetails(employeeInfo);
    PIMPage.clickSave();
    PIMPage.fillAdditionalEmployeeDetails(employeeInfo);
    PIMPage.clickSave(1);

    ElementHandler.logout();

    cy.login(employeeInfo.userName, employeeInfo.password);

    MyInfo.goToMyInfoPage();
    PIMPage.verifyEmployeeInfo(employeeInfo);
  });

  it("Adding employee via API", () => {
    PIMPage.createEmployeeViaAPI(employeeInfo).then((response) => {
      const empNumber = response.body.data.empNumber;
      PIMPage.createUserViaAPI(employeeInfo, empNumber);
      PIMPage.updateEmployeeDetailsViaAPI(employeeInfo, empNumber);
      PIMPage.updateEmployeeCustomFieldsViaAPI(employeeInfo, empNumber);
    });

    ElementHandler.logout();
    cy.login(employeeInfo.userName, employeeInfo.password);
    MyInfo.goToMyInfoPage();
    PIMPage.verifyEmployeeInfo(employeeInfo);
  });
});
