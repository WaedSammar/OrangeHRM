import { COMMON_LOCATORS, ElementHandler } from '../element-handler'
import { APIsHelper } from '../helpers/apis-helpers'
import { CommonHelper } from '../helpers/common-helper'
import { COMMON_BUTTONS, CYPRESS_FOLDERS, HTML_TAGS, PAGES, TIMEOUT } from '../helpers/constants'
import { GenderMap } from '../initializers/pim-page/pim-page-initializer'
import { IEmployeeInfo } from '../types/employee.types'

enum LABELS {
  EMPLOYEE_ID = 'Employee Id',
  USERNAME = 'Username',
  PASSWORD = 'Password',
  CONFIRM_PASSWORD = 'Confirm Password',
  OTHER_ID = 'Other Id',
  LICENSE_NUM = "Driver's License Number",
  LICENSE_EXP = 'License Expiry Date',
  NATIONALITY = 'Nationality',
  MARITAL_STATUS = 'Marital Status',
  DATE_OF_BIRTH = 'Date of Birth',
  BLOOD_TYPE = 'Blood Type',
  TEST_FIELD = 'Test_Field'
}

enum GENDER {
  MALE = 'Male',
  FEMALE = 'Female'
}

enum PIM_TABLE_HEADERS {
  ID = 'Id',
  FIRST_AND_MIDDLE_NAME = 'First (& Middle) Name',
  LAST_NAME = 'Last Name',
  JOB_TITLE = 'Job Title'
}

export enum BLOOD_TYPE {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-'
}

export enum MARITAL_STATUS {
  SINGLE = 'Single',
  MARRIED = 'Married',
  DIVORCED = 'Divorced',
  WIDOWED = 'Widowed'
}

class PIMPage {
  private static LOCATORS = {
    firstName: '.orangehrm-firstname',
    middleName: '.orangehrm-middlename',
    lastName: '.orangehrm-lastname',
    createLoginCheckbox: `${HTML_TAGS.input}[type='checkbox']`,
    inputGroup: '.oxd-input-group',
    submitBtn: `${HTML_TAGS.button}[type='submit']`,
    dateInput: `${HTML_TAGS.input}[placeholder='yyyy-dd-mm']`,
    validationMsg: '.oxd-input-group__message',
    selectField: '.oxd-select-text',
    dropdownOption: '.oxd-select-dropdown',
    selectGender: `${HTML_TAGS.input}[type="radio"][value="1"]`,
    chosenGender: `${HTML_TAGS.input}[type="radio"]:checked`,
    uploadFile: `${HTML_TAGS.input}[type="file"]`,
    tableBody: '.oxd-table-body'
  }

  /**
   * go to PIM Page
   */
  static goToPIMPage() {
    const loadGetEmployeesList = CommonHelper.generateRandomString(7, 'loadPIM_')
    APIsHelper.interceptGetEmployeesRequest(loadGetEmployeesList)
    ElementHandler.clickMenuItem(PAGES.PIM)
    APIsHelper.waitForApiResponse(loadGetEmployeesList)
  }

  /**
   * go to add employee
   */
  static clickAddBtn() {
    ElementHandler.clickButton(COMMON_BUTTONS.ADD)
  }

  /**
   * enter user first name
   * @param {string} firstName - first name
   */
  static fillFirstName(firstName: string) {
    ElementHandler.typeIntoField(this.LOCATORS.firstName, firstName)
  }

  /**
   * enter user middle name
   * @param {string} middleName - middle name
   */
  static fillMiddleName(middleName: string) {
    ElementHandler.typeIntoField(this.LOCATORS.middleName, middleName)
  }

  /**
   * enter user last name
   * @param {string} lastName - last name
   */
  static fillLastName(lastName: string) {
    ElementHandler.typeIntoField(this.LOCATORS.lastName, lastName)
  }

  /**
   * write employee id
   * @param {string} employeeId - employee id
   */
  static fillEmployeeId(employeeId: string) {
    ElementHandler.clearAndFill(LABELS.EMPLOYEE_ID, employeeId)
  }

  /**
   * make login option active
   */
  static ensureLoginButtonActive() {
    cy.get(this.LOCATORS.createLoginCheckbox).check({ force: true })
  }

