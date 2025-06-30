import { PIMPageHelper } from '../../support/helpers/pim-page-helper'
import { ALLOWED_ACTIONS, RecruitmentPageHelper } from '../../support/helpers/recruitment-page-helper'
import { RECRUITMENT_CANDIDATE_TABLE_HEADERS, RecruitmentPage } from '../../support/page-objects/recruitment-page'
import { IEmployeeInfo } from '../../support/types/employee.types'
import { IRecruitmentFormData } from '../../support/types/recruitmentFormData'

describe('Recruitment Page Test Cases', () => {
  let recruitmentMockData: IRecruitmentFormData, employeeMockData: IEmployeeInfo, employeeInfo: IEmployeeInfo
  let employeeIds: number[] = []
  let vacancyIds: number[] = []
  let candidateIds: number[] = []
  let jobTitleIds: number[] = []

  before(() => {
    cy.fixture('recruitment-page-mock').then((candidatesData) => {
      recruitmentMockData = candidatesData
    })
    cy.fixture('employee-page-mock').then((addEmployeeData) => {
      employeeMockData = addEmployeeData
      employeeInfo = { ...employeeMockData }
    })
  })

  beforeEach(() => {
    employeeIds = []
    candidateIds = []
    vacancyIds = []
    jobTitleIds = []
    cy.login()

    PIMPageHelper.createEmployeeViaAPI(employeeInfo).then((response) => {
      const empNumber = response.body.data.empNumber
      employeeIds.push(empNumber)

      RecruitmentPageHelper.addJobTitle(recruitmentMockData).then((jobTitleRes) => {
        const jobTitleId = jobTitleRes.body.data.id
        jobTitleIds.push(jobTitleId)

        RecruitmentPageHelper.addVacancy(recruitmentMockData, empNumber, jobTitleId).then((vacancyRes) => {
          const vacancyId = vacancyRes.body.data.id
          vacancyIds.push(vacancyId)

          RecruitmentPageHelper.addCandidate(recruitmentMockData, vacancyId).then((candidateRes) => {
            const candidateId = candidateRes.body.data.id
            candidateIds.push(candidateId)
          })
        })
      })
    })
  })

  it('Schedule an interview via UI', () => {
    RecruitmentPageHelper.updateCandidateStatusToShortlisted(candidateIds)

    RecruitmentPage.goToRecruitmentPage()
    const data = {
      [RECRUITMENT_CANDIDATE_TABLE_HEADERS.STATUS]: recruitmentMockData.candidateStatus,
      [RECRUITMENT_CANDIDATE_TABLE_HEADERS.VACANCY]: recruitmentMockData.vacancyName,
      [RECRUITMENT_CANDIDATE_TABLE_HEADERS.CANDIDATE]: `${recruitmentMockData.candidateFirstName}  ${recruitmentMockData.candidateLastName}`
    }
    RecruitmentPage.clickEyeIconForShortlistedCandidate(data)
    let expectedActions = [ALLOWED_ACTIONS.REJECT, ALLOWED_ACTIONS.SCHEDULE_INTERVIEW]
    RecruitmentPage.checkAllowedActions(expectedActions)
    RecruitmentPage.scheduleInterview()
    RecruitmentPage.fillInterviewInfo(recruitmentMockData, employeeMockData)
    RecruitmentPage.verifyStatus()
    expectedActions = [ALLOWED_ACTIONS.REJECT, ALLOWED_ACTIONS.PASSED, ALLOWED_ACTIONS.FAILED]
    RecruitmentPage.checkAllowedActions(expectedActions)
  })

  it('Mark a shortlisted candidate as interview passed', () => {
    RecruitmentPageHelper.updateCandidateStatusToShortlisted(candidateIds)

    RecruitmentPage.goToRecruitmentPage()
    const data = {
      [RECRUITMENT_CANDIDATE_TABLE_HEADERS.STATUS]: recruitmentMockData.candidateStatus,
      [RECRUITMENT_CANDIDATE_TABLE_HEADERS.VACANCY]: recruitmentMockData.vacancyName,
      [RECRUITMENT_CANDIDATE_TABLE_HEADERS.CANDIDATE]: `${recruitmentMockData.candidateFirstName}  ${recruitmentMockData.candidateLastName}`
    }
    RecruitmentPage.clickEyeIconForShortlistedCandidate(data)
    RecruitmentPageHelper.scheduleInterview(recruitmentMockData, employeeIds, candidateIds).then(() => {
      RecruitmentPage.verifyStatus()
      let expectedActions = [ALLOWED_ACTIONS.REJECT, ALLOWED_ACTIONS.PASSED, ALLOWED_ACTIONS.FAILED]
      RecruitmentPage.checkAllowedActions(expectedActions)
      RecruitmentPage.markInterviewPassed()
      expectedActions = [ALLOWED_ACTIONS.REJECT, ALLOWED_ACTIONS.SCHEDULE_INTERVIEW, ALLOWED_ACTIONS.OFFER_JOB]
      RecruitmentPage.checkAllowedActions(expectedActions)
    })
  })

  it('Mark a shortlisted candidate as interview failed', () => {
    RecruitmentPageHelper.updateCandidateStatusToShortlisted(candidateIds)

    RecruitmentPage.goToRecruitmentPage()
    const data = {
      [RECRUITMENT_CANDIDATE_TABLE_HEADERS.STATUS]: recruitmentMockData.candidateStatus,
      [RECRUITMENT_CANDIDATE_TABLE_HEADERS.VACANCY]: recruitmentMockData.vacancyName,
      [RECRUITMENT_CANDIDATE_TABLE_HEADERS.CANDIDATE]: `${recruitmentMockData.candidateFirstName}  ${recruitmentMockData.candidateLastName}`
    }
    RecruitmentPage.clickEyeIconForShortlistedCandidate(data)
    RecruitmentPageHelper.scheduleInterview(recruitmentMockData, employeeIds, candidateIds).then(() => {
      RecruitmentPage.verifyStatus()
      let expectedActions = [ALLOWED_ACTIONS.REJECT, ALLOWED_ACTIONS.PASSED, ALLOWED_ACTIONS.FAILED]
      RecruitmentPage.checkAllowedActions(expectedActions)
      RecruitmentPage.markInterviewFailed()
      expectedActions = [ALLOWED_ACTIONS.REJECT]
      RecruitmentPage.checkAllowedActions(expectedActions)
    })
  })

  it('Mark a shortlisted candidate as interview reject', () => {
    RecruitmentPageHelper.updateCandidateStatusToShortlisted(candidateIds)

    RecruitmentPage.goToRecruitmentPage()
    const data = {
      [RECRUITMENT_CANDIDATE_TABLE_HEADERS.STATUS]: recruitmentMockData.candidateStatus,
      [RECRUITMENT_CANDIDATE_TABLE_HEADERS.VACANCY]: recruitmentMockData.vacancyName,
      [RECRUITMENT_CANDIDATE_TABLE_HEADERS.CANDIDATE]: `${recruitmentMockData.candidateFirstName}  ${recruitmentMockData.candidateLastName}`
    }
    RecruitmentPage.clickEyeIconForShortlistedCandidate(data)
    RecruitmentPageHelper.scheduleInterview(recruitmentMockData, employeeIds, candidateIds).then(() => {
      RecruitmentPage.verifyStatus()
      const expectedActions = [ALLOWED_ACTIONS.REJECT, ALLOWED_ACTIONS.PASSED, ALLOWED_ACTIONS.FAILED]
      RecruitmentPage.checkAllowedActions(expectedActions)
      RecruitmentPage.rejectCandidate()
    })
  })

  afterEach(() => {
    RecruitmentPageHelper.deleteVacancies(vacancyIds)
    RecruitmentPageHelper.deleteCandidates(candidateIds)
    RecruitmentPageHelper.deleteJobTitles(jobTitleIds)
    PIMPageHelper.deleteUsers(employeeIds)
  })
})
