import { ElementHandler } from '../element-handler'
import { APIsHelper } from '../helpers/apis-helpers'
import CommonHelper from '../helpers/common-helper'
import { COMMON_BUTTONS, PAGES } from '../helpers/constants'
import { IEmployeeInfo } from '../types/employee.types'
import { IRecruitmentFormData } from '../types/recruitmentFormData'
import { TableRowData } from '../types/tableRowData.types'

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

enum MESSAGES {
  INTERVIEW_SCHEDULED_STATUS = 'Status: Interview Scheduled'
}

enum BUTTONS {
  SCHEDULE_INTERVIEW = ' Schedule Interview '
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
   * @param {TableRowData} data
   */
  static clickEyeIconForShortlistedCandidate(data: TableRowData) {
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
    ElementHandler.clickButton(BUTTONS.SCHEDULE_INTERVIEW)
    APIsHelper.waitForApiResponse(loadGetCandidate)
  }

  /**
   * fill Interview Title
   * @param {IRecruitmentFormData} interviewData
   */
  static fillInterviewTitle(interviewData: IRecruitmentFormData) {
    ElementHandler.findInputByLabel(LABELS.INTERVIEW_TITLE).type(interviewData.interviewTitle)
  }

  /**
   * fill Interviewer Name
   * @param {IRecruitmentFormData} interviewData
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
   * @param {IRecruitmentFormData} interviewData
   */
  static fillInterviewData(interviewData: IRecruitmentFormData) {
    ElementHandler.selectDate(interviewData.interviewDate)
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
    this.fillInterviewTitle(interviewData)
    this.fillInterviewerName(employeeMockData)
    this.fillInterviewData(interviewData)
    this.fillInterviewTime()
    this.clickSave()
  }

  /**
   * verify interview status
   */
  static verifyStatus() {
    cy.get(this.LOCATORS.recruitmentStatus).should('have.text', MESSAGES.INTERVIEW_SCHEDULED_STATUS)
  }
}
export { RecruitmentPage, RECRUITMENT_TABLE_HEADERS }