  /**
   * fill username
   * @param {string} username - enter username
   */
  static fillUsername(username: string) {
    ElementHandler.clearAndFill(LABELS.USERNAME, username)
  }

  /**
   * fill user password
   * @param {string} password - fill user password
   */
  static fillPassword(password: string) {
    ElementHandler.clearAndFill(LABELS.PASSWORD, password)
  }

  /**
   * confirm user password
   * @param {string} password - user password again
   */
  static fillConfirmPassword(password: string) {
    ElementHandler.clearAndFill(LABELS.CONFIRM_PASSWORD, password)
  }

  /**
   * save button
   * @param index
   */
  static clickSave(index: number = 0, buttonText: string = COMMON_BUTTONS.SAVE) {
    ElementHandler.clickSave(index, buttonText)
  }

  /**
   * ensure status is enable
   */
  static verifyStatusIsEnabled() {
    cy.get(this.LOCATORS.submitBtn).should('be.enabled')
  }

  /**
   * enter another id for employee
   * @param {string} id - other employee id
   */
  static fillOtherId(id: string) {
    ElementHandler.clearAndFill(LABELS.OTHER_ID, id)
  }

  /**
   * enter driver's license number
   * @param {string} license - driver license num
   */
  static fillLicenseNum(license: string) {
    ElementHandler.findInputByLabel(LABELS.LICENSE_NUM).type(license)
  }

  /**
   * select date from calender
   * @param {string} date - chosen date
   * @param {number} index - index for input field
   */
  static selectDate(date: string, index: number = 0) {
    ElementHandler.selectDate(date, index)
  }

  /**
   * select nationality
   * @param text - chosen nationality
   */
  static selectNationality(text: string) {
    ElementHandler.selectDropdownByLabel(LABELS.NATIONALITY, text)
  }

  /**
   * select employee marital state
   * @param text - employee marital state
   */
  static selectMaritalStatus(text: string) {
    ElementHandler.selectDropdownByLabel(LABELS.MARITAL_STATUS, text)
  }

  /**
   * select employee gender
   * @param gender - employee gender
   */
  static selectGender(gender: GENDER) {
    cy.contains(HTML_TAGS.label, gender).click({ force: true })
  }

  /**
   * select user blood type
   * @param text - blood type
   */
  static selectBloodType(text: string) {
    ElementHandler.selectDropdownByLabel(LABELS.BLOOD_TYPE, text)
  }

  /**
   * fill test field
   * @param text - value of test field
   */
  static fillTestField(text: string) {
    ElementHandler.findInputByLabel(LABELS.TEST_FIELD).type(text)
  }

  /**
   * verify first name
   */
  static getFirstName() {
    return ElementHandler.getFieldValue(this.LOCATORS.firstName)
  }

  /**
   * verify middle name
   * @returns
   */
  static getMiddleName() {
    return ElementHandler.getFieldValue(this.LOCATORS.middleName)
  }

  /**
   * verify last name
   * @returns
   */
  static getLastName() {
    return ElementHandler.getFieldValue(this.LOCATORS.lastName)
  }

  /**
   * verify employee ID
   * @returns
   */
  static getEmployeeId() {
    return ElementHandler.findInputByLabel(LABELS.EMPLOYEE_ID).invoke('val')
  }

  /**
   * verify employee ID
   * @returns
   */
  static getOtherId() {
    return ElementHandler.findInputByLabel(LABELS.OTHER_ID).invoke('val')
  }

  /**
   * verify Driver's License Number
   */
  static getLicenseNum() {
    return ElementHandler.findInputByLabel(LABELS.LICENSE_NUM).invoke('val')
  }

  /**
   * verify License Expiry Date
   * @returns
   */
  static getLicenseExp() {
    return ElementHandler.findInputByLabel(LABELS.LICENSE_EXP).invoke('val')
  }

  /**
   * verify Nationality
   * @returns
   */
  static getNationality() {
    return ElementHandler.getDropdownValueByLabel(LABELS.NATIONALITY)
  }

  /**
   * verify Marital Status
   */
  static getMaritalStatus() {
    return ElementHandler.getDropdownValueByLabel(LABELS.MARITAL_STATUS)
  }

  /**
   * verify employee Birthday
   */
  static getBirthday() {
    return ElementHandler.findInputByLabel(LABELS.DATE_OF_BIRTH).invoke('val')
  }

