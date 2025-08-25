import { ITimeSheet } from '../types/timeSheet'
import { CommonHelper } from './common-helper'
import { HTTP_METHODS } from './constants'

const timeBaseURL = `/web/index.php/api/v2/time`
const URLs = {
  customers: `${timeBaseURL}/customers`,
  projects: `${timeBaseURL}/projects`,
  project: `project`,
  activities: `activities`
}

class TimePageHelper {
  /**
   * create new customer
   * @param {ITimeSheet} timeSheetData
   * @returns
   */
  static createCustomer(timeSheetData: ITimeSheet) {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.customers, {
      name: timeSheetData.customerName,
      description: timeSheetData.customerDescription
    })
  }

  /**
   * create new project
   * @param {number} customerId
   * @param {ITimeSheet} timeSheetData
   * @returns
   */
  static createProject(customerId: number, timeSheetData: ITimeSheet) {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.projects, {
      name: timeSheetData.projectName,
      description: timeSheetData.projectDescription,
      customerId,
      projectAdminsEmpNumbers: []
    })
  }

  /**
   * create activity for created project
   * @param {number} projectId
   * @param {string} name
   * @returns
   */
  static createActivityForProject(projectId: number, name: string) {
    return CommonHelper.sendAPIRequest(
      HTTP_METHODS.POST,
      `${timeBaseURL}/${URLs.project}/${projectId}/${URLs.activities}`,
      {
        name
      }
    )
  }

  /**
   * delete created customer
   * @param {number} customerIds
   */
  static deleteCustomers(customerIds: number[]) {
    CommonHelper.cleanup(URLs.customers, customerIds)
  }

  /**
   * delete created project
   * @param {number} projectIds
   */
  static deleteProjects(projectIds: number[]) {
    CommonHelper.cleanup(URLs.projects, projectIds)
  }
}
export { TimePageHelper }
