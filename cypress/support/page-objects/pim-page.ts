import { ElementHandler } from "../element-handler";
import { APIsHelper } from "../helpers/apis-helpers";
import CommonHelper from "../helpers/common-helper";
import { HTML_TAGS, HTTP_METHODS, PAGES } from "../helpers/constants";
import { IEmployeeInfo } from "../types/employee.types";

const URLs = {
  employees: `/web/index.php/api/v2/pim/employees`,
  createUser: `/web/index.php/api/v2/admin/users`,
  personalDetails: `personal-details`,
  customField: `custom-fields`,
};

enum FILES {
  ORIGINAL_FILE = "cypress/fixtures/sheet.xlsx",
  DOWNLOADED_FILE = "cypress/downloads/sheet.xlsx",
}

enum LABELS {
  EMPLOYEE_ID = "Employee Id",
  USERNAME = "Username",
  PASSWORD = "Password",
  CONFIRM_PASSWORD = "Confirm Password",
  OTHER_ID = "Other Id",
  LICENSE_NUM = "Driver's License Number",
  LICENSE_EXP = "License Expiry Date",
  NATIONALITY = "Nationality",
  MARITAL_STATUS = "Marital Status",
  DATE_OF_BIRTH = "Date of Birth",
  BLOOD_TYPE = "Blood Type",
  TEST_FIELD = "Test_Field",
}

export enum GENDER {
  MALE = "Male",
  FEMALE = "Female",
}

const GenderMap: Record<GENDER, number> = {
  [GENDER.MALE]: 1,
  [GENDER.FEMALE]: 2,
};

enum UserRole {
  ADMIN = 1,
  ESS = 2,
}

class PIMPage {
  private static LOCATORS = {
    firstName: ".orangehrm-firstname",
    middleName: ".orangehrm-middlename",
    lastName: ".orangehrm-lastname",
    createLoginCheckbox: `${HTML_TAGS.input}[type='checkbox']`,
    inputGroup: ".oxd-input-group",
    submitBtn: `${HTML_TAGS.button}[type='submit']`,
    dateInput: `${HTML_TAGS.input}[placeholder='yyyy-dd-mm']`,
    validationMsg: ".oxd-input-group__message",
    selectField: ".oxd-select-text",
    dropdownOption: ".oxd-select-dropdown",
    selectGender: `${HTML_TAGS.input}[type="radio"][value="1"]`,
    closeBtn: ".oxd-date-input-link.--close",
    chosenGender: `${HTML_TAGS.input}[type="radio"]:checked`,
    uploadFile: `${HTML_TAGS.input}[type="file"]`,
  };

  /**
   * go to PIM Page
   */
  static goToPIMPage() {
    const loadGetEmployeesList = CommonHelper.generateRandomString(
      7,
      "loadPIM_"
    );
    APIsHelper.interceptGetEmployeesRequest(loadGetEmployeesList);
    ElementHandler.clickMenuItem(PAGES.PIM);
    APIsHelper.waitForApiResponse(loadGetEmployeesList);
  }

  /**
   * go to add employee
   */
  static clickAddBtn() {
    ElementHandler.clickButton("Add");
  }

  /**
   * enter user first name
   * @param {string} firstName - first name
   */
  static fillFirstName(firstName: string) {
    ElementHandler.typeIntoField(this.LOCATORS.firstName, firstName);
  }

  /**
   * enter user middle name
   * @param {string} middleName - middle name
   */
  static fillMiddleName(middleName: string) {
    ElementHandler.typeIntoField(this.LOCATORS.middleName, middleName);
  }

  /**
   * enter user last name
   * @param {string} lastName - last name
   */
  static fillLastName(lastName: string) {
    ElementHandler.typeIntoField(this.LOCATORS.lastName, lastName);
  }

  /**
   * write employee id
   * @param {string} employeeId - employee id
   */
  static fillEmployeeId(employeeId: string) {
    ElementHandler.clearAndFill(LABELS.EMPLOYEE_ID, employeeId);
  }

