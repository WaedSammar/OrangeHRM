import dayjs from 'dayjs'
import { faker } from '@faker-js/faker'
import { IRecruitmentFormData } from '../../types/recruitmentFormData'
import { CHANGE_DATE_FORMAT } from '../pim-page/pim-page-initializer'

class RecruitmentInitializer {
  /**
   * create initializer for adding job title
   * @param {IRecruitmentFormData} recruitmentMockData
   * @returns
   */
  static initializerAddJobTitle(recruitmentMockData: IRecruitmentFormData) {
    const payload = {
      title: recruitmentMockData.jobTitleName || faker.person.jobTitle(),
      description: recruitmentMockData.jobDescription || faker.lorem.sentence(),
      note: recruitmentMockData.jobNote || faker.lorem.sentence()
    }
    return payload
  }

  /**
   * create initializer for adding vacancy
   * @param {IRecruitmentFormData} recruitmentMockData
   * @param {number} empNumber
   * @param {number} jobTitleId
   * @returns
   */
  static initializerAddVacancy(recruitmentMockData: IRecruitmentFormData, empNumber: number, jobTitleId: number) {
    const payload = {
      name: recruitmentMockData.vacancyName || `Vacancy for ${faker.person.jobTitle()}`,
      jobTitleId,
      employeeId: empNumber,
      status: recruitmentMockData.vacancyStatus || true,
      isPublished: recruitmentMockData.vacancyPublished || true
    }
    return payload
  }

  /**
   * create initializer for adding job candidate
   * @param {IRecruitmentFormData} recruitmentMockData
   * @param {number} vacancyId
   * @returns
   */
  static initializerAddCandidate(recruitmentMockData: IRecruitmentFormData, vacancyId: number) {
    const payload = {
      firstName: recruitmentMockData.candidateFirstName || faker.person.firstName(),
      lastName: recruitmentMockData.candidateLastName || faker.person.lastName(),
      email: recruitmentMockData.candidateEmail || faker.internet.email(),
      vacancyId
    }
    return payload
  }

  /**
   * create initializer for schedule interview
   * @param {IRecruitmentFormData} recruitmentMockData
   * @param {number[]} interviewerEmpNumbers
   * @returns
   */
  static initializerScheduleInterview(recruitmentMockData: IRecruitmentFormData, interviewerEmpNumbers: number[]) {
    const payload = {
      interviewName: recruitmentMockData.interviewTitle || `${faker.person.jobTitle()} interview`,
      interviewerEmpNumbers,
      interviewDate: recruitmentMockData.interviewDate || CHANGE_DATE_FORMAT(faker.date.soon({ days: 7 })),
      interviewTime: recruitmentMockData.interviewTime || dayjs(faker.date.future()).format('HH:mm'),
      note: recruitmentMockData.jobNote || faker.lorem.sentence()
    }
    return payload
  }
}

export { RecruitmentInitializer }
