import { COMMON_URLs } from '../element-handler'
import { GENDER } from '../page-objects/pim-page'
import { IEmployeeInfo } from '../types/employee.types'
import CommonHelper from './common-helper'
import { HTTP_METHODS } from './constants'

const URLs = {
  employees: `/web/index.php/api/v2/pim/employees`,
  personalDetails: `personal-details`,
  customField: `custom-fields`
}

enum UserRole {
  ADMIN = 1,
  ESS = 2
}

const GenderMap: Record<GENDER, number> = {
  [GENDER.MALE]: 1,
  [GENDER.FEMALE]: 2
}

class PIMPageHelper {
  /**
   * create employee basic via API
   * @param {IEmployeeInfo} employeeInfo
   * @returns - API response
   */
  static createEmployeeViaAPI(employeeInfo: IEmployeeInfo) {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.employees, {
      firstName: employeeInfo.firstName,
      middleName: employeeInfo.middleName,
      lastName: employeeInfo.lastName,
      employeeId: employeeInfo.employeeId
    })
  }

  /**
   * add username and password for the employee
   * @param {IEmployeeInfo} employeeInfo
   * @param {number} empNumber
   */
  static createUserViaAPI(employeeInfo: IEmployeeInfo, empNumber: number) {
    CommonHelper.sendAPIRequest(HTTP_METHODS.POST, COMMON_URLs.users, {
      username: employeeInfo.userName,
      password: employeeInfo.password,
      status: employeeInfo.status,
      userRoleId: UserRole.ESS,
      empNumber
    })
  }

  /**
   * update employee personal details
   * @param {IEmployeeInfo} employeeInfo
   * @param {number} empNumber
   */
  static updateEmployeeDetailsViaAPI(employeeInfo: IEmployeeInfo, empNumber: number) {
    const url = `${URLs.employees}/${empNumber}/${URLs.personalDetails}`
    CommonHelper.sendAPIRequest(HTTP_METHODS.PUT, url, {
      firstName: employeeInfo.firstName,
      middleName: employeeInfo.middleName,
      lastName: employeeInfo.lastName,
      employeeId: employeeInfo.employeeId,
      otherId: employeeInfo.otherId,
      drivingLicenseNo: employeeInfo.licenseNum,
      drivingLicenseExpiredDate: employeeInfo.expDate,
      birthday: employeeInfo.dateOfBirth,
      gender: GenderMap[employeeInfo.gender],
      maritalStatus: employeeInfo.maritalState,
      nationalityId: employeeInfo.nationalityId
    })
  }

  /**
   * update employee custom field
   * @param {IEmployeeInfo} employeeInfo
   * @param {number} empNumber
   */
  static updateEmployeeCustomFieldsViaAPI(employeeInfo: IEmployeeInfo, empNumber: number) {
    const url = `${URLs.employees}/${empNumber}/${URLs.customField}`
    CommonHelper.sendAPIRequest(HTTP_METHODS.PUT, url, {
      custom1: employeeInfo.bloodType,
      custom2: employeeInfo.testField
    })
  }

  /**
   * delete created user
   * @param {number} empNumber
   */
  static deleteUser(empNumber: number) {
    CommonHelper.sendAPIRequest(HTTP_METHODS.DELETE, URLs.employees, {
      ids: [empNumber]
    })
  }
}
export { PIMPageHelper }
