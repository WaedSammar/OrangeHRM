import { ElementHandler } from '../element-handler'
import { APIsHelper } from '../helpers/apis-helpers'
import { CommonHelper } from '../helpers/common-helper'
import { COMMON_BUTTONS, HTML_TAGS, PAGES } from '../helpers/constants'
import { IEmployeeInfo } from '../types/employee.types'
import { IRecruitmentFormData } from '../types/recruitmentFormData'
import { TableRowData } from '../types/tableRowData.types'

enum LABELS {
  INTERVIEW_TITLE = 'Interview Title',
  INTERVIEWER = 'Interviewer'
}

enum INTERVIEW_STATUS {
  PASSED = 'Mark Interview Passed',
  FAILED = 'Mark Interview Failed',
  REJECT = 'Reject'
}

enum RECRUITMENT_CANDIDATE_TABLE_HEADERS {
  VACANCY = 'Vacancy',
  CANDIDATE = 'Candidate',
  HIRING_MANAGER = 'Hiring Manager',
  DATE_OF_APPLICATION = 'Date of Application',
  STATUS = 'Status',
  ACTIONS = 'Actions'
}

enum MESSAGES {
  INTERVIEW_SCHEDULED_STATUS = 'Status: Interview Scheduled'
}

enum BUTTONS {
  SCHEDULE_INTERVIEW = ' Schedule Interview '
}

class RecruitmentPage {
  private static LOCATORS = {
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
   * click eye icon for shortlisted candidate
   * @param {TableRowData} data 
   */
  static clickEyeIconForShortlistedCandidate(data: TableRowData) {
    ElementHandler.clickEyeIconForShortlistedCandidate(data)
  }

  /**
   * check allowed actions
   * @param {string[]} expectedActions
   */
  static checkAllowedActions(expectedActions: string[]) {
    expectedActions.forEach((action) => {
      cy.get(HTML_TAGS.button).contains(action).should('be.visible')
    })
  }

  /**
   * click to Schedule Interview
   */
  static scheduleInterview() {
    const loadGetCandidate = CommonHelper.generateRandomString(2, 'loadCandidate')
    APIsHelper.interceptCandidates(loadGetCandidate)
    ElementHandler.clickButton(BUTTONS.SCHEDULE_INTERVIEW)
    APIsHelper.waitForApiResponse(loadGetCandidate)
  }

  /**
   * fill Interview Title
   * @param {string} interviewTitle
   */
  static fillInterviewTitle(interviewTitle: string) {
    ElementHandler.findInputByLabel(LABELS.INTERVIEW_TITLE).type(interviewTitle)
  }

  /**
   * fill Interviewer Name
   * @param {IEmployeeInfo} employeeMockData
   */
  static fillInterviewerName(employeeMockData: IEmployeeInfo) {
    const loadInterviewerName = CommonHelper.generateRandomString(3, 'loadInterviewerName')
    APIsHelper.interceptInterviewerName(loadInterviewerName)
    ElementHandler.findInputByLabel(LABELS.INTERVIEWER).type(
      `${employeeMockData.firstName} ${employeeMockData.middleName} ${employeeMockData.lastName}`
    )
    APIsHelper.waitForApiResponse(loadInterviewerName)
    cy.get(this.LOCATORS.autoComplete).eq(0).click()
  }

  /**
   * fill Interview Data
   * @param {string} interviewDate
   */
  static fillInterviewData(interviewDate: string) {
    ElementHandler.selectDate(interviewDate)
  }

  /**
   * fill interview time
   */
  static fillInterviewTime() {
    cy.get(this.LOCATORS.timeIcon).click()
  }

  /**
   * click save button
   * @param {number} index
   * @param {COMMON_BUTTONS} buttonText
   */
  static clickSave(index: number = 0, buttonText: string = COMMON_BUTTONS.SAVE) {
    ElementHandler.clickSave(index, buttonText)
  }

  /**
   * fill interview form information
   * @param {IRecruitmentFormData} interviewData
   * @param {IEmployeeInfo} employeeMockData
   */
  static fillInterviewInfo(interviewData: IRecruitmentFormData, employeeMockData: IEmployeeInfo) {
    this.fillInterviewTitle(interviewData.interviewTitle)
    this.fillInterviewerName(employeeMockData)
    this.fillInterviewData(interviewData.interviewDate)
    this.fillInterviewTime()
    this.clickSave()
  }

  /**
   * verify interview status
   */
  static verifyStatus() {
    cy.get(this.LOCATORS.recruitmentStatus).should('have.text', MESSAGES.INTERVIEW_SCHEDULED_STATUS)
  }

  /**
   * mark interview passed
   */
  static markInterviewPassed() {
    this.changeInterviewStatus(INTERVIEW_STATUS.PASSED)
  }

  /**
   * mark interview failed
   */
  static markInterviewFailed() {
    this.changeInterviewStatus(INTERVIEW_STATUS.FAILED)
  }

  /**
   * reject candidate
   */
  static rejectCandidate() {
    this.changeInterviewStatus(INTERVIEW_STATUS.REJECT)
  }

  /**
   * change interview status
   * @param {string} status
   */
  static changeInterviewStatus(status: INTERVIEW_STATUS) {
    ElementHandler.clickButton(status)
    this.clickSave()
  }
}
export { RecruitmentPage, RECRUITMENT_CANDIDATE_TABLE_HEADERS }
