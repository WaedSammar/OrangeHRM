import { COMMON_LOCATORS, ElementHandler } from '../element-handler'
import { APIsHelper } from '../helpers/apis-helpers'
import { CommonHelper } from '../helpers/common-helper'
import { COMMON_BUTTONS, PAGES } from '../helpers/constants'
import { IEmployeeInfo } from '../types/employee'

enum LABELS {
  PROJECT = 'Project',
  SUBMITTED = 'Status: Submitted',
  EMPLOYEE_NAME = 'Employee Name',
  APPROVED = 'Status: Approved'
}

enum BUTTONS {
  VIEW = 'View',
  APPROVE = 'Approve'
}

class TimeSheetPage {
  private static LOCATORS = {
    select: '.oxd-select-text-input',
    chooseOption: '.oxd-select-option',
    statusSubmitted: '.oxd-text--subtitle-2'
  }

  /**
   * go to time page
   */
  static goToTimePage() {
    ElementHandler.clickMenuItem(PAGES.TIME)
  }

  /**
   * click edit button to add new sheet
   */
  static clickEditBtn() {
    ElementHandler.clickButton(COMMON_BUTTONS.EDIT)
  }

  /**
   * select created project
   * @param {string} projectName
   */
  static selectProject(projectName: string, index: number = 0) {
    const loadProjectName = CommonHelper.generateRandomString(2, 'loadProjectName')
    APIsHelper.interceptProjectName(loadProjectName)
    ElementHandler.findInputByLabel(LABELS.PROJECT).type(projectName)
    APIsHelper.waitForApiResponse(loadProjectName)
    cy.get(COMMON_LOCATORS.autoComplete).eq(index).click()
  }

  /**
   * select created activity
   */
  static selectActivity(index: number = 1) {
    cy.get(this.LOCATORS.select).click()
    cy.get(this.LOCATORS.chooseOption).eq(index).click()
  }

  /**
   * click save button
   */
  static clickSave() {
    ElementHandler.clickSave()
  }

  /**
   * click submit button
   */
  static clickSubmitBtn() {
    ElementHandler.clickButton(COMMON_BUTTONS.SUBMIT)
  }

  /**
   * create new time sheet
   * @param {string} projectName
   */
  static createNewTimeSheet(projectName: string) {
    this.clickEditBtn()
    this.selectProject(projectName)
    this.selectActivity()
    this.clickSave()
    this.clickSubmitBtn()
  }

  /**
   * verify request status
   * @param {string} status
   */
  static verifyStatus(status: string) {
    cy.get(this.LOCATORS.statusSubmitted).should('have.text', status)
  }

  /**
   * verify time sheet request is submitted
   */
  static verifyTimeSheetSubmitted() {
    this.verifyStatus(LABELS.SUBMITTED)
  }

  /**
   * search for the employee
   * @param {string} name
   */
  static searchForEmployee(name: string, index: number = 0) {
    const loadEmployeeName = CommonHelper.generateRandomString(1, 'loadEmployeeName')
    APIsHelper.interceptEmployeeName(loadEmployeeName)
    ElementHandler.findInputByLabel(LABELS.EMPLOYEE_NAME).type(name)
    APIsHelper.waitForApiResponse(loadEmployeeName)
    cy.get(COMMON_LOCATORS.autoComplete).eq(index).click()
  }

  /**
   * click view button
   */
  static clickViewBtn() {
    ElementHandler.clickButton(BUTTONS.VIEW)
  }

  /**
   * click approve button
   */
  static clickApproveBtn() {
    ElementHandler.clickButton(BUTTONS.APPROVE)
  }

  /**
   * approve time sheet request
   * @param {IEmployeeInfo} employeeInfo
   */
  static approveTimeSheetRequest(employeeInfo: IEmployeeInfo) {
    this.searchForEmployee(`${employeeInfo.firstName} ${employeeInfo.middleName} ${employeeInfo.lastName}`)
    this.clickViewBtn()
    this.clickApproveBtn()
  }

  /**
   * verify that request approved
   */
  static verifyStatusApprove() {
    this.verifyStatus(LABELS.APPROVED)
  }
}
export { TimeSheetPage }
