import { TimeInitializer } from '../initializers/time-page/time-page-initializer'
import { ITimeSheet } from '../types/timeSheet'
import { CommonHelper } from './common-helper'
import { HTTP_METHODS } from './constants'

const timeBaseURL = `/web/index.php/api/v2/time`
const URLs = {
  customers: `${timeBaseURL}/customers`,
  projects: `${timeBaseURL}/projects`
}

const URL_SEGMENTS = {
  project: 'project',
  activities: 'activities'
}

class TimePageHelper {
  /**
   * create new customer
   * @param {ITimeSheet} timeSheetData
   * @returns
   */
  static createCustomer(timeSheetData: ITimeSheet) {
    const payload = TimeInitializer.initializerCreateCustomer(timeSheetData)
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.customers, payload).then((response) => {
      return response
    })
  }

  /**
   * create new project
   * @param {number} customerId
   * @param {ITimeSheet} timeSheetData
   * @returns
   */
  static createProject(customerId: number, timeSheetData: ITimeSheet) {
    const payload = TimeInitializer.initializerCreateProject(timeSheetData, customerId)
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.projects, payload).then((response) => {
      return response
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
      `${timeBaseURL}/${URL_SEGMENTS.project}/${projectId}/${URL_SEGMENTS.activities}`,
      {
        name
      }
    )
  }

  /**
   * delete created customer
   * @param {number[]} customerIds
   */
  static deleteCustomers(customerIds: number[]) {
    CommonHelper.cleanup(URLs.customers, customerIds)
  }

  /**
   * delete created project
   * @param {number[]} projectIds
   */
  static deleteProjects(projectIds: number[]) {
    CommonHelper.cleanup(URLs.projects, projectIds)
  }
}
export { TimePageHelper }
