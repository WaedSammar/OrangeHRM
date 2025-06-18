import { ElementHandler } from '../../support/element-handler'
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

  it('fill interview form successfully', () => {
    RecruitmentPage.goToRecruitmentPage()
    RecruitmentPage.openShortlistedDetails()
    RecruitmentPage.scheduleInterview()
    RecruitmentPage.fillInterviewInfo(candidatesMockData)
    RecruitmentPage.verifyStatus()
  })

  it.only('add vacancy via API', () => {
    PIMPageHelper.createEmployeeViaAPI(employeeInfo).then((response) => {
      const empNumber = response.body.data.empNumber

      RecruitmentPageHelper.addVacancy(candidatesMockData, empNumber).then((vacancyRes) => {
        expect(vacancyRes.status).to.eq(200)
        const vacancyId = vacancyRes.body.data.id

        RecruitmentPageHelper.addCandidate(candidatesMockData, vacancyId).then((candidateRes) => {
          expect(candidateRes.status).to.eq(200)

          const candidateId = candidateRes.body.data.id

          cy.request({
            method: 'PUT',
            url: `/web/index.php/api/v2/recruitment/candidates/${candidateId}/shortlist`
          }).then((response) => {
            expect(response.status).to.eq(200)
            console.log('Shortlist Successful', response.body)
          })
        })
      })
    })

    RecruitmentPage.goToRecruitmentPage()
    const data = {
      [RECRUITMENT_TABLE_HEADERS.STATUS]: 'Shortlisted',
      [RECRUITMENT_TABLE_HEADERS.VACANCY]: candidatesMockData.vacancyName,
      [RECRUITMENT_TABLE_HEADERS.CANDIDATE]: `${candidatesMockData.candidatesFirstName}  ${candidatesMockData.candidatesLastName}`
    }
    console.log(data)
    ElementHandler.validateTableRow(data, ($row) => {
      cy.wrap($row).find('.bi-eye-fill').click()
    })
    // RecruitmentPage.openShortlistedDetails()
    RecruitmentPage.scheduleInterview()
    RecruitmentPage.fillInterviewInfo(candidatesMockData)
    RecruitmentPage.verifyStatus()
  })
})
