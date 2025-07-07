import { PIMInitializer } from '../initializers/pim-page/pim-page-initializer'
import { IEmployeeInfo } from '../types/employee'
import { COMMON_URLs } from './apis-helpers'
import { CommonHelper } from './common-helper'
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
   *
   * @param {IEmployeeInfo} employeeInfo
   * @returns
   */
  static createEmployeeViaAPI(employeeInfo: IEmployeeInfo) {
    const payload = PIMInitializer.initializerEmployeePayload(employeeInfo)
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.employees, payload).then((response) => {
      return response
    })
  }

  /**
   * add username and password for the employee
   * @param {IEmployeeInfo} employeeInfo
   * @param {number} empNumber
   * @returns
   */
  static createUserViaAPI(employeeInfo: IEmployeeInfo, empNumber: number) {
    const payload = PIMInitializer.initializerUserPayload(employeeInfo)
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, COMMON_URLs.users, {
      ...payload,
      empNumber
    }).then((response) => {
      return {
        response,
        credentials: {
          username: payload.username,
          password: payload.password
        }
      }
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
    return CommonHelper.sendAPIRequest(HTTP_METHODS.PUT, url, payload)
  }

  /**
   * update employee custom field
   * @param {IEmployeeInfo} employeeInfo
   * @param {number} empNumber
   */
  static updateEmployeeCustomFieldsViaAPI(employeeInfo: IEmployeeInfo, empNumber: number) {
    const payload = PIMInitializer.initializerCustomFieldPayload(employeeInfo)
    const url = `${URLs.employees}/${empNumber}/${URLs.customField}`
    return CommonHelper.sendAPIRequest(HTTP_METHODS.PUT, url, payload)
  }

  /**
   * get empNumber By EmployeeId
   * @param {string} employeeId
   * @returns
   */
  static getEmpNumberByEmployeeId(employeeId: string): Cypress.Chainable<number | null> {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.GET, URLs.employees).then((response) => {
      const employees = response.body.data
      const matchedEmployee = employees.find((emp) => emp.employeeId === employeeId)
      return matchedEmployee ? matchedEmployee.empNumber : null
    })
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
