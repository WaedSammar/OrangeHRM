import { COMMON_LOCATORS, ElementHandler } from '../element-handler'
import { APIsHelper } from '../helpers/apis-helpers'
import { CommonHelper } from '../helpers/common-helper'
import { COMMON_BUTTONS, PAGES } from '../helpers/constants'
import { ITimeSheet } from '../types/timeSheet'

class TimeSheetPage {
  private static LOCATORS = {
    select: '.oxd-select-text-input',
    chooseOption: '.oxd-select-option'
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
  static selectProject(projectName: string) {
    const loadProjectName = CommonHelper.generateRandomString(2, 'loadProjectName')
    APIsHelper.interceptProjectName(loadProjectName)
    ElementHandler.findInputByLabel('Project').type(projectName)
    APIsHelper.waitForApiResponse(loadProjectName)
    cy.get(COMMON_LOCATORS.autoComplete).eq(0).click()
  }

  /**
   * select created activity
   */
  static selectActivity() {
    cy.get(this.LOCATORS.select).click()
    cy.get(this.LOCATORS.chooseOption).eq(1).click()
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
}
export { TimeSheetPage }
