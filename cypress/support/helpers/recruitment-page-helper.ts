import { IEmployeeInfo } from '../types/employee.types'
import { IRecruitmentFormData } from '../types/recruitmentFormData'
import CommonHelper from './common-helper'
import { HTTP_METHODS } from './constants'

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
   * * add new vacancy
   * @param recruitmentMockData
   * @param empNumber
   * @param jobTitleId 
   * @returns 
   */
  static addVacancy(recruitmentMockData: IRecruitmentFormData, empNumber: number, jobTitleId: number) {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.vacancy, {
      name: recruitmentMockData.vacancyName,
      jobTitleId,
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
   * @param {ALLOWED_ACTIONS[]} expectedActions
   * @param {number} candidateId
   */
  static checkAllowedActions(expectedActions: ALLOWED_ACTIONS[], candidateId: number) {
    CommonHelper.sendAPIRequest(HTTP_METHODS.GET, `${URLs.candidate}/${candidateId}/${URLs.allowedActions}`).then(
      (res) => {
        const allowedActions = res.body.data.map((action: { label: string }) => action.label)
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
   * @param {number[]} vacancyIds
   */
  static deleteVacancy(vacancyIds: number[]) {
    CommonHelper.sendAPIRequest(HTTP_METHODS.DELETE, URLs.vacancy, {
      ids: [vacancyIds]
    })
  }

  /**
   * delete candidate
   * @param {number []} candidateIds
   */
  static deleteCandidate(candidateIds: number[]) {
    CommonHelper.sendAPIRequest(HTTP_METHODS.DELETE, URLs.candidate, {
      ids: [candidateIds]
    })
  }

  /**
   * delete job title
   * @param {number []} jobTitleIds
   */
  static deleteJobTitle(jobTitleIds: number[]) {
    CommonHelper.sendAPIRequest(HTTP_METHODS.DELETE, URLs.jobTitle, {
      ids: [jobTitleIds]
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
   * @param {number} candidateId
   */
  static verifyInterviewStatus(candidateId: number) {
    CommonHelper.sendAPIRequest(HTTP_METHODS.GET, `${URLs.candidate}/${candidateId}`).then((response) => {
      expect(response.body.data.status.label).to.eq(STATUS.INTERVIEW_STATUS)
    })
  }
}

export { RecruitmentPageHelper, ALLOWED_ACTIONS }
