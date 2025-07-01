import { COMMON_URLs } from '../element-handler'
import { PIMInitializer } from '../initializers/pim-page/pim-page-initializers'
import { IEmployeeInfo } from '../types/employee.types'
import CommonHelper from './common-helper'
import { HTTP_METHODS } from './constants'

const URLs = {
  employees: `/web/index.php/api/v2/pim/employees`,
  personalDetails: `personal-details`,
  customField: `custom-fields`
}

export enum UserRole {
  ADMIN = 1,
  ESS = 2
}

class PIMPageHelper {
  /**
   * create employee basic via API
   * @param {IEmployeeInfo} employeeInfo
   * @returns
   */
  static createEmployeeViaAPI(employeeInfo: IEmployeeInfo) {
    const payload = PIMInitializer.initializerEmployeePayload()
    Object.assign(employeeInfo, payload)
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.employees, payload).then((response) => {
      response
    })
  }

  /**
   * add username and password for the employee
   * @param {IEmployeeInfo} employeeInfo
   * @param {number} empNumber
   * @returns
   */
  static createUserViaAPI(employeeInfo: IEmployeeInfo, empNumber: number) {
    const payload = PIMInitializer.initializerUserPayload()
    employeeInfo.userName = payload.username
    employeeInfo.password = payload.password
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, COMMON_URLs.users, {
      ...payload,
      empNumber
    }).then((response) => {
      response
    })
  }

  /**
   * update employee personal details
   * @param {IEmployeeInfo} employeeInfo
   * @param {number} empNumber
   */
  static updateEmployeeDetailsViaAPI(employeeInfo: IEmployeeInfo, empNumber: number) {
    const payload = PIMInitializer.initializerUpdatedDetailsPayload(employeeInfo)
    const url = `${URLs.employees}/${empNumber}/${URLs.personalDetails}`
    CommonHelper.sendAPIRequest(HTTP_METHODS.PUT, url, payload)
  }

  /**
   * update employee custom field
   * @param {IEmployeeInfo} employeeInfo
   * @param {number} empNumber
   */
  static updateEmployeeCustomFieldsViaAPI(employeeInfo: IEmployeeInfo, empNumber: number) {
    const payload = PIMInitializer.initializerCustomFieldPayload(employeeInfo)
    const url = `${URLs.employees}/${empNumber}/${URLs.customField}`
    CommonHelper.sendAPIRequest(HTTP_METHODS.PUT, url, payload)
  }

  /**
   * delete created user
   * @param {number []} empNumbers
   */
  static deleteUsers(empNumbers: number[]) {
    return CommonHelper.cleanup(URLs.employees, empNumbers)
  }
}
export { PIMPageHelper }
