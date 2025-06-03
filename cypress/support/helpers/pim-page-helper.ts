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
   * search on employee at the lists
   * @param {IEmployeeInfo} employeeInfo
   * @returns
   */
  static searchEmployeeInPaginatedList(employeeInfo: IEmployeeInfo) {
    const limit = 50
    let foundEmployee = null

    const searchEmployee = () => {
      for (let offset = 0; offset < 500; offset += limit) {
        cy.request({
          method: HTTP_METHODS.GET,
          url: `${URLs.employees}?limit=${limit}&offset=${offset}`
        }).then((res) => {
          expect(res.status).to.eq(200)
          const match = res.body.data.find(
            (emp) =>
              emp.firstName === employeeInfo.firstName &&
              emp.middleName === employeeInfo.middleName &&
              emp.lastName === employeeInfo.lastName &&
              emp.employeeId === employeeInfo.employeeId
          )
          if (match) {
            foundEmployee = match
            return false
          }
        })
      }
    }
    return cy
      .wrap(null)
      .then(() => {
        searchEmployee()
      })
      .then(() => {
        return foundEmployee
      })
  }
}
export { PIMPageHelper }
