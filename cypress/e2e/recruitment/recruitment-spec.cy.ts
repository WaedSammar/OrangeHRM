import { PIMPageHelper } from '../../support/helpers/pim-page-helper'
import { ALLOWED_ACTIONS, RecruitmentPageHelper } from '../../support/helpers/recruitment-page-helper'
import { RECRUITMENT_TABLE_HEADERS, RecruitmentPage } from '../../support/page-objects/recruitment-page'
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
  8
  it('Schedule an interview via UI', () => {
    RecruitmentPageHelper.updateCandidateStatusToShortlisted(candidateIds.at(-1))

    RecruitmentPage.goToRecruitmentPage()
    const data = {
      [RECRUITMENT_TABLE_HEADERS.STATUS]: recruitmentMockData.candidateStatus,
      [RECRUITMENT_TABLE_HEADERS.VACANCY]: recruitmentMockData.vacancyName,
      [RECRUITMENT_TABLE_HEADERS.CANDIDATE]: `${recruitmentMockData.candidateFirstName}  ${recruitmentMockData.candidateLastName}`
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

  it.only('Mark a shortlisted candidate as interview passed', () => {
    RecruitmentPageHelper.updateCandidateStatusToShortlisted(candidateIds.at(-1))

    RecruitmentPage.goToRecruitmentPage()
    const data = {
      [RECRUITMENT_TABLE_HEADERS.STATUS]: recruitmentMockData.candidateStatus,
      [RECRUITMENT_TABLE_HEADERS.VACANCY]: recruitmentMockData.vacancyName,
      [RECRUITMENT_TABLE_HEADERS.CANDIDATE]: `${recruitmentMockData.candidateFirstName}  ${recruitmentMockData.candidateLastName}`
    }
    RecruitmentPage.clickEyeIconForShortlistedCandidate(data)
    RecruitmentPageHelper.scheduleInterview(recruitmentMockData, employeeIds, candidateIds)
    RecruitmentPage.verifyStatus()
    const expectedActions = [ALLOWED_ACTIONS.REJECT, ALLOWED_ACTIONS.PASSED, ALLOWED_ACTIONS.FAILED]
    RecruitmentPage.checkAllowedActions(expectedActions)
    RecruitmentPage.markInterviewPassed()
  })

  afterEach(() => {
    RecruitmentPageHelper.deleteVacancy(vacancyIds)
    RecruitmentPageHelper.deleteCandidate(candidateIds)
    RecruitmentPageHelper.deleteJobTitle(jobTitleIds)
    PIMPageHelper.deleteUser(employeeIds)
  })
})
