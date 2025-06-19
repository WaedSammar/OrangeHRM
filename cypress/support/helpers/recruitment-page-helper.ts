import { IRecruitmentFormData } from '../types/recruitmentFormData'
import CommonHelper from './common-helper'
import { HTTP_METHODS } from './constants'

const URLs = {
  vacancy: '/web/index.php/api/v2/recruitment/vacancies',
  candidate: '/web/index.php/api/v2/recruitment/candidates',
  candidateStatus: `/web/index.php/api/v2/recruitment/candidates`,
  jobTitle: `/web/index.php/api/v2/admin/job-titles`
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
      description: 'Created for QA automation',
      note: 'Added by me'
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
    CommonHelper.sendAPIRequest(HTTP_METHODS.PUT, `${URLs.candidateStatus}/${candidateId}/shortlist`)
  }
}
export { RecruitmentPageHelper }
