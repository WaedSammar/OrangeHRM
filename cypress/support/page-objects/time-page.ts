import { COMMON_LOCATORS, ElementHandler } from '../element-handler'
import { APIsHelper } from '../helpers/apis-helpers'
import { CommonHelper } from '../helpers/common-helper'
import { COMMON_BUTTONS, PAGES } from '../helpers/constants'
import { ITimeSheet } from '../types/timeSheet'

class TimeSheetPage {
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

  static selectActivity(activityName: string) {
    ElementHandler.selectDropdownByLabel('Activity', activityName)
  }

  static clickSave() {
    ElementHandler.clickSave()
  }

  static createNewTimeSheet(timeSheetData: ITimeSheet) {
    this.clickEditBtn()
    this.selectProject(timeSheetData.projectName)
    this.selectActivity(timeSheetData.activityName)
    this.clickSave()
  }
}
export { TimeSheetPage }
