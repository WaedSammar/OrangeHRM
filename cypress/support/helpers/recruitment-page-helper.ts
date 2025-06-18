import { IInterviewFormData } from '../types/interviewFormData'
import CommonHelper from './common-helper'
import { HTTP_METHODS } from './constants'

const URLs = {
  vacancy: '/web/index.php/api/v2/recruitment/vacancies',
  candidate: '/web/index.php/api/v2/recruitment/candidates'
}

class RecruitmentPageHelper {
  /**
   * add new vacancy
   * @param candidatesMockData 
   * @param empNumber 
   * @returns 
   */
  static addVacancy(candidatesMockData: IInterviewFormData, empNumber: number) {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.vacancy, {
      name: candidatesMockData.vacancyName,
      jobTitleId: candidatesMockData.jobTitleId, // QA Lead
      employeeId: empNumber,
      status: true,
      isPublished: true
    })
  }

  /**
   * add new candidate
   * @param candidatesMockData 
   * @param vacancyId 
   * @returns 
   */
  static addCandidate(candidatesMockData: IInterviewFormData, vacancyId: number) {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.candidate, {
      firstName: candidatesMockData.candidatesFirstName,
      lastName: candidatesMockData.candidatesLastName,
      email: candidatesMockData.candidatesEmail,
      vacancyId
    })
  }
}
export { RecruitmentPageHelper }
