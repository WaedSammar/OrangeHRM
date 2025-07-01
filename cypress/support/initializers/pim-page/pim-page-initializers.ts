import { UserRole } from '../../helpers/pim-page-helper'
import { IEmployeeInfo } from '../../types/employee.types'
import { faker } from '@faker-js/faker'

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

  static generateMinimalEmployeePayload() {
    const payload = {
      firstName: faker.person.firstName(),
      middleName: faker.person.middleName(),
      lastName: faker.person.lastName(),
      employeeId: faker.number.int({ min: 1000, max: 9999 }).toString()
    }
    return payload
  }

  static generateUserPayload() {
    const payload = {
      username: faker.internet.username(),
      password: faker.internet.password({ prefix: 'jo12' }),
      status: true,
      userRoleId: UserRole.ESS
    }
    return payload
  }
}

export { PIMInitializer }
