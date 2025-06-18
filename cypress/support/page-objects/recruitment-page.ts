import { COMMON_LOCATORS, ElementHandler } from '../element-handler'
import { APIsHelper } from '../helpers/apis-helpers'
import CommonHelper from '../helpers/common-helper'
import { PAGES } from '../helpers/constants'
import { IInterviewFormData } from '../types/interviewFormData'

enum LABELS {
  INTERVIEW_TITLE = 'Interview Title',
  INTERVIEWER = 'Interviewer'
}

enum RECRUITMENT_TABLE_HEADERS {
  VACANCY = 'Vacancy',
  CANDIDATE = 'Candidate',
  HIRING_MANAGER = 'Hiring Manager',
  DATE_OF_APPLICATION = 'Date of Application',
  STATUS = 'Status',
  ACTIONS = 'Actions'
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
   * click Eye Icon For Shortlisted Candidate
   * @param data 
   */
  static clickEyeIconForShortlistedCandidate(data: { Status: string; Vacancy: string; Candidate: string }) {
    ElementHandler.validateTableRow(data, ($row) => {
      cy.wrap($row).find(this.LOCATORS.eyeIcon).click()
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
export { RecruitmentPage, RECRUITMENT_TABLE_HEADERS }
