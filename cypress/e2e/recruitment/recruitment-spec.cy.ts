import { ICandidate, IJobTitle, IVacancy } from '../../support/apis/response/recruitment-page/recruitment'
import { PIMPageHelper } from '../../support/helpers/pim-page-helper'
import { ALLOWED_ACTIONS, RecruitmentPageHelper } from '../../support/helpers/recruitment-page-helper'
import { RECRUITMENT_CANDIDATE_TABLE_HEADERS, RecruitmentPage } from '../../support/page-objects/recruitment-page'
import { IEmployeeInfo } from '../../support/types/employee'
import { IRecruitmentFormData } from '../../support/types/recruitmentFormData'

describe('Recruitment Page Test Cases', () => {
  let recruitmentMockData: IRecruitmentFormData, employeeMockData: IEmployeeInfo, employeeInfo: IEmployeeInfo
  let employeeIds: number[] = []
  let vacancyIds: number[] = []
  let candidateIds: number[] = []
  let jobTitleIds: number[] = []
  let createdUsersMap: Record<string, IEmployeeInfo> = {}
  let createdJobTitlesMap: Record<number, IJobTitle> = {}
  let createdVacanciesMap: Record<number, IVacancy> = {}
  let createdCandidatesMap: Record<number, ICandidate> = {}

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
    employeeIds = []
    candidateIds = []
    vacancyIds = []
    jobTitleIds = []
    cy.login()

    PIMPageHelper.createEmployeeViaAPI(employeeInfo).then((response) => {
      const empNumber = response.body.data.empNumber.toString()
      employeeIds.push(Number(empNumber))
      createdUsersMap[empNumber] = response.body.data

      RecruitmentPageHelper.addJobTitle(recruitmentMockData).then((jobTitleRes) => {
        const jobTitleId = jobTitleRes.body.data.id
        jobTitleIds.push(jobTitleId)
        createdJobTitlesMap[jobTitleId] = jobTitleRes.body.data

        RecruitmentPageHelper.addVacancy(recruitmentMockData, empNumber, jobTitleId).then((vacancyRes) => {
          const vacancyId = vacancyRes.body.data.id
          vacancyIds.push(vacancyId)
          createdVacanciesMap[vacancyId] = vacancyRes.body.data

          RecruitmentPageHelper.addCandidate(recruitmentMockData, vacancyId).then((candidateRes) => {
            const candidateId = candidateRes.body.data.id
            candidateIds.push(candidateId)
            createdCandidatesMap[candidateId] = candidateRes.body.data
          })
        })
      })
    })
  })

  it('Schedule an interview via UI', () => {
    const candidateData = createdCandidatesMap[candidateIds[0]]
    const vacancyData = createdVacanciesMap[vacancyIds[0]]

    RecruitmentPageHelper.updateCandidateStatusToShortlisted(candidateIds).then(() => {
      RecruitmentPage.goToRecruitmentPage()
      const data = {
        [RECRUITMENT_CANDIDATE_TABLE_HEADERS.STATUS]: recruitmentMockData.candidateStatus,
        [RECRUITMENT_CANDIDATE_TABLE_HEADERS.VACANCY]: vacancyData.name,
        [RECRUITMENT_CANDIDATE_TABLE_HEADERS.CANDIDATE]: `${candidateData.firstName}  ${candidateData.lastName}`
      }
      RecruitmentPage.clickEyeIconForShortlistedCandidate(data)
      let expectedActions = [ALLOWED_ACTIONS.REJECT, ALLOWED_ACTIONS.SCHEDULE_INTERVIEW]
      RecruitmentPage.checkAllowedActions(expectedActions)
      RecruitmentPage.scheduleInterview()
      const interviewerData = createdUsersMap[employeeIds[0].toString()]
      RecruitmentPage.fillInterviewInfo(recruitmentMockData, interviewerData)
      RecruitmentPage.verifyStatus()
      expectedActions = [ALLOWED_ACTIONS.REJECT, ALLOWED_ACTIONS.PASSED, ALLOWED_ACTIONS.FAILED]
      RecruitmentPage.checkAllowedActions(expectedActions)
    })
  })

  it('Mark a shortlisted candidate as interview passed', () => {
    const candidateData = createdCandidatesMap[candidateIds[0]]
    const vacancyData = createdVacanciesMap[vacancyIds[0]]

    RecruitmentPageHelper.updateCandidateStatusToShortlisted(candidateIds).then(() => {
      RecruitmentPage.goToRecruitmentPage()
      const data = {
        [RECRUITMENT_CANDIDATE_TABLE_HEADERS.STATUS]: recruitmentMockData.candidateStatus,
        [RECRUITMENT_CANDIDATE_TABLE_HEADERS.VACANCY]: vacancyData.name,
        [RECRUITMENT_CANDIDATE_TABLE_HEADERS.CANDIDATE]: `${candidateData.firstName}  ${candidateData.lastName}`
      }

      RecruitmentPage.clickEyeIconForShortlistedCandidate(data)
      RecruitmentPageHelper.scheduleInterview(recruitmentMockData, employeeIds, candidateIds).then(() => {
        RecruitmentPage.verifyStatus()
        let expectedActions = [ALLOWED_ACTIONS.REJECT, ALLOWED_ACTIONS.PASSED, ALLOWED_ACTIONS.FAILED]
        RecruitmentPage.checkAllowedActions(expectedActions)
        RecruitmentPage.markInterviewPassed()
        expectedActions = [ALLOWED_ACTIONS.REJECT, ALLOWED_ACTIONS.SCHEDULE_INTERVIEW, ALLOWED_ACTIONS.OFFER_JOB]
        RecruitmentPage.checkAllowedActions(expectedActions)
      })
    })
  })

  it('Mark a shortlisted candidate as interview failed', () => {
    const candidateData = createdCandidatesMap[candidateIds[0]]
    const vacancyData = createdVacanciesMap[vacancyIds[0]]

    RecruitmentPageHelper.updateCandidateStatusToShortlisted(candidateIds).then(() => {
      RecruitmentPage.goToRecruitmentPage()
      const data = {
        [RECRUITMENT_CANDIDATE_TABLE_HEADERS.STATUS]: recruitmentMockData.candidateStatus,
        [RECRUITMENT_CANDIDATE_TABLE_HEADERS.VACANCY]: vacancyData.name,
        [RECRUITMENT_CANDIDATE_TABLE_HEADERS.CANDIDATE]: `${candidateData.firstName}  ${candidateData.lastName}`
      }
      RecruitmentPage.clickEyeIconForShortlistedCandidate(data)
      RecruitmentPageHelper.scheduleInterview(recruitmentMockData, employeeIds, candidateIds).then(() => {
        RecruitmentPage.verifyStatus()
        let expectedActions = [ALLOWED_ACTIONS.REJECT, ALLOWED_ACTIONS.PASSED, ALLOWED_ACTIONS.FAILED]
        RecruitmentPage.checkAllowedActions(expectedActions)
        RecruitmentPage.markInterviewFailed()
        expectedActions = [ALLOWED_ACTIONS.REJECT]
        RecruitmentPage.checkAllowedActions(expectedActions)
      })
    })
  })

  it('Mark a shortlisted candidate as interview reject', () => {
    const candidateData = createdCandidatesMap[candidateIds[0]]
    const vacancyData = createdVacanciesMap[vacancyIds[0]]

    RecruitmentPageHelper.updateCandidateStatusToShortlisted(candidateIds).then(() => {
      RecruitmentPage.goToRecruitmentPage()
      const data = {
        [RECRUITMENT_CANDIDATE_TABLE_HEADERS.STATUS]: recruitmentMockData.candidateStatus,
        [RECRUITMENT_CANDIDATE_TABLE_HEADERS.VACANCY]: vacancyData.name,
        [RECRUITMENT_CANDIDATE_TABLE_HEADERS.CANDIDATE]: `${candidateData.firstName}  ${candidateData.lastName}`
      }
      RecruitmentPage.clickEyeIconForShortlistedCandidate(data)
      RecruitmentPageHelper.scheduleInterview(recruitmentMockData, employeeIds, candidateIds).then(() => {
        RecruitmentPage.verifyStatus()
        const expectedActions = [ALLOWED_ACTIONS.REJECT, ALLOWED_ACTIONS.PASSED, ALLOWED_ACTIONS.FAILED]
        RecruitmentPage.checkAllowedActions(expectedActions)
        RecruitmentPage.rejectCandidate()
      })
    })
  })

  afterEach(() => {
    RecruitmentPageHelper.deleteVacancies(vacancyIds)
    RecruitmentPageHelper.deleteCandidates(candidateIds)
    RecruitmentPageHelper.deleteJobTitles(jobTitleIds)
    PIMPageHelper.deleteUsers(employeeIds)
  })
})
