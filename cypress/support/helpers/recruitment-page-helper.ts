import { IInterviewFormData } from '../types/interviewFormData'
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
  static addJobTitle(recruitmentMockData: IInterviewFormData) {
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
  static addVacancy(recruitmentMockData: IInterviewFormData, empNumber: number) {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.vacancy, {
      name: recruitmentMockData.vacancyName,
      jobTitleId: recruitmentMockData.jobTitleId, // QA Lead
      employeeId: empNumber,
      status: true,
      isPublished: true
    })
  }

  /**
   * add new candidate
   * @param recruitmentMockData
   * @param vacancyId
   * @returns
   */
  static addCandidate(recruitmentMockData: IInterviewFormData, vacancyId: number) {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.candidate, {
      firstName: recruitmentMockData.candidatesFirstName,
      lastName: recruitmentMockData.candidatesLastName,
      email: recruitmentMockData.candidatesEmail,
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
