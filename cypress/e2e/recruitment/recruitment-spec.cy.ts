import CommonHelper from '../../support/helpers/common-helper'
import { PIMPageHelper } from '../../support/helpers/pim-page-helper'
import { RecruitmentPageHelper } from '../../support/helpers/recruitment-page-helper'
import { RECRUITMENT_TABLE_HEADERS, RecruitmentPage } from '../../support/page-objects/recruitment-page'
import { IEmployeeInfo } from '../../support/types/employee.types'
import { IInterviewFormData } from '../../support/types/interviewFormData'

describe('Recruitment Page Test Cases', () => {
  let candidatesMockData: IInterviewFormData, employeeMockData: IEmployeeInfo, employeeInfo: IEmployeeInfo

  before(() => {
    cy.fixture('recruitment-page-mock').then((candidatesData) => {
      candidatesMockData = candidatesData
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

      RecruitmentPageHelper.addJobTitle(candidatesMockData).then((jobTitleRes) => {
        const jobTitleId = jobTitleRes.body.data.id
        candidatesMockData.jobTitleId = jobTitleId

        RecruitmentPageHelper.addVacancy(candidatesMockData, empNumber).then((vacancyRes) => {
          const vacancyId = vacancyRes.body.data.id

          RecruitmentPageHelper.addCandidate(candidatesMockData, vacancyId).then((candidateRes) => {
            const candidateId = candidateRes.body.data.id

            RecruitmentPageHelper.updateCandidateStatus(candidateId)
          })
        })
      })

      RecruitmentPage.goToRecruitmentPage()
      const data = {
        [RECRUITMENT_TABLE_HEADERS.STATUS]: candidatesMockData.candidateStatus,
        [RECRUITMENT_TABLE_HEADERS.VACANCY]: candidatesMockData.vacancyName,
        [RECRUITMENT_TABLE_HEADERS.CANDIDATE]: `${candidatesMockData.candidatesFirstName}  ${candidatesMockData.candidatesLastName}`
      }
      RecruitmentPage.clickEyeIconForShortlistedCandidate(data)
      RecruitmentPage.scheduleInterview()
      RecruitmentPage.fillInterviewInfo(candidatesMockData)
      RecruitmentPage.verifyStatus()
    })
  })
})