  /**
   * make login option active
   */
  static ensureLoginButtonActive() {
    cy.get(this.LOCATORS.createLoginCheckbox).check({ force: true });
  }

  /**
   * fill username
   * @param {string} username - enter username
   */
  static fillUsername(username: string) {
    ElementHandler.clearAndFill(LABELS.USERNAME, username);
  }

  /**
   * fill user password
   * @param {string} password - fill user password
   */
  static fillPassword(password: string) {
    ElementHandler.clearAndFill(LABELS.PASSWORD, password);
  }

  /**
   * confirm user password
   * @param {string} password - user password again
   */
  static fillConfirmPassword(password: string) {
    ElementHandler.clearAndFill(LABELS.CONFIRM_PASSWORD, password);
  }

  /**
   * ensure status is enable
   */
  static verifyStatusIsEnabled() {
    cy.get(this.LOCATORS.submitBtn).should("be.enabled");
  }

  /**
   * enter another id for employee
   * @param {string} id - other employee id
   */
  static fillOtherId(id: string) {
    ElementHandler.clearAndFill(LABELS.OTHER_ID, id);
  }

  /**
   * enter driver's license number
   * @param {string} license - driver license num
   */
  static fillLicenseNum(license: string) {
    ElementHandler.findInputByLabel(LABELS.LICENSE_NUM).type(license);
  }

  /**
   * select date from calender
   * @param {string} date - chosen date
   * @param {number} index - index for input field (e.g., 0 = license expiry, 1 = birthday)
   */
  static selectDate(date: string, index: number = 0) {
    cy.get(this.LOCATORS.dateInput)
      .eq(index)
      .should("be.visible")
      .clear()
      .type(date);
  }

  /**
   * remove focus to remove calender
   */
  static closeCalender() {
    cy.get(this.LOCATORS.closeBtn).should("be.visible").click();
  }

  /**
   * select option from dropdown
   * @param {string} label - label for input text
   * @param {string} option - option to select
   */
  static selectDropdownByLabel(label: string, option: string) {
    cy.contains(HTML_TAGS.label, label)
      .parents(this.LOCATORS.inputGroup)
      .find(this.LOCATORS.selectField)
      .click();
    cy.get(this.LOCATORS.dropdownOption).contains(option).click();
  }

  /**
   * select nationality
   * @param text - chosen nationality
   */
  static selectNationality(text: string) {
    this.selectDropdownByLabel(LABELS.NATIONALITY, text);
  }

  /**
   * select employee marital state
   * @param text - employee marital state
   */
  static selectMaritalStatus(text: string) {
    this.selectDropdownByLabel(LABELS.MARITAL_STATUS, text);
  }

  /**
   * select employee gender
   * @param gender - employee gender
   */
  static selectGender(gender: GENDER) {
    cy.contains(HTML_TAGS.label, gender).click({ force: true });
  }

  /**
   * select user blood type
   * @param text - blood type
   */
  static selectBloodType(text: string) {
    this.selectDropdownByLabel(LABELS.BLOOD_TYPE, text);
  }

  /**
   * fill test field
   * @param text - value of test field
   */
  static fillTestField(text: string) {
    ElementHandler.findInputByLabel(LABELS.TEST_FIELD).type(text);
  }

  /**
   * verify first name
   */
  static getFirstName() {
    return ElementHandler.getFieldValue(this.LOCATORS.firstName);
  }

  /**
   * verify middle name
   * @returns
   */
  static getMiddleName() {
    return ElementHandler.getFieldValue(this.LOCATORS.middleName);
  }

  /**
   * verify last name
   * @returns
   */
  static getLastName() {
    return ElementHandler.getFieldValue(this.LOCATORS.lastName);
  }

  /**
   * verify employee ID
   * @returns
   */
  static getEmployeeId() {
    return ElementHandler.findInputByLabel(LABELS.EMPLOYEE_ID).invoke("val");
  }

  /**
   * verify employee ID
   * @returns
   */
  static getOtherId() {
    return ElementHandler.findInputByLabel(LABELS.OTHER_ID).invoke("val");
  }

