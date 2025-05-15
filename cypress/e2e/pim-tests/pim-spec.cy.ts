import { ElementHandler } from "../../support/element-handler";
import APIsHelper from "../../support/helpers/apis-helpers";
import CommonHelper from "../../support/helpers/common-helper";
import { LoginPage } from "../../support/page-objects/login-page";
import { MyInfo } from "../../support/page-objects/my-info-page";
import { PIMPage } from "../../support/page-objects/pim-page";

describe("Employee management - Add and Save Test Cases", () => {

  let employeeMockData, employeeInfo, adminName, adminPass;

  before(() => {
    cy.fixture("employee-page-mock").then((addEmployeeData) => {
      employeeMockData = addEmployeeData;
    });
    cy.fixture("login-page-mock").then((loginData) => {
      adminName = loginData.correctUsername;
      adminPass = loginData.correctPassword;
    });
  });

  beforeEach(() => {
    employeeInfo = {
      employeeMockData,
      employeeId: `${employeeMockData.employeeId}${CommonHelper.generateRandomNumber}`,
      userName: `${employeeMockData.userName}${CommonHelper.generateRandomNumber}`,
    };

  });

  it("Verify adding new employee", () => {
    LoginPage.login(adminName, adminPass);
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

    LoginPage.login(employeeInfo.userName, employeeInfo.password);

    const verifyEmployeeInfo = CommonHelper.generate_random_string(
      7,
      "employeeInfo"
    );
    APIsHelper.interceptEmployeePersonalDetails(verifyEmployeeInfo);
    MyInfo.goToMyInfoPage();

    APIsHelper.getInterceptionApiResponse(verifyEmployeeInfo)
      .then(
        (response: any) => {
          const data = response.data;
          expect(data.firstName).to.equal(employeeInfo.firstName);
          expect(data.middleName).to.equal(employeeInfo.middleName);
          expect(data.lastName).to.equal(employeeInfo.lastName);
          expect(data.employeeId).to.equal(employeeInfo.employeeId);
          expect(data.otherId).to.equal(employeeInfo.otherId);
          expect(data.drivingLicenseNo).to.equal(employeeInfo.licenseNum);
          expect(data.drivingLicenseExpiredDate).to.equal(employeeInfo.expDate);
          expect(data.nationality.name).to.equal(employeeInfo.nationality);
          expect(data.maritalStatus).to.equal(employeeInfo.maritalState);
          expect(data.birthday).to.equal(employeeInfo.dateOfBirth);
          const genderValue = employeeInfo.gender === "Male" ? 1 : 2;
          expect(data.gender).to.equal(genderValue);
        }
      )
  });

})