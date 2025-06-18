import CommonHelper from '../../support/helpers/common-helper'
import { PIMPageHelper } from '../../support/helpers/pim-page-helper'
import { RecruitmentPage } from '../../support/page-objects/recruitment-page'
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

      cy.request({
        method: 'POST',
        url: 'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/recruitment/vacancies',
        body: {
          name: candidatesMockData.vacancyName,
          jobTitleId: candidatesMockData.jobTitleId, // QA Lead
          employeeId: empNumber,
          status: true,
          isPublished: true
        }
      }).then((vacancyRes) => {
        expect(vacancyRes.status).to.eq(200)
        console.log(JSON.stringify(vacancyRes.body.data))

        const vacancyId = vacancyRes.body.data.id
        console.log('Vacancy created with ID:', vacancyId)

        cy.request({
          method: 'POST',
          url: 'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/recruitment/candidates',
          body: {
            firstName: candidatesMockData.candidatesFirstName,
            lastName: candidatesMockData.candidatesLastName,
            email: candidatesMockData.candidatesEmail,
            vacancyId
          }
        }).then((candidateRes) => {
          expect(candidateRes.status).to.eq(200)
          console.log('Candidate added with ID:', candidateRes.body.data.id)
        })
      })
    })
  })
})