  /**
   * verify employee gender
   * @returns
   */
  static getGender() {
    return cy.get(this.LOCATORS.chosenGender).invoke('val')
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
      .invoke(HTML_TAGS.text)
  }

  /**
   * verify test field
   * @returns
   */
  static getTestField() {
    return ElementHandler.findInputByLabel(LABELS.TEST_FIELD).invoke('val')
  }

  /**
   * upload file
   */
  static uploadAttachment(file: string = 'sheet.xlsx') {
    this.clickAddBtn()
    cy.get(this.LOCATORS.uploadFile).selectFile(`${CYPRESS_FOLDERS.FIXTURES}/${file}`, {
      force: true
    })
  }

  /**
   * download file to compare
   */
  static downloadUploadedFile(index: number = 0) {
    cy.get(COMMON_LOCATORS.downloadIcon).eq(index).click()
  }

  /**
   * fill user basic information's
   * @param employeeInfo
   */
  static fillEmployeeInfo(employeeInfo: IEmployeeInfo) {
    this.fillFirstName(employeeInfo.firstName)
    this.fillMiddleName(employeeInfo.middleName)
    this.fillLastName(employeeInfo.lastName)
    this.fillEmployeeId(employeeInfo.employeeId)

    this.ensureLoginButtonActive()
    this.fillUsername(employeeInfo.userName)
    this.fillPassword(employeeInfo.password)
    this.fillConfirmPassword(employeeInfo.password)
    this.verifyStatusIsEnabled()
  }

  /**
   * fill user personal details
   * @param employeeInfo
   */
  static fillPersonalDetails(employeeInfo: IEmployeeInfo) {
    this.fillOtherId(employeeInfo.otherId)
    this.fillLicenseNum(employeeInfo.licenseNum)
    this.selectDate(employeeInfo.expDate)
    this.selectNationality(employeeInfo.nationality)
    this.selectMaritalStatus(employeeInfo.maritalState)
    this.selectDate(employeeInfo.dateOfBirth, 1)
    this.selectGender(employeeInfo.gender)
  }

  /**
   * fill user additional information
   * @param employeeInfo
   */
  static fillAdditionalEmployeeDetails(employeeInfo: IEmployeeInfo) {
    this.selectBloodType(employeeInfo.bloodType)
    this.fillTestField(employeeInfo.testField)
  }

  /**
   * verify employee Info
   * @param employeeInfo
   */
  static verifyEmployeeInfo(employeeInfo: IEmployeeInfo) {
    this.getFirstName().should('eq', employeeInfo.firstName)
    this.getMiddleName().should('eq', employeeInfo.middleName)
    this.getLastName().should('eq', employeeInfo.lastName)
    this.getEmployeeId().should('eq', employeeInfo.employeeId)
    this.getOtherId().should('eq', employeeInfo.otherId)
    this.getLicenseNum().should('eq', employeeInfo.licenseNum)
    this.getLicenseExp().should('eq', employeeInfo.expDate)
    this.getBirthday().should('eq', employeeInfo.dateOfBirth)
    this.getNationality().should('eq', employeeInfo.nationality)
    this.getMaritalStatus().should('eq', employeeInfo.maritalState)
    const expectedGenderValue = GenderMap[employeeInfo.gender].toString()
    this.getGender().should('eq', expectedGenderValue)
    this.getBloodType().should('eq', employeeInfo.bloodType)
    this.getTestField().should('eq', employeeInfo.testField)
  }

  /**
   * verify that uploaded file has the same content of downloaded one
   */
  static verifyUploadedFile(file: string = 'sheet.xlsx') {
    cy.readFile(`${CYPRESS_FOLDERS.DOWNLOADS}/${file}`, {
      timeout: TIMEOUT.tenSec
    }).should('exist')
    cy.parseXlsxToJson(`${CYPRESS_FOLDERS.FIXTURES}/${file}`).then((originalData) => {
      cy.parseXlsxToJson(`${CYPRESS_FOLDERS.DOWNLOADS}/${file}`).then((downloadedData) => {
        expect(downloadedData).to.deep.equal(originalData)
      })
    })
  }
}
export { PIMPage, PIM_TABLE_HEADERS, GENDER }
