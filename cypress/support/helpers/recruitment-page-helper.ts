import { IEmployeeInfo } from '../types/employee.types'
import { IRecruitmentFormData } from '../types/recruitmentFormData'
import CommonHelper from './common-helper'
import { HTTP_METHODS } from './constants'
import { PIMPageHelper } from './pim-page-helper'

const URLs = {
  vacancy: `/web/index.php/api/v2/recruitment/vacancies`,
  candidate: `/web/index.php/api/v2/recruitment/candidates`,
  jobTitle: `/web/index.php/api/v2/admin/job-titles`,
  shortlist: `shortlist`,
  employee: `/web/index.php/api/v2/pim/employees`,
  allowedActions: `actions/allowed`,
  scheduleInterview: `shedule-interview`
}

enum STATUS {
  INTERVIEW_STATUS = 'Interview Scheduled'
}

enum ALLOWED_ACTIONS {
  SCHEDULE_INTERVIEW = 'Schedule Interview',
  REJECT = 'Reject',
  SHORTLISTED = 'Shortlist'
}

class RecruitmentPageHelper {
  /**
   * adding job title
   * @param recruitmentMockData
   * @returns
   */
  static addJobTitle(recruitmentMockData: IRecruitmentFormData) {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.jobTitle, {
      title: recruitmentMockData.jobTitleName,
      description: recruitmentMockData.jobDescription,
      note: recruitmentMockData.jobNote
    })
  }

  /**
   * add new vacancy
   * @param recruitmentMockData
   * @param empNumber
   * @returns
   */
  static addVacancy(recruitmentMockData: IRecruitmentFormData, empNumber: number) {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.vacancy, {
      name: recruitmentMockData.vacancyName,
      jobTitleId: recruitmentMockData.jobTitleId,
      employeeId: empNumber,
      status: recruitmentMockData.vacancyStatus,
      isPublished: recruitmentMockData.vacancyPublished
    })
  }

  /**
   * add new candidate
   * @param recruitmentMockData
   * @param vacancyId
   * @returns
   */
  static addCandidate(recruitmentMockData: IRecruitmentFormData, vacancyId: number) {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.candidate, {
      firstName: recruitmentMockData.candidateFirstName,
      lastName: recruitmentMockData.candidateLastName,
      email: recruitmentMockData.candidateEmail,
      vacancyId
    })
  }

  /**
   * check allowed actions
   * @param number candidateId
   * @returns
   */
  static checkAllowedActions(candidateId: number) {
    CommonHelper.sendAPIRequest(HTTP_METHODS.GET, `${URLs.candidate}/${candidateId}/${URLs.allowedActions}`).then(
      (res) => {
        const allowedActions = res.body.data.map((action: { label: string }) => action.label)
        const expectedActions = [ALLOWED_ACTIONS.REJECT, ALLOWED_ACTIONS.SCHEDULE_INTERVIEW]
        expectedActions.forEach((expectedLabel) => {
          expect(allowedActions).to.include(expectedLabel)
        })
      }
    )
  }

  /**
   * update Candidates status to shortlist
   * @param candidateId
   * @returns
   */
  static updateCandidateStatus(candidateId: number) {
    CommonHelper.sendAPIRequest(HTTP_METHODS.PUT, `${URLs.candidate}/${candidateId}/${URLs.shortlist}`)
  }

  /**
   * delete vacancy
   * @param {IRecruitmentFormData} recruitmentMockData
   */
  static deleteVacancy(recruitmentMockData: IRecruitmentFormData) {
    CommonHelper.sendAPIRequest(HTTP_METHODS.DELETE, URLs.vacancy, {
      ids: [recruitmentMockData.vacancyId]
    })
  }

  /**
   * delete candidate
   * @param {IRecruitmentFormData} recruitmentMockData
   */
  static deleteCandidate(recruitmentMockData: IRecruitmentFormData) {
    CommonHelper.sendAPIRequest(HTTP_METHODS.DELETE, URLs.candidate, {
      ids: [recruitmentMockData.candidateId]
    })
  }

  /**
   * delete job title
   * @param {IRecruitmentFormData} recruitmentMockData
   */
  static deleteJobTitle(recruitmentMockData: IRecruitmentFormData) {
    CommonHelper.sendAPIRequest(HTTP_METHODS.DELETE, URLs.jobTitle, {
      ids: [recruitmentMockData.jobTitleId]
    })
  }

  /**
   * adding employee, job title, vacancy and candidate via API
   * @param {IEmployeeInfo} employeeInfo
   * @param {IEmployeeInfo} employeeMockData
   * @param {IRecruitmentFormData} recruitmentMockData
   * @returns
   */
  static setupRecruitmentTest(
    employeeInfo: IEmployeeInfo,
    employeeMockData: IEmployeeInfo,
    recruitmentMockData: IRecruitmentFormData
  ): Cypress.Chainable<any> {
    return PIMPageHelper.createEmployeeViaAPI(employeeInfo).then((response) => {
      const empNumber = response.body.data.empNumber
      employeeMockData.empNumber = empNumber

      return RecruitmentPageHelper.addJobTitle(recruitmentMockData).then((jobTitleRes) => {
        const jobTitleId = jobTitleRes.body.data.id
        recruitmentMockData.jobTitleId = jobTitleId

        return RecruitmentPageHelper.addVacancy(recruitmentMockData, empNumber).then((vacancyRes) => {
          const vacancyId = vacancyRes.body.data.id
          recruitmentMockData.vacancyId = vacancyId

          return RecruitmentPageHelper.addCandidate(recruitmentMockData, vacancyId).then((candidateRes) => {
            const candidateId = candidateRes.body.data.id
            recruitmentMockData.candidateId = candidateId

            RecruitmentPageHelper.updateCandidateStatus(candidateId)
            RecruitmentPageHelper.checkAllowedActions(candidateId)
          })
        })
      })
    })
  }

  /**
   * schedule interview via api
   * @param {IRecruitmentFormData} recruitmentMockData
   * @param {IEmployeeInfo} employeeMockData
   */
  static scheduleInterview(recruitmentMockData: IRecruitmentFormData, employeeMockData: IEmployeeInfo) {
    CommonHelper.sendAPIRequest(
      HTTP_METHODS.POST,
      `${URLs.candidate}/${recruitmentMockData.candidateId}/${URLs.scheduleInterview}`,
      {
        interviewName: recruitmentMockData.interviewTitle,
        interviewerEmpNumbers: [employeeMockData.empNumber],
        interviewDate: recruitmentMockData.interviewDate,
        interviewTime: recruitmentMockData.interviewTime,
        note: recruitmentMockData.jobNote
      }
    )
  }

  /**
   * verify status of interview
   * @param {IRecruitmentFormData} recruitmentMockData 
   */
  static verifyInterviewStatus(recruitmentMockData: IRecruitmentFormData) {
    CommonHelper.sendAPIRequest(HTTP_METHODS.GET, `${URLs.candidate}/${recruitmentMockData.candidateId}`).then(
      (response) => {
        expect(response.body.data.status.label).to.eq(STATUS.INTERVIEW_STATUS)
      }
    )
  }
}

export { RecruitmentPageHelper }
