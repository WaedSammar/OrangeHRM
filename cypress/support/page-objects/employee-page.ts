class PIMPage {

  private static LOCATORS = {
    menuBtn: "span.oxd-main-menu-item--name",
    AddBtn: "button",
    firstName: ".orangehrm-firstname",
    middleName: ".orangehrm-middlename",
    lastName: ".orangehrm-lastname",
    createLoginCheckbox: "input[type='checkbox']",
    inputGroup: ".oxd-input-group",
    submitBtn: "button[type='submit']",
    dateInput: "input[placeholder='yyyy-dd-mm']",
    validationMsg: ".oxd-input-group__message",
    dropDownList: ".oxd-userdropdown-name",
    selectField: ".oxd-select-text",
    dropdownOption: ".oxd-select-dropdown",
    selectGender: `input[type="radio"][value="1"]`
  }

  /**
   * go to PIM Page
   */
  static goToPIMPage() {
    cy.get(this.LOCATORS.menuBtn).contains("PIM").click();
  }

  /**
   * go to add employee
   */
  static goToAdd() {
    cy.get(this.LOCATORS.AddBtn).contains("Add").click();
  }

  /**
   * enter user first name
   * @param {string} firstName - first name
   */
  static fillFirstName(firstName: string) {
    cy.get(this.LOCATORS.firstName).type(firstName);
  }

  /**
   * enter user middle name
   * @param {string} middleName - middle name
   */
  static fillMiddleName(middleName: string) {
    cy.get(this.LOCATORS.middleName).type(middleName);
  }

  /**
   * enter user last name
   * @param {string} lastName - last name
   */
  static fillLastName(lastName: string) {
    cy.get(this.LOCATORS.lastName).type(lastName);
  }

  /**
   * get input using label
   * @param {string} labelText - label for input box
   * @returns - label user want
   */
  static findInputByLabel(labelText: string) {
    return cy.contains("label", labelText)
      .parent()
      .next()
      .find("input, select")
  }

  /**
   * write employee id
   * @param {string} employeeId - employee id
   */
  static fillEmployeeId(employeeId: string) {
    this.findInputByLabel("Employee Id").clear().type(employeeId);
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
    this.findInputByLabel("Username").clear().type(username);
  }

  /**
   * fill user password
   * @param {string} password - fill user password
   */
  static fillPassword(password: string) {
    this.findInputByLabel("Password").clear().type(password);
  }

  /**
   * confirm user password
   * @param {string} password - user password again
   */
  static fillConfirmPassword(password: string) {
    this.findInputByLabel("Confirm Password").clear().type(password);
  }

  /**
   * ensure status is enable
   */
  static verifyStatusIsEnabled() {
    cy.get(this.LOCATORS.submitBtn).should("be.enabled");
  }

  /**
   * ensure all required field are fill
   */
  static handleErrors() {
    cy.get(this.LOCATORS.validationMsg).should("have.length", 0);
  }

  /**
   * confirm going to personal details page successfully
   */
  static verifyPersonalDetailsHeaderVisible() {
    cy.contains("h6", "Personal Details").should("be.visible");
  }

  /**
   * enter another id for employee
   * @param {string} id - other employee id
   */
  static fillOtherId(id: string) {
    this.findInputByLabel("Other Id").clear().type(id);
  }

  /**
   * enter driver's license number
   * @param {string} license - driver license num
   */
  static fillLicenseNum(license: string) {
    this.findInputByLabel("Driver's License Number").type(license);
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
      .type(date)
  }

  /**
   * remove focus to remove calender
   */
  static removeFocusFromDatePicker() {
    cy.get("h6").first().click();
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
    this.selectDropdownByLabel("Marital Status", text)
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
    this.selectDropdownByLabel("Blood Type", text)
  }

  /**
   * fill test field
   * @param text - value of test field
   */
  static fillTestField(text: string) {
    this.findInputByLabel("Test_Field").type(text)
  }

  /**
   * make logout 
   */
  static logout() {
    cy.get(this.LOCATORS.dropDownList).click();
    cy.contains("Logout").click();
  }

  /**
   * go to info page
   */
  static goToInfoPage(){
    cy.get(this.LOCATORS.menuBtn).contains("My Info").click();
  }
}

export { PIMPage };