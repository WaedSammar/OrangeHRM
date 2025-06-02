import { ElementHandler } from '../element-handler'
import { APIsHelper } from '../helpers/apis-helpers'
import CommonHelper from '../helpers/common-helper'
import { PAGES } from '../helpers/constants'

class MyInfo {
  /**
   * go to info page
   */
  static goToMyInfoPage() {
    const verifyEmployeeInfo = CommonHelper.generateRandomString(7, 'employeeInfo')
    APIsHelper.interceptGetEmployeeDetailsRequest(verifyEmployeeInfo)
    ElementHandler.clickMenuItem(PAGES.MY_INFO)
    APIsHelper.waitForApiResponse(verifyEmployeeInfo)
  }
}
export { MyInfo }
