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
    dropdownOption: ".oxd-select-dropdown"
  }

  static goToPIMPage() {
    cy.get(this.LOCATORS.menuBtn).contains("PIM").click();
  }

  static goToAdd() {
    cy.get(this.LOCATORS.AddBtn).contains("Add").click();
  }

  static fillFirstName(firstName: string) {
    cy.get(this.LOCATORS.firstName).type(firstName);
  }

  static fillMiddleName(middleName: string) {
    cy.get(this.LOCATORS.middleName).type(middleName);
  }

  static fillLastName(lastName: string) {
    cy.get(this.LOCATORS.lastName).type(lastName);
  }

  static findInputByLabel(labelText: string) {
    return cy.contains("label", labelText)
      .parent()
      .next()
      .find("input, select")
  }

  static fillEmployeeId(employeeId: string) {
    this.findInputByLabel("Employee Id").clear().type(employeeId);
  }

  static ensureLoginButtonActive() {
    cy.get(this.LOCATORS.createLoginCheckbox).check({ force: true });
  }

  static fillUsername(username: string) {
    this.findInputByLabel("Username").clear().type(username);
  }

  static fillPassword(password: string) {
    this.findInputByLabel("Password").clear().type(password);
  }

  static fillConfirmPassword(password: string) {
    this.findInputByLabel("Confirm Password").clear().type(password);
  }

  static verifyStatusIsEnabled() {
    cy.get(this.LOCATORS.submitBtn).should("be.enabled");
  }

  static handleErrors() {
    cy.get(this.LOCATORS.validationMsg).should("have.length", 0);
  }

  static verifyPersonalDetailsHeaderVisible() {
    cy.contains("h6", "Personal Details").should("be.visible");
  }

  static fillOtherId(id: string) {
    this.findInputByLabel("Other Id").clear().type(id);
  }

  static fillLicenseNum(license: string) {
    this.findInputByLabel("Driver's License Number").type(license);
  }

  static selectDate(date: string, index: number = 0) {
    cy.get(this.LOCATORS.dateInput)
      .eq(index)
      .should("be.visible")
      .clear()
      .type(date)
  }

  static removeFocusFromDatePicker() {
    cy.get("h6").first().click();
  }

  static selectDropdownByLabel(label: string, option: string) {
    cy.contains("label", label)
      .parents(this.LOCATORS.inputGroup)
      .find(this.LOCATORS.selectField)
      .click();
    cy.get(this.LOCATORS.dropdownOption)
      .contains(option)
      .click();
  }

  static selectNationality(text: string) {
    this.selectDropdownByLabel("Nationality", text);
  }

  static selectMaritalStatus(text: string) {
    this.selectDropdownByLabel("Marital Status", text)
  }

  static selectGender(gender: "Male" | "Female") {
    cy.contains("label", gender)
      .parent()
      .click();
  }

  static clickSave(index: number = 0) {
    cy.get(this.LOCATORS.submitBtn).eq(index).click().contains("Save");
  }

  static selectBloodType(text: string) {
    this.selectDropdownByLabel("Blood Type", text)
  }

  static fillTestField(text: string) {
    this.findInputByLabel("Test_Field").type(text)
  }

  static logout() {
    cy.get(this.LOCATORS.dropDownList).click();
    cy.contains("Logout").click();
  }

  static goToInfoPage(){
    cy.get(this.LOCATORS.menuBtn).contains("My Info").click();
  }
}

export { PIMPage };