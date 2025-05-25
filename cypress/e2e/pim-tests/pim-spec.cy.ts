import { ElementHandler } from "../../support/element-handler";
import { APIsHelper } from "../../support/helpers/apis-helpers";
import CommonHelper from "../../support/helpers/common-helper";
import { AdminPage } from "../../support/page-objects/admin-page";
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

    AdminPage.goToAdminPage();
    AdminPage.clickNationality();
    AdminPage.clickAddBtn();
    AdminPage.addNationality(employeeInfo.newNationality);
    employeeInfo.nationality = employeeInfo.newNationality;
    ElementHandler.clickSave();
    cy.wait(5000);

    AdminPage.getNationality().then((res) => {
      const added = res.body.data.find(
        (n) => n.name === employeeInfo.newNationality
      );
      employeeInfo.nationalityId = added.id;
    });
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
    ElementHandler.clickSave();
    cy.wait(5000);
    APIsHelper.waitForApiResponse(createLoadPersonalDetails);

    PIMPage.fillPersonalDetails(employeeInfo);
    ElementHandler.clickSave();
    PIMPage.fillAdditionalEmployeeDetails(employeeInfo);
    ElementHandler.clickSave(1);

    ElementHandler.logout();

    cy.login(employeeInfo.userName, employeeInfo.password);

    MyInfo.goToMyInfoPage();
    PIMPage.verifyEmployeeInfo(employeeInfo);
  });

  it("Adding a new employee via API", () => {
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

  it("Adding a new employee, upload attachment and verify it", () => {
    PIMPage.goToPIMPage();
    PIMPage.clickAddBtn();
    PIMPage.fillEmployeeInfo(employeeInfo);

    const createLoadPersonalDetailsPage = CommonHelper.generateRandomString(
      7,
      "loadPersonalDetailsPage"
    );
    APIsHelper.interceptGetEmployeeDetailsRequest(
      createLoadPersonalDetailsPage
    );
    ElementHandler.clickSave();
    APIsHelper.waitForApiResponse(createLoadPersonalDetailsPage);
    cy.wait(5000);

    PIMPage.fillPersonalDetails(employeeInfo);
    ElementHandler.clickSave();
    PIMPage.fillAdditionalEmployeeDetails(employeeInfo);
    ElementHandler.clickSave(1);
    PIMPage.uploadAttachment();
    ElementHandler.clickSave(2);

    ElementHandler.logout();

    cy.login(employeeInfo.userName, employeeInfo.password);

    MyInfo.goToMyInfoPage();
    PIMPage.downloadUploadedFile();
    PIMPage.verifyUploadedFile();
    PIMPage.verifyEmployeeInfo(employeeInfo);
  });

  afterEach(() => {
    ElementHandler.logout();
    cy.login();
    AdminPage.goToAdminPage();
    AdminPage.searchOnCreatedUsername(employeeInfo.userName);
    cy.wait(5000);
    AdminPage.deleteCreatedUsername();
    AdminPage.goToAdminPage();
    AdminPage.clickNationality();
    AdminPage.deleteNationality(employeeInfo.nationalityId);
  });
});
