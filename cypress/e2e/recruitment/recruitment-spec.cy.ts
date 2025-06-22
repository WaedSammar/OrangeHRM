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
    })
  })

  beforeEach(() => {
    cy.login()
    const randomNum = CommonHelper.generateRandomNumber()
    employeeInfo = {
      ...employeeMockData,
      employeeId: `${employeeMockData.employeeId}${randomNum}`,
      userName: `${employeeMockData.userName}${randomNum}`
    }
    return RecruitmentPageHelper.setupRecruitmentTest(employeeInfo, employeeMockData, recruitmentMockData)
  })

  it.only('Schedule an interview for a newly added shortlisted candidate via API', () => {
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

  it('via API', () => {
    RecruitmentPage.goToRecruitmentPage()
    const data = {
      [RECRUITMENT_TABLE_HEADERS.STATUS]: recruitmentMockData.candidateStatus,
      [RECRUITMENT_TABLE_HEADERS.VACANCY]: recruitmentMockData.vacancyName,
      [RECRUITMENT_TABLE_HEADERS.CANDIDATE]: `${recruitmentMockData.candidateFirstName}  ${recruitmentMockData.candidateLastName}`
    }
    RecruitmentPage.clickEyeIconForShortlistedCandidate(data)
    cy.wait(2000)
    // RecruitmentPage.scheduleInterview()
    cy.request(
      'POST',
      `https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/recruitment/candidates/${recruitmentMockData.candidateId}/shedule-interview`,
      {
        interviewName: recruitmentMockData.interviewTitle,
        interviewerEmpNumbers: [employeeMockData.empNumber],
        interviewDate: recruitmentMockData.interviewDate,
        interviewTime: '01:00',
        note: recruitmentMockData.jobNote
      }
    ).then((response) => {
      expect(response.status).to.eq(200)
    })

    console.log('WAED')
  })

  afterEach(() => {
    RecruitmentPageHelper.deleteVacancy(recruitmentMockData)
    RecruitmentPageHelper.deleteCandidate(recruitmentMockData)
    RecruitmentPageHelper.deleteJobTitle(recruitmentMockData)
    PIMPageHelper.deleteUser(employeeMockData)
  })
})
