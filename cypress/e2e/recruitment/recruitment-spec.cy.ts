import { ElementHandler } from '../../support/element-handler'
import { RecruitmentPage } from '../../support/page-objects/recruitment-page'
import { IInterviewFormData } from '../../support/types/interviewFormData'

describe('Recruitment Page Test Cases', () => {
  let interviewData: IInterviewFormData

  before(() => {
    cy.fixture('recruitment-interview-page-mock').then((interviewFormData) => {
      interviewData = interviewFormData
      cy.login()
    })
  })

  it('fill interview form successfully', () => {
    RecruitmentPage.goToRecruitmentPage()
    RecruitmentPage.openShortlistedDetails()
    RecruitmentPage.scheduleInterview()
    RecruitmentPage.fillInterviewInfo(interviewData)
    RecruitmentPage.verifyStatus()
  })
})
