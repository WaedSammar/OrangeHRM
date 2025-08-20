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

  static goToTimePage() {
    ElementHandler.clickMenuItem(PAGES.TIME)
  }

  static clickEditBtn() {
    ElementHandler.clickButton(COMMON_BUTTONS.EDIT)
  }

  static selectProject(projectName: string) {
    const loadProjectName = CommonHelper.generateRandomString(2, 'loadProjectName')
    APIsHelper.interceptProjectName(loadProjectName)
    ElementHandler.findInputByLabel('Project').type(projectName)
    APIsHelper.waitForApiResponse(loadProjectName)
    cy.get(COMMON_LOCATORS.autoComplete).eq(0).click()
  }

  static selectActivity() {
    cy.get(this.LOCATORS.select).click()
    cy.get(this.LOCATORS.chooseOption).eq(1).click()
  }

  static clickSave() {
    ElementHandler.clickSave()
  }

  static clickSubmitBtn() {
    ElementHandler.clickButton(COMMON_BUTTONS.SUBMIT)
  }

  static createNewTimeSheet(timeSheetData: ITimeSheet) {
    this.clickEditBtn()
    this.selectProject(timeSheetData.projectName)
    this.selectActivity()
    this.clickSave()
    this.clickSubmitBtn()
  }
}
export { TimeSheetPage }
