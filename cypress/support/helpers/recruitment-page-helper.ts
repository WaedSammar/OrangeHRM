import { IRecruitmentFormData } from '../types/recruitmentFormData'
import CommonHelper from './common-helper'
import { HTTP_METHODS } from './constants'

const URLs = {
  vacancy: `/web/index.php/api/v2/recruitment/vacancies`,
  candidate: `/web/index.php/api/v2/recruitment/candidates`,
  jobTitle: `/web/index.php/api/v2/admin/job-titles`,
  shortlist: `shortlist`
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
}

export { RecruitmentPageHelper }
