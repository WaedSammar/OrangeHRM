import { CommonHelper } from './common-helper'
import { HTTP_METHODS } from './constants'

const timeBaseURL = `/web/index.php/api/v2/time`
const URLs = {
  customers: `${timeBaseURL}/customers`,
  projects: `${timeBaseURL}/projects`
}

class TimePageHelper {
  static createCustomer(timeSheetData: any) {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.customers, {
      name: timeSheetData.customerName,
      description: timeSheetData.customerDescription
    })
  }

  static createProject(customerId: number, timeSheetData: any) {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.projects, {
      name: timeSheetData.projectName,
      description: timeSheetData.projectDescription,
      customerId,
      projectAdminsEmpNumbers: []
    })
  }
}
export { TimePageHelper }
