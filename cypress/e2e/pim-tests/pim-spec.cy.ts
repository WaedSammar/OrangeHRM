import { ElementHandler } from "../../support/element-handler";
import { AdminPageHelpers } from "../../support/helpers/admin-page-helpers";
import { APIsHelper } from "../../support/helpers/apis-helpers";
import CommonHelper from "../../support/helpers/common-helper";
import { PIMPageHelper } from "../../support/helpers/pim-page-helper";
import { AdminPage } from "../../support/page-objects/admin-page";
import { MyInfo } from "../../support/page-objects/my-info-page";
import { PIMPage } from "../../support/page-objects/pim-page";
import { IEmployeeInfo } from "../../support/types/employee.types";

describe("Employee management - Add and Save Test Cases", () => {
  let employeeMockData: IEmployeeInfo, employeeInfo: IEmployeeInfo;

  before(() => {
    cy.fixture("employee-page-mock").then((addEmployeeData) => {
      employeeMockData = addEmployeeData;

      const randomNum = CommonHelper.generateRandomNumber();
      employeeInfo = {
        ...employeeMockData,
        employeeId: `${employeeMockData.employeeId}${randomNum}`,
        userName: `${employeeMockData.userName}${randomNum}`,
      };

      cy.login();
      AdminPage.goToAdminPage();
      AdminPage.clickNationalities();
      AdminPage.clickAddBtn();
      AdminPage.addNationality(employeeInfo.newNationality);
      employeeInfo.nationality = employeeInfo.newNationality;

      const createLoadNationality = CommonHelper.generateRandomString(
        9,
        "loadNationality"
      );
      APIsHelper.interceptNationality(createLoadNationality);
      AdminPage.clickSave();
      APIsHelper.waitForApiResponse(createLoadNationality);

      AdminPageHelpers.getNationality().then((res) => {
        const added = res.body.data.find(
          ({ name }) => name === employeeInfo.newNationality
        );
        employeeInfo.nationalityId = added.id;
      });
    });
    ElementHandler.logout();
  });

  beforeEach(() => {
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

  it("Adding a new employee via API", () => {
    PIMPageHelper.createEmployeeViaAPI(employeeInfo).then((response) => {
      const empNumber = response.body.data.empNumber;
      PIMPageHelper.createUserViaAPI(employeeInfo, empNumber);
      PIMPageHelper.updateEmployeeDetailsViaAPI(employeeInfo, empNumber);
      PIMPageHelper.updateEmployeeCustomFieldsViaAPI(employeeInfo, empNumber);
    });
    ElementHandler.logout();
    cy.login(employeeInfo.userName, employeeInfo.password);
    MyInfo.goToMyInfoPage();
    PIMPage.verifyEmployeeInfo(employeeInfo);
  });

  it.only("Adding a new employee, upload attachment and verify it", () => {
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
    PIMPage.clickSave();
    APIsHelper.waitForApiResponse(createLoadPersonalDetailsPage);

    // PIMPage.fillPersonalDetails(employeeInfo);
    // PIMPage.clickSave();
    // PIMPage.fillAdditionalEmployeeDetails(employeeInfo);
    // PIMPage.clickSave(1);
    PIMPage.uploadAttachment();
    PIMPage.clickSave(2);

    ElementHandler.logout();

    cy.login(employeeInfo.userName, employeeInfo.password);

    MyInfo.goToMyInfoPage();
    PIMPage.downloadUploadedFile();
    PIMPage.verifyUploadedFile();
    // PIMPage.verifyEmployeeInfo(employeeInfo);
  });

  afterEach(() => {
    ElementHandler.logout();
    cy.login();
    AdminPage.goToAdminPage();
    AdminPage.searchOnCreatedUsername(employeeInfo.userName);
    ElementHandler.waitLoaderToBeHidden();
    AdminPage.deleteCreatedUsername();
  });

  after(() => {
    AdminPage.clickNationalities();
    AdminPageHelpers.deleteNationality(employeeInfo.nationalityId);
  });
});