  /**
   * verify Driver's License Number
   */
  static getLicenseNum() {
    return ElementHandler.findInputByLabel(LABELS.LICENSE_NUM).invoke("val");
  }

  /**
   * verify License Expiry Date
   * @returns
   */
  static getLicenseExp() {
    return ElementHandler.findInputByLabel(LABELS.LICENSE_EXP).invoke("val");
  }

  /**
   * verify Nationality
   * @returns
   */
  static getNationality() {
    return cy
      .contains(HTML_TAGS.label, LABELS.NATIONALITY)
      .parents(this.LOCATORS.inputGroup)
      .find(this.LOCATORS.selectField)
      .invoke(HTML_TAGS.text);
  }

  /**
   * verify Marital Status
   */
  static getMaritalStatus() {
    return cy
      .contains(HTML_TAGS.label, LABELS.MARITAL_STATUS)
      .parents(this.LOCATORS.inputGroup)
      .find(this.LOCATORS.selectField)
      .invoke(HTML_TAGS.text);
  }

  /**
   * verify employee Birthday
   */
  static getBirthday() {
    return ElementHandler.findInputByLabel(LABELS.DATE_OF_BIRTH).invoke("val");
  }

  /**
   * verify employee gender
   * @returns
   */
  static getGender() {
    return cy.get(this.LOCATORS.chosenGender).invoke("val");
  }

  /**
   *
   * @returns verify blood type
   */
  static getBloodType() {
    return cy
      .contains(HTML_TAGS.label, LABELS.BLOOD_TYPE)
      .parents(this.LOCATORS.inputGroup)
      .find(this.LOCATORS.selectField)
      .invoke(HTML_TAGS.text);
  }

  /**
   * verify test field
   * @returns
   */
  static getTestField() {
    return ElementHandler.findInputByLabel(LABELS.TEST_FIELD).invoke("val");
  }

  /**
   * upload file
   */
  static uploadAttachment() {
    this.clickAddBtn();
    cy.get(this.LOCATORS.uploadFile).selectFile("cypress/fixtures/sheet.xlsx", {
      force: true,
    });
  }

  /**
   * download file to compare
   */
  static downloadUploadedFile() {
    cy.get(".oxd-icon.bi-download").click();
  }

