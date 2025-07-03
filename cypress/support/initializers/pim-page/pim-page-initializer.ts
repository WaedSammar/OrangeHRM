import dayjs from 'dayjs'
import { CommonHelper } from '../../helpers/common-helper'
import { UserRole } from '../../helpers/pim-page-helper'
import { BLOOD_TYPE, GENDER, MARITAL_STATUS } from '../../page-objects/pim-page'
import { IEmployeeInfo } from '../../types/employee'
import { faker } from '@faker-js/faker'

export const GenderMap: Record<GENDER, number> = {
  [GENDER.MALE]: 1,
  [GENDER.FEMALE]: 2
}

export const CHANGE_DATE_FORMAT = (date: Date): string => dayjs(date).format('YYYY-DD-MM')

class PIMInitializer {
  /**
   * initializer for create employee payload
   * @param {IEmployeeInfo} employeeData
   * @returns
   */
  static initializerEmployeePayload(employeeData: IEmployeeInfo) {
    const payload = {
      firstName: employeeData.firstName || faker.person.firstName(),
      middleName: employeeData.middleName || faker.person.middleName(),
      lastName: employeeData.lastName || faker.person.lastName(),
      employeeId: employeeData.employeeId || faker.number.int({ min: 1000, max: 9999 }).toString()
    }
    return payload
  }

  /**
   * initializer for create user payload
   * @param {IEmployeeInfo} employeeData
   * @returns
   */
  static initializerUserPayload(employeeData: IEmployeeInfo) {
    const payload = {
      username: employeeData.userName || faker.internet.username(),
      password: employeeData.password || faker.internet.password({ prefix: 'yo12' }),
      status: employeeData.status || faker.datatype.boolean(),
      userRoleId: UserRole.ESS
    }
    return payload
  }

  /**
   * initializer for updated details payload
   * @param {IEmployeeInfo} employeeData
   * @returns
   */
  static initializerUpdatedDetailsPayload(employeeData: IEmployeeInfo) {
    const payload = {
      firstName: employeeData.firstName || faker.person.firstName(),
      middleName: employeeData.middleName || faker.person.middleName(),
      lastName: employeeData.lastName || faker.person.lastName(),
      employeeId: employeeData.employeeId || faker.number.int({ min: 1000, max: 9999 }).toString(),
      otherId: employeeData.otherId || faker.string.alphanumeric(4),
      drivingLicenseNo: employeeData.licenseNum || faker.string.alphanumeric(6),
      birthday: employeeData.dateOfBirth || CHANGE_DATE_FORMAT(faker.date.birthdate()),
      drivingLicenseExpiredDate: employeeData.expDate || CHANGE_DATE_FORMAT(faker.date.future()),
      gender: GenderMap[employeeData.gender] || CommonHelper.getRandomEnum(GENDER),
      maritalStatus: employeeData.maritalState || CommonHelper.getRandomEnum(MARITAL_STATUS),
      nationalityId: employeeData.nationalityId
    }
    return payload
  }

  /**
   * initializer for custom field payload
   * @param {IEmployeeInfo} employeeData
   * @returns
   */
  static initializerCustomFieldPayload(employeeData: IEmployeeInfo) {
    const payload = {
      custom1: employeeData.bloodType || CommonHelper.getRandomEnum(BLOOD_TYPE),
      custom2: employeeData.testField || faker.number.int({ min: 100, max: 999 }).toString()
    }
    return payload
  }
}

export { PIMInitializer }
