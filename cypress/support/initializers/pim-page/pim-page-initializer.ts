import { UserRole } from '../../helpers/pim-page-helper'
import { GENDER } from '../../page-objects/pim-page'
import { IEmployeeInfo } from '../../types/employee.types'
import { faker } from '@faker-js/faker'

export const GenderMap: Record<GENDER, number> = {
  [GENDER.MALE]: 1,
  [GENDER.FEMALE]: 2
}

class PIMInitializer {
  /**
   * initializer for create employee payload
   * @returns
   */
  static initializerEmployeePayload() {
    const payload = {
      firstName: faker.person.firstName(),
      middleName: faker.person.middleName(),
      lastName: faker.person.lastName(),
      employeeId: faker.number.int({ min: 1000, max: 9999 }).toString()
    }
    return payload
  }

  /**
   * initializer for create user payload
   * @returns
   */
  static initializerUserPayload() {
    const payload = {
      username: faker.internet.username(),
      password: faker.internet.password({ prefix: 'yo12' }),
      status: true,
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
      firstName: employeeData.firstName,
      middleName: employeeData.middleName,
      lastName: employeeData.lastName,
      employeeId: employeeData.employeeId,
      otherId: employeeData.otherId,
      drivingLicenseNo: employeeData.licenseNum,
      drivingLicenseExpiredDate: employeeData.expDate,
      birthday: employeeData.dateOfBirth,
      gender: GenderMap[employeeData.gender],
      maritalStatus: employeeData.maritalState,
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
      custom1: employeeData.bloodType,
      custom2: employeeData.testField || faker.number.int({ min: 100, max: 999 }).toString()
    }
    return payload
  }
}

export { PIMInitializer }
