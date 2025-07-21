import { ClaimInitializer } from '../initializers/claim-page/claim-page-initializer'
import { IClaimRequest } from '../types/claim'
import { CommonHelper } from './common-helper'
import { HTTP_METHODS } from './constants'

const claimBaseURL = `/web/index.php/api/v2/claim`
const URLs = {
  eventType: `${claimBaseURL}/events`,
  expenseType: `${claimBaseURL}/expenses/types`,
  expenseRequest: `${claimBaseURL}/requests`
}

class ClaimPageHelper {
  /**
   * crate event type
   * @param {IClaimRequest} claimPageInfo
   * @returns
   */
  static createEventType(claimPageInfo: IClaimRequest) {
    const payload = ClaimInitializer.initializerEventType(claimPageInfo)
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.eventType, payload)
  }

  /**
   * create expense type
   * @param {IClaimRequest} claimPageInfo
   * @returns
   */
  static createExpenseType(claimPageInfo: IClaimRequest) {
    const payload = ClaimInitializer.initializerExpenseType(claimPageInfo)
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.expenseType, payload)
  }

  /**
   * delete created event type
   * @param {number []} eventIds
   */
  static deleteEventType(eventIds: number[]) {
    CommonHelper.cleanup(URLs.eventType, eventIds)
  }

  /**
   * delete created expense type
   * @param {number []} expenseIds
   */
  static deleteExpenseType(expenseIds: number[]) {
    CommonHelper.cleanup(URLs.expenseType, expenseIds)
  }
}
export { ClaimPageHelper }
