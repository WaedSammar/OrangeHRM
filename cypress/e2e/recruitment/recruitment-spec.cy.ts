import { PIMPageHelper } from '../../support/helpers/pim-page-helper'
import { ALLOWED_ACTIONS, RecruitmentPageHelper } from '../../support/helpers/recruitment-page-helper'
import { RECRUITMENT_TABLE_HEADERS, RecruitmentPage } from '../../support/page-objects/recruitment-page'
import { IEmployeeInfo } from '../../support/types/employee.types'
import { IRecruitmentFormData } from '../../support/types/recruitmentFormData'

describe('Recruitment Page Test Cases', () => {
  let recruitmentMockData: IRecruitmentFormData, employeeMockData: IEmployeeInfo, employeeInfo: IEmployeeInfo

  before(() => {
    cy.fixture('recruitment-page-mock').then((candidatesData) => {
      recruitmentMockData = candidatesData
    })
    cy.fixture('employee-page-mock').then((addEmployeeData) => {
      employeeMockData = addEmployeeData
    })
  })

  beforeEach(() => {
    cy.login()
    employeeInfo = {
      ...employeeMockData,
      employeeId: employeeMockData.employeeId,
      userName: employeeMockData.userName
    }

    PIMPageHelper.createEmployeeViaAPI(employeeInfo).then((response) => {
      const empNumber = response.body.data.empNumber
      employeeMockData.empNumber = empNumber

      RecruitmentPageHelper.addJobTitle(recruitmentMockData).then((jobTitleRes) => {
        const jobTitleId = jobTitleRes.body.data.id
        recruitmentMockData.jobTitleId = jobTitleId

        RecruitmentPageHelper.addVacancy(recruitmentMockData, empNumber).then((vacancyRes) => {
          const vacancyId = vacancyRes.body.data.id
          recruitmentMockData.vacancyId = vacancyId

          RecruitmentPageHelper.addCandidate(recruitmentMockData, vacancyId).then((candidateRes) => {
            const candidateId = candidateRes.body.data.id
            recruitmentMockData.candidateId = candidateId

            RecruitmentPageHelper.updateCandidateStatus(candidateId)
            const expectedActions = [ALLOWED_ACTIONS.REJECT, ALLOWED_ACTIONS.SCHEDULE_INTERVIEW]
            RecruitmentPageHelper.checkAllowedActions(expectedActions, candidateId)
          })
        })
      })
    })
  })

  it('Schedule an interview via UI', () => {
    RecruitmentPage.goToRecruitmentPage()
    const data = {
      [RECRUITMENT_TABLE_HEADERS.STATUS]: recruitmentMockData.candidateStatus,
      [RECRUITMENT_TABLE_HEADERS.VACANCY]: recruitmentMockData.vacancyName,
      [RECRUITMENT_TABLE_HEADERS.CANDIDATE]: `${recruitmentMockData.candidateFirstName}  ${recruitmentMockData.candidateLastName}`
    }
    RecruitmentPage.clickEyeIconForShortlistedCandidate(data)
    RecruitmentPage.scheduleInterview()
    RecruitmentPage.fillInterviewInfo(recruitmentMockData, employeeMockData)
    RecruitmentPage.verifyStatus()
  })

  it('Schedule an interview via API', () => {
    RecruitmentPage.goToRecruitmentPage()
    const data = {
      [RECRUITMENT_TABLE_HEADERS.STATUS]: recruitmentMockData.candidateStatus,
      [RECRUITMENT_TABLE_HEADERS.VACANCY]: recruitmentMockData.vacancyName,
      [RECRUITMENT_TABLE_HEADERS.CANDIDATE]: `${recruitmentMockData.candidateFirstName}  ${recruitmentMockData.candidateLastName}`
    }
    RecruitmentPage.clickEyeIconForShortlistedCandidate(data)
    RecruitmentPageHelper.scheduleInterview(recruitmentMockData, employeeMockData)
    RecruitmentPageHelper.verifyInterviewStatus(recruitmentMockData.candidateId)
    RecruitmentPage.markInterviewPassed()
  })

  afterEach(() => {
    RecruitmentPageHelper.deleteVacancy(recruitmentMockData.vacancyId)
    RecruitmentPageHelper.deleteCandidate(recruitmentMockData.candidateId)
    RecruitmentPageHelper.deleteJobTitle(recruitmentMockData.jobTitleId)
    PIMPageHelper.deleteUser(employeeMockData.empNumber)
  })
})
