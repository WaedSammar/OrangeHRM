import { UserRole } from '../../helpers/pim-page-helper'
import { GENDER } from '../../page-objects/pim-page'
import { IEmployeeInfo } from '../../types/employee.types'
import { faker } from '@faker-js/faker'

const GenderMap: Record<GENDER, number> = {
  [GENDER.MALE]: 1,
  [GENDER.FEMALE]: 2
}
class PIMInitializer {
  static initializerEmployeePayload(employeeData: IEmployeeInfo) {
    const {
      empNumber,
      expDate,
      nationality,
      nationalityId,
      maritalState,
      dateOfBirth,
      bloodType,
      status,
      newNationality
    } = employeeData
    const payload = {
      firstName: faker.person.firstName(),
      middleName: faker.person.middleName(),
      lastName: faker.person.lastName(),
      employeeId: faker.number.int({ min: 1000, max: 9999 }).toString(),
      empNumber,
      userName: faker.internet.username(),
      password: faker.internet.password({ prefix: 'jo12' }),
      otherId: faker.string.alphanumeric(3),
      licenseNum: `j${faker.number.int({ min: 100, max: 999 })}`,
      expDate,
      nationality,
      nationalityId,
      maritalState,
      dateOfBirth,
      gender: faker.person.sexType() === 'male' ? 'Male' : 'Female',
      bloodType,
      testField: faker.number.int({ min: 1, max: 99 }).toString(),
      status,
      newNationality
    }
    return payload
  }

  static generateEmployeePayload() {
    const payload = {
      firstName: faker.person.firstName(),
      middleName: faker.person.middleName(),
      lastName: faker.person.lastName(),
      employeeId: faker.number.int({ min: 1000, max: 9999 }).toString()
    }
    return payload
  }

  static initializerUserPayload(employeeData: IEmployeeInfo) {
    const payload = {
      username: employeeData.userName || faker.internet.username(),
      password: employeeData.password || faker.internet.password({ prefix: 'yo12' }),
      status: true,
      userRoleId: UserRole.ESS
    }
    return payload
  }

  static initializerUpdatedDetailsPayload(employeeData: IEmployeeInfo) {
    const payload = {
      firstName: faker.person.firstName(),
      middleName: faker.person.middleName(),
      lastName: faker.person.lastName(),
      employeeId: faker.number.int({ min: 1000, max: 9999 }).toString(),
      otherId: faker.string.alphanumeric(3),
      drivingLicenseNo: faker.number.int({ min: 100, max: 999 }).toString(),
      drivingLicenseExpiredDate: employeeData.expDate,
      birthday: employeeData.dateOfBirth,
      gender: GenderMap[employeeData.gender],
      maritalStatus: employeeData.maritalState,
      nationalityId: employeeData.nationalityId
    }
    return payload
  }

  static initializerCustomFieldPayload(employeeData: IEmployeeInfo) {
    const payload = { custom1: employeeData.bloodType, custom2: faker.number.int({ min: 1, max: 99 }).toString() }
    return payload
  }
}

export { PIMInitializer }
