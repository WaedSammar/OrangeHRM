import CommonHelper from '../../support/helpers/common-helper'
import { PIMPageHelper } from '../../support/helpers/pim-page-helper'
import { RecruitmentPageHelper } from '../../support/helpers/recruitment-page-helper'
import { RECRUITMENT_TABLE_HEADERS, RecruitmentPage } from '../../support/page-objects/recruitment-page'
import { IEmployeeInfo } from '../../support/types/employee.types'
import { IInterviewFormData } from '../../support/types/interviewFormData'

describe('Recruitment Page Test Cases', () => {
  let recruitmentMockData: IInterviewFormData, employeeMockData: IEmployeeInfo, employeeInfo: IEmployeeInfo

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
    cy.login()
  })

  it('Schedule an interview for a newly added shortlisted candidate via API', () => {
    PIMPageHelper.createEmployeeViaAPI(employeeInfo).then((response) => {
      const empNumber = response.body.data.empNumber

      const randomNum = CommonHelper.generateRandomNumber()
      recruitmentMockData.jobTitleName = `${recruitmentMockData.jobTitleName} ${randomNum}`
      RecruitmentPageHelper.addJobTitle(recruitmentMockData).then((jobTitleRes) => {
        const jobTitleId = jobTitleRes.body.data.id
        recruitmentMockData.jobTitleId = jobTitleId

        RecruitmentPageHelper.addVacancy(recruitmentMockData, empNumber).then((vacancyRes) => {
          const vacancyId = vacancyRes.body.data.id

          RecruitmentPageHelper.addCandidate(recruitmentMockData, vacancyId).then((candidateRes) => {
            const candidateId = candidateRes.body.data.id

            RecruitmentPageHelper.updateCandidateStatus(candidateId)
          })
        })
      })
    })

    RecruitmentPage.goToRecruitmentPage()
    const data = {
      [RECRUITMENT_TABLE_HEADERS.STATUS]: recruitmentMockData.candidateStatus,
      [RECRUITMENT_TABLE_HEADERS.VACANCY]: recruitmentMockData.vacancyName,
      [RECRUITMENT_TABLE_HEADERS.CANDIDATE]: `${recruitmentMockData.candidatesFirstName}  ${recruitmentMockData.candidatesLastName}`
    }
    RecruitmentPage.clickEyeIconForShortlistedCandidate(data)
    RecruitmentPage.scheduleInterview()
    RecruitmentPage.fillInterviewInfo(recruitmentMockData)
    RecruitmentPage.verifyStatus()
  })
})
