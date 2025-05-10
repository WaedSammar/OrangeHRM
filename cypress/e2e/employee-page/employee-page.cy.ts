import APIsHelper from "../../support/helpers/apis-helpers";
import CommonHelper from "../../support/helpers/common-helper";
import { PIMPage } from "../../support/page-objects/employee-page";
import { LoginPage } from "../../support/page-objects/login-page";

describe("Employee management - Add and Save Test Cases", () => {

  let adminName, adminPass, firstName, middleName, lastName, employeeId, userName, password,
    otherId, licenseNum, expDate, nationality, maritalState, dateOfBirth, gender, bloodType,
    testField;

  beforeEach(() => {

    cy.fixture("employee-page-mock").then((addEmployeeData) => {
      const randomId = Math.floor(Math.random() * 10000);

      firstName = addEmployeeData.firstName;
      middleName = addEmployeeData.middleName;
      lastName = addEmployeeData.lastName;
      employeeId = `${addEmployeeData.employeeId}${randomId}`;
      userName = `${addEmployeeData.userName}${randomId}`;
      password = addEmployeeData.password;
      otherId = addEmployeeData.otherId;
      licenseNum = addEmployeeData.licenseNum;
      expDate = addEmployeeData.expDate;
      nationality = addEmployeeData.nationality;
      maritalState = addEmployeeData.maritalState;
      dateOfBirth = addEmployeeData.dateOfBirth;
      gender = addEmployeeData.gender;
      bloodType = addEmployeeData.bloodType;
      testField = addEmployeeData.testField;
    })
    cy.fixture("login-page-mock").then((loginData) => {
      adminName = loginData.correctUsername;
      adminPass = loginData.correctPassword;
    })
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
    PIMPage.goToAdd();

    const createLoadPersonalDetails = CommonHelper.generate_random_string(
      7,
      "loadPersonalDetails"
    );

    APIsHelper.interceptPIMPersonal(createLoadPersonalDetails);

    PIMPage.fillFirstName(firstName);
    PIMPage.fillMiddleName(middleName);
    PIMPage.fillLastName(lastName);
    PIMPage.fillEmployeeId(employeeId);

    PIMPage.ensureLoginButtonActive();
    PIMPage.fillUsername(userName);
    PIMPage.fillPassword(password);
    PIMPage.fillConfirmPassword(password);

    PIMPage.verifyStatusIsEnabled();
    PIMPage.handleErrors();
    PIMPage.clickSave();

    APIsHelper.waitForApiResponse(createLoadPersonalDetails);
    PIMPage.verifyPersonalDetailsHeaderVisible();

    PIMPage.fillOtherId(otherId);
    PIMPage.fillLicenseNum(licenseNum);
    PIMPage.selectDate(expDate, 0);
    PIMPage.removeFocusFromDatePicker();
    PIMPage.selectNationality(nationality);
    PIMPage.selectMaritalStatus(maritalState);
    PIMPage.selectDate(dateOfBirth, 1);
    PIMPage.selectGender(gender);
    PIMPage.clickSave();

    PIMPage.selectBloodType(bloodType);
    PIMPage.fillTestField(testField);
    PIMPage.clickSave(1);

    Cypress.env("employeeUsername", userName);
    Cypress.env("employeePassword", password);

    PIMPage.logout();
  });

  it("Logout and re-login using prev information", () => {
    const employeeUsername = Cypress.env("employeeUsername");
    const employeePassword = Cypress.env("employeePassword");

    LoginPage.login(employeeUsername, employeePassword);

    const verifyEmployeeInfo = CommonHelper.generate_random_string(
      7,
      "employeeInfo"
    );
    APIsHelper.interceptEmployeePersonalDetails(verifyEmployeeInfo);
    PIMPage.goToInfoPage();

    APIsHelper.getInterceptionApiResponse(verifyEmployeeInfo)
      .then(
        (data: any) => {
          expect(data.firstName).to.equal(firstName);
          expect(data.middleName).to.equal(middleName);
          expect(data.lastName).to.equal(lastName);
          expect(data.employeeId).to.equal(employeeId);
          expect(data.otherId).to.equal(otherId);
          expect(data.drivingLicenseNo).to.equal(licenseNum);
          expect(data.drivingLicenseExpiredDate).to.include(expDate);
          expect(data.nationality).to.equal(nationality);
          expect(data.maritalStatus).to.equal(maritalState.toUpperCase());
          expect(data.birthday).to.include(dateOfBirth);
          expect(data.gender).to.equal(gender.toUpperCase());
          expect(data.bloodType).to.equal(bloodType);
          expect(data.custom1).to.equal(testField);
        }
      )
  });

})