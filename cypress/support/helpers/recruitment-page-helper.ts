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
  SHORTLISTED = 'Shortlist',
  PASSED = 'Mark Interview Passed',
  FAILED = 'Mark Interview Failed',
  OFFER_JOB = 'Offer Job'
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
   * @param {IRecruitmentFormData} recruitmentMockData
   * @param {number} empNumber
   * @param {number} jobTitleId
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
   * @param {IRecruitmentFormData} recruitmentMockData
   * @param {number} vacancyId
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
   * update Candidates status to shortlist
   * @param {number} candidateId
   * @returns
   */
  static updateCandidateStatus(candidateId: number[], status: string) {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.PUT, `${URLs.candidate}/${candidateId}/${status}`)
  }

  /**
   * change candidate status to shortlisted
   * @param {number} candidateId
   */
  static updateCandidateStatusToShortlisted(candidateId: number[]) {
    return this.updateCandidateStatus(candidateId, URLs.shortlist)
  }

  /**
   * delete vacancy
   * @param {number[]} vacancyIds
   */
  static deleteVacancies(vacancyIds: number[]) {
    CommonHelper.cleanup(URLs.vacancy, vacancyIds)
  }

  /**
   * delete candidate
   * @param {number[]} candidateIds
   */
  static deleteCandidates(candidateIds: number[]) {
    CommonHelper.cleanup(URLs.candidate, candidateIds)
  }

  /**
   * delete job title
   * @param {number []} jobTitleIds
   */
  static deleteJobTitles(jobTitleIds: number[]) {
    CommonHelper.cleanup(URLs.jobTitle, jobTitleIds)
  }

  /**
   * schedule interview via api
   * @param {IRecruitmentFormData} recruitmentMockData
   * @param {number[]} interviewerEmpNumbers
   * @param {number[]} candidateIds
   */
  static scheduleInterview(
    recruitmentMockData: IRecruitmentFormData,
    interviewerEmpNumbers: number[],
    candidateIds: number[]
  ) {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, `${URLs.candidate}/${candidateIds}/${URLs.scheduleInterview}`, {
      interviewName: recruitmentMockData.interviewTitle,
      interviewerEmpNumbers,
      interviewDate: recruitmentMockData.interviewDate,
      interviewTime: recruitmentMockData.interviewTime,
      note: recruitmentMockData.jobNote
    })
  }
}

export { RecruitmentPageHelper, ALLOWED_ACTIONS }
