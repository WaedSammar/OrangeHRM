import { ElementHandler } from "../element-handler";
import { PAGES } from "../helpers/constants";

class PIMPage {

  private static LOCATORS = {
    firstName: ".orangehrm-firstname",
    middleName: ".orangehrm-middlename",
    lastName: ".orangehrm-lastname",
    createLoginCheckbox: "input[type='checkbox']",
    inputGroup: ".oxd-input-group",
    submitBtn: "button[type='submit']",
    dateInput: "input[placeholder='yyyy-dd-mm']",
    validationMsg: ".oxd-input-group__message",
    selectField: ".oxd-select-text",
    dropdownOption: ".oxd-select-dropdown",
    selectGender: `input[type="radio"][value="1"]`,
    closeBtn: ".oxd-date-input-link.--close",
    chosenGender: `input[type="radio"]:checked`
  }

  /**
   * go to PIM Page
   */
  static goToPIMPage() {
    ElementHandler.clickMenuItem(PAGES.PIM);
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
    ElementHandler.clearAndFill("Employee Id", employeeId);
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
    ElementHandler.clearAndFill("Username", username);
  }

  /**
   * fill user password
   * @param {string} password - fill user password
   */
  static fillPassword(password: string) {
    ElementHandler.clearAndFill("Password", password);
  }

  /**
   * confirm user password
   * @param {string} password - user password again
   */
  static fillConfirmPassword(password: string) {
    ElementHandler.clearAndFill("Confirm Password", password);
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
    ElementHandler.clearAndFill("Other Id", id);
  }

  /**
   * enter driver's license number
   * @param {string} license - driver license num
   */
  static fillLicenseNum(license: string) {
    ElementHandler.findInputByLabel("Driver's License Number").type(license);
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
    cy.contains("label", label)
      .parents(this.LOCATORS.inputGroup)
      .find(this.LOCATORS.selectField)
      .click();
    cy.get(this.LOCATORS.dropdownOption)
      .contains(option)
      .click();
  }

  /**
   * select nationality
   * @param text - chosen nationality
   */
  static selectNationality(text: string) {
    this.selectDropdownByLabel("Nationality", text);
  }

  /**
   * select employee marital state
   * @param text - employee marital state
   */
  static selectMaritalStatus(text: string) {
    this.selectDropdownByLabel("Marital Status", text);
  }

  /**
   * select employee gender
   * @param gender - employee gender
   */
  static selectGender(gender: "Male" | "Female") {
    cy.contains("label", gender).click({ force: true });
  }

  /**
   * save information user entered
   * @param index - save button index
   */
  static clickSave(index: number = 0) {
    cy.get(this.LOCATORS.submitBtn).eq(index).click().contains("Save");
  }

  /**
   * select user blood type
   * @param text - blood type
   */
  static selectBloodType(text: string) {
    this.selectDropdownByLabel("Blood Type", text);
  }

  /**
   * fill test field
   * @param text - value of test field
   */
  static fillTestField(text: string) {
    ElementHandler.findInputByLabel("Test_Field").type(text);
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
    return ElementHandler.findInputByLabel("Employee Id").invoke("val");
  }

  /**
   * verify employee ID
   * @returns 
   */
  static getOtherId() {
    return ElementHandler.findInputByLabel("Other Id").invoke("val");
  }

  /**
   * verify Driver's License Number
   */
  static getLicenseNum() {
    return ElementHandler.findInputByLabel("Driver's License Number").invoke("val");
  }

  /**
   * verify License Expiry Date
   * @returns 
   */
  static getLicenseExp() {
    return ElementHandler.findInputByLabel("License Expiry Date").invoke("val");
  }

  /**
   * verify Nationality
   * @returns 
   */
  static getNationality() {
    return cy.contains("label", "Nationality")
      .parents(this.LOCATORS.inputGroup)
      .find(this.LOCATORS.selectField)
      .invoke("text");
  }

  /**
   * verify Marital Status
   */
  static getMaritalStatus() {
    return cy.contains("label", "Marital Status")
      .parents(this.LOCATORS.inputGroup)
      .find(this.LOCATORS.selectField)
      .invoke("text");
  }

  /**
   * verify employee Birthday
   */
  static getBirthday() {
    return ElementHandler.findInputByLabel("Date of Birth").invoke("val");
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
    return cy.contains("label", "Blood Type")
      .parents(this.LOCATORS.inputGroup)
      .find(this.LOCATORS.selectField)
      .invoke("text");
  }

  /**
   * verify test field
   * @returns 
   */
  static getTestField() {
    return ElementHandler.findInputByLabel("Test_Field").invoke("val");
  }

  /**
   * fill user basic information's
   * @param employeeInfo 
   */
  static fillEmployeeInfo(employeeInfo: any) {
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
  static fillPersonalDetails(employeeInfo: any) {
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
  static fillAdditionalEmployeeDetails(employeeInfo: any) {
    PIMPage.selectBloodType(employeeInfo.bloodType);
    PIMPage.fillTestField(employeeInfo.testField);
  }

  /**
   * verify employee Info
   * @param employeeInfo 
   */
  static verifyEmployeeInfo(employeeInfo: any) {
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
    const expectedGenderValue = employeeInfo.gender === "Male" ? "1" : "2";
    this.getGender().should("eq", expectedGenderValue);
    this.getBloodType().should("eq", employeeInfo.bloodType);
    this.getTestField().should("eq", employeeInfo.testField);
  }
}

export { PIMPage };