import CommonHelper from '../../support/helpers/common-helper'
import { PIMPageHelper } from '../../support/helpers/pim-page-helper'
import { RecruitmentPageHelper } from '../../support/helpers/recruitment-page-helper'
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

      const randomNum = CommonHelper.generateRandomNumber()
      employeeInfo = {
        ...employeeMockData,
        employeeId: `${employeeMockData.employeeId}${randomNum}`,
        userName: `${employeeMockData.userName}${randomNum}`
      }
    })
  })

  beforeEach(() => {
    cy.login()
  })

  it('Schedule an interview for a newly added shortlisted candidate via API', () => {
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
            RecruitmentPageHelper.checkAllowedActions(candidateId)
          })
        })
      })
    })

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

  after(() => {
    RecruitmentPageHelper.deleteVacancy(recruitmentMockData)
    RecruitmentPageHelper.deleteCandidate(recruitmentMockData)
    RecruitmentPageHelper.deleteJobTitle(recruitmentMockData)
    RecruitmentPageHelper.deleteUser(employeeMockData)
  })
})
