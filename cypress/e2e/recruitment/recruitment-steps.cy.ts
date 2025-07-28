import { ICandidate, IVacancy } from '../../support/apis/response/recruitment-page/recruitment'
import { PIMPageHelper } from '../../support/helpers/pim-page-helper'
import { RecruitmentPageHelper } from '../../support/helpers/recruitment-page-helper'
import { RECRUITMENT_CANDIDATE_TABLE_HEADERS, RecruitmentPage } from '../../support/page-objects/recruitment-page'
import { IEmployeeInfo } from '../../support/types/employee'
import { IRecruitmentFormData } from '../../support/types/recruitmentFormData'
import { TableRowData } from '../../support/types/tableRowData'
import { Given, When, Then, After } from '@badeball/cypress-cucumber-preprocessor'

let recruitmentMockData: IRecruitmentFormData,
  vacancyData: IVacancy,
  candidateData: ICandidate,
  interviewerData: IEmployeeInfo,
  candidateTableRowData: TableRowData,
  employeeIds: number[] = [],
  vacancyIds: number[] = [],
  candidateIds: number[] = [],
  jobTitleIds: number[] = []

Given('the user is logged into the system', () => {
  cy.login()
})

Given('there is a candidate with status Shortlisted', () => {
  cy.fixture('recruitment-page-mock').then((recruitmentData) => {
    recruitmentMockData = recruitmentData
    cy.fixture('employee-page-mock').then((employeeData) => {
      const employeeInfo = { ...employeeData }

      PIMPageHelper.createEmployeeViaAPI(employeeInfo).then((empRes) => {
        const empNumber = empRes.body.data.empNumber.toString()
        employeeIds.push(Number(empNumber))
        interviewerData = empRes.body.data

        RecruitmentPageHelper.addJobTitle(recruitmentMockData).then((jobTitleRes) => {
          const jobTitleId = jobTitleRes.body.data.id
          jobTitleIds.push(jobTitleId)

          RecruitmentPageHelper.addVacancy(recruitmentMockData, empNumber, jobTitleId).then((vacancyRes) => {
            vacancyData = vacancyRes.body.data
            vacancyIds.push(vacancyData.id)

            RecruitmentPageHelper.addCandidate(recruitmentMockData, vacancyData.id).then((candidateRes) => {
              candidateData = candidateRes.body.data
              candidateIds.push(candidateData.id)

              RecruitmentPageHelper.updateCandidateStatusToShortlisted([candidateData.id])
              candidateTableRowData = {
                [RECRUITMENT_CANDIDATE_TABLE_HEADERS.STATUS]: recruitmentMockData.candidateStatus,
                [RECRUITMENT_CANDIDATE_TABLE_HEADERS.VACANCY]: vacancyData.name,
                [RECRUITMENT_CANDIDATE_TABLE_HEADERS.CANDIDATE]: `${candidateData.firstName}  ${candidateData.lastName}`
              }
            })
          })
        })
      })
    })
  })
})

When('the user schedules an interview', () => {
  RecruitmentPage.goToRecruitmentPage()
  RecruitmentPage.clickEyeIconForShortlistedCandidate(candidateTableRowData)
  RecruitmentPage.scheduleInterview()
  RecruitmentPage.fillInterviewInfo(recruitmentMockData, interviewerData)
  RecruitmentPage.verifyInterviewScheduled()
})

When('marks the interview as Mark Interview Passed', () => {
  RecruitmentPage.markInterviewPassed()
})

When('offers the candidate a job', () => {
  RecruitmentPage.offerJob()
})

When('marks the job offer as Declined', () => {
  RecruitmentPage.offerDecline()
})

When('rejects the candidate', () => {
  RecruitmentPage.rejectCandidate()
})

Then('the candidate status should be Rejected', () => {
  RecruitmentPage.verifyInterviewRejected()
})

After(() => {
  RecruitmentPageHelper.deleteVacancies(vacancyIds)
  RecruitmentPageHelper.deleteCandidates(candidateIds)
  RecruitmentPageHelper.deleteJobTitles(jobTitleIds)
  PIMPageHelper.deleteUsers(employeeIds)
})
