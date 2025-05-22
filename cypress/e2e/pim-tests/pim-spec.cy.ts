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
    cy.login();
  });

  beforeEach(() => {
    const randomNum = CommonHelper.generateRandomNumber();
    employeeInfo = {
      ...employeeMockData,
      employeeId: `${employeeMockData.employeeId}${randomNum}`,
      userName: `${employeeMockData.userName}${randomNum}`,
    };
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
    cy.request({
      method: "POST",
      url: `/web/index.php/api/v2/pim/employees`,
      body: {
        firstName: employeeInfo.firstName,
        middleName: employeeInfo.middleName,
        lastName: employeeInfo.lastName,
        employeeId: employeeInfo.employeeId,
      },
    }).then((response) => {
      cy.log(response.body);
      expect(response.status).to.eq(200);
      const empNumber = response.body.data.empNumber;

      cy.request({
        method: "POST",
        url: `/web/index.php/api/v2/admin/users`,
        body: {
          username: employeeInfo.userName,
          password: employeeInfo.password,
          status: true,
          userRoleId: 2,
          empNumber: empNumber,
        },
      }).then((response) => {
        cy.log(response.body);
        expect(response.status).to.eq(200);
      });

      cy.request({
        method: "PUT",
        url: `/web/index.php/api/v2/pim/employees/${empNumber}/personal-details`,
        body: {
          firstName: employeeInfo.firstName,
          middleName: employeeInfo.middleName,
          lastName: employeeInfo.lastName,
          employeeId: employeeInfo.employeeId,
          otherId: employeeInfo.otherId,
          drivingLicenseNo: employeeInfo.licenseNum,
          drivingLicenseExpiredDate: employeeInfo.expDate,
          birthday: employeeInfo.dateOfBirth,
          gender: 1,
          maritalStatus: employeeInfo.maritalState,
          nationalityId: 27,
        },
      }).then((response) => {
        cy.log(response.body);
        expect(response.status).to.eq(200);
      });

      cy.request({
        method: "PUT",
        url: `/web/index.php/api/v2/pim/employees/${empNumber}/custom-fields`,
        body: {
          custom1: employeeInfo.bloodType,
          custom2: employeeInfo.testField,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
      });

      ElementHandler.logout();
      cy.login(employeeInfo.userName, employeeInfo.password);
      MyInfo.goToMyInfoPage();
      PIMPage.verifyEmployeeInfo(employeeInfo);
    });
  });
});
