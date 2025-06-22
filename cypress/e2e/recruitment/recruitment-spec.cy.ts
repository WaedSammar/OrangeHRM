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

  it('Schedule an interview for a newly added shortlisted candidate via API', () => {
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
    console.log('WAED')
  })

  afterEach(() => {
    RecruitmentPageHelper.deleteVacancy(recruitmentMockData)
    RecruitmentPageHelper.deleteCandidate(recruitmentMockData)
    RecruitmentPageHelper.deleteJobTitle(recruitmentMockData)
    PIMPageHelper.deleteUser(employeeMockData)
  })
})