  /**
   * create employee basic via API
   * @param {IEmployeeInfo} employeeInfo
   * @returns - API response
   */
  static createEmployeeViaAPI(employeeInfo: IEmployeeInfo) {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.employees, {
      firstName: employeeInfo.firstName,
      middleName: employeeInfo.middleName,
      lastName: employeeInfo.lastName,
      employeeId: employeeInfo.employeeId,
    });
  }

  /**
   * add username and password for the employee
   * @param {IEmployeeInfo} employeeInfo
   * @param {number} empNumber
   */
  static createUserViaAPI(employeeInfo: IEmployeeInfo, empNumber: number) {
    CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.createUser, {
      username: employeeInfo.userName,
      password: employeeInfo.password,
      status: employeeInfo.status,
      userRoleId: UserRole.ESS,
      empNumber,
    });
  }

  /**
   * update employee personal details
   * @param {IEmployeeInfo} employeeInfo
   * @param {number} empNumber
   */
  static updateEmployeeDetailsViaAPI(
    employeeInfo: IEmployeeInfo,
    empNumber: number
  ) {
    const url = `${URLs.employees}/${empNumber}/${URLs.personalDetails}`;
    CommonHelper.sendAPIRequest(HTTP_METHODS.PUT, url, {
      firstName: employeeInfo.firstName,
      middleName: employeeInfo.middleName,
      lastName: employeeInfo.lastName,
      employeeId: employeeInfo.employeeId,
      otherId: employeeInfo.otherId,
      drivingLicenseNo: employeeInfo.licenseNum,
      drivingLicenseExpiredDate: employeeInfo.expDate,
      birthday: employeeInfo.dateOfBirth,
      gender: GenderMap[employeeInfo.gender],
      maritalStatus: employeeInfo.maritalState,
      nationalityId: 27,
    });
  }

  /**
   * update employee custom field
   * @param {IEmployeeInfo} employeeInfo
   * @param {number} empNumber
   */
  static updateEmployeeCustomFieldsViaAPI(
    employeeInfo: IEmployeeInfo,
    empNumber: number
  ) {
    const url = `${URLs.employees}/${empNumber}/${URLs.customField}`;
    CommonHelper.sendAPIRequest(HTTP_METHODS.PUT, url, {
      custom1: employeeInfo.bloodType,
      custom2: employeeInfo.testField,
    });
  }

  /**
   * fill user basic information's
   * @param employeeInfo
   */
  static fillEmployeeInfo(employeeInfo: IEmployeeInfo) {
    this.fillFirstName(employeeInfo.firstName);
    this.fillMiddleName(employeeInfo.middleName);
    this.fillLastName(employeeInfo.lastName);
    this.fillEmployeeId(employeeInfo.employeeId);

    this.ensureLoginButtonActive();
    this.fillUsername(employeeInfo.userName);
    this.fillPassword(employeeInfo.password);
    this.fillConfirmPassword(employeeInfo.password);
    this.verifyStatusIsEnabled();
  }

  /**
   * fill user personal details
   * @param employeeInfo
   */
  static fillPersonalDetails(employeeInfo: IEmployeeInfo) {
    PIMPage.fillOtherId(employeeInfo.otherId);
    PIMPage.fillLicenseNum(employeeInfo.licenseNum);
    PIMPage.selectDate(employeeInfo.expDate);
    PIMPage.closeCalender();
    PIMPage.selectNationality(employeeInfo.nationality);
    PIMPage.selectMaritalStatus(employeeInfo.maritalState);
    PIMPage.selectDate(employeeInfo.dateOfBirth, 1);
    PIMPage.selectGender(employeeInfo.gender);
  }

  /**
   * fill user additional information
   * @param employeeInfo
   */
  static fillAdditionalEmployeeDetails(employeeInfo: IEmployeeInfo) {
    PIMPage.selectBloodType(employeeInfo.bloodType);
    PIMPage.fillTestField(employeeInfo.testField);
  }

  /**
   * verify employee Info
   * @param employeeInfo
   */
  static verifyEmployeeInfo(employeeInfo: IEmployeeInfo) {
    this.getFirstName().should("eq", employeeInfo.firstName);
    this.getMiddleName().should("eq", employeeInfo.middleName);
    this.getLastName().should("eq", employeeInfo.lastName);
    this.getEmployeeId().should("eq", employeeInfo.employeeId);
    this.getOtherId().should("eq", employeeInfo.otherId);
    this.getLicenseNum().should("eq", employeeInfo.licenseNum);
    this.getLicenseExp().should("eq", employeeInfo.expDate);
    this.getBirthday().should("eq", employeeInfo.dateOfBirth);
    this.getNationality().should("eq", employeeInfo.nationality);
    this.getMaritalStatus().should("eq", employeeInfo.maritalState);
    const expectedGenderValue = employeeInfo.gender === GENDER.MALE ? "1" : "2";
    this.getGender().should("eq", expectedGenderValue);
    this.getBloodType().should("eq", employeeInfo.bloodType);
    this.getTestField().should("eq", employeeInfo.testField);
  }

  /**
   * verify that uploaded file has the same content of downloaded one
   */
  static verifyUploadedFile() {
    cy.readFile(FILES.DOWNLOADED_FILE, { timeout: 10000 }).should("exist");
    cy.task("parseXlsxToJson", { filePath: FILES.ORIGINAL_FILE }).then(
      (originalData) => {
        cy.task("parseXlsxToJson", { filePath: FILES.DOWNLOADED_FILE }).then(
          (downloadedData) => {
            expect(downloadedData).to.deep.equal(originalData);
          }
        );
      }
    );
  }
}
export { PIMPage };
