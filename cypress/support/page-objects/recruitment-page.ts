import { COMMON_LOCATORS, ElementHandler } from '../element-handler'
import { APIsHelper } from '../helpers/apis-helpers'
import CommonHelper from '../helpers/common-helper'
import { PAGES } from '../helpers/constants'
import { IInterviewFormData } from '../types/interviewFormData'

enum LABELS {
  INTERVIEW_TITLE = 'Interview Title',
  INTERVIEWER = 'Interviewer'
}

class RecruitmentPage {
  private static LOCATORS = {
    eyeIcon: '.bi-eye-fill',
    autoComplete: '.oxd-autocomplete-option',
    timeIcon: '.oxd-time-input--clock',
    recruitmentStatus: '.orangehrm-recruitment-status'
  }

  /**
   * go to Recruitment Page
   */
  static goToRecruitmentPage() {
    ElementHandler.clickMenuItem(PAGES.RECRUITMENT)
  }

  /**
   * open shortListed candidate details
   */
  static openShortlistedDetails() {
    ElementHandler.getHeaderIndex('Status').then((statusIndex) => {
      cy.get(COMMON_LOCATORS.table)
        .find(COMMON_LOCATORS.tableCard)
        .each(($row) => {
          const statusText = $row.find(COMMON_LOCATORS.cell).eq(statusIndex).text().trim()
          if (statusText === 'Shortlisted') {
            cy.wrap($row).find(this.LOCATORS.eyeIcon).click()
            return false
          }
        })
    })
  }

  /**
   * click to Schedule Interview
   */
  static scheduleInterview() {
    const loadGetCandidate = CommonHelper.generateRandomString(2, 'loadCandidate')
    APIsHelper.interceptCandidates(loadGetCandidate)
    ElementHandler.clickButton(' Schedule Interview ')
    APIsHelper.waitForApiResponse(loadGetCandidate)
  }

  /**
   * fill Interview Title
   * @param interviewData
   */
  static fillInterviewTitle(interviewData: IInterviewFormData) {
    ElementHandler.findInputByLabel(LABELS.INTERVIEW_TITLE).type(interviewData.interviewTitle)
  }

  /**
   * fill Interviewer Name
   * @param interviewData
   * @param index
   */
  static fillInterviewerName(interviewData: IInterviewFormData, index: number = 0) {
    const loadInterviewerName = CommonHelper.generateRandomString(3, 'loadInterviewerName')
    APIsHelper.interceptInterviewerName(loadInterviewerName)
    ElementHandler.findInputByLabel(LABELS.INTERVIEWER).type(interviewData.interviewerNameHint)
    APIsHelper.waitForApiResponse(loadInterviewerName)
    cy.get(this.LOCATORS.autoComplete).eq(index).click()
  }

  /**
   * fill Interview Data
   * @param interviewData
   */
  static fillInterviewData(interviewData: IInterviewFormData) {
    ElementHandler.selectDate(interviewData.interviewDate)
  }

  /**
   * fill interview time
   */
  static fillInterviewTime() {
    cy.get(this.LOCATORS.timeIcon).click()
  }

  /**
   * save button
   * @param index
   */
  static clickSave(index: number = 0, buttonText: string = 'Save') {
    ElementHandler.clickSave(index, buttonText)
  }

  /**
   * fill interview form information
   */
  static fillInterviewInfo(interviewData: IInterviewFormData, index: number = 0) {
    this.fillInterviewTitle(interviewData)
    this.fillInterviewerName(interviewData, index)
    this.fillInterviewData(interviewData)
    this.fillInterviewTime()
    this.clickSave()
  }

  /**
   * verify interview status
   */
  static verifyStatus() {
    cy.get(this.LOCATORS.recruitmentStatus).should('have.text', 'Status: Interview Scheduled')
  }
}
export { RecruitmentPage }
