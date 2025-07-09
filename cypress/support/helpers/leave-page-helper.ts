import dayjs from 'dayjs'
import { DATE_UNIT, DATE_FORMAT } from '../../support/helpers/constants'
import { ILeave } from '../types/leave'
import { CommonHelper } from './common-helper'
import { HTTP_METHODS } from './constants'

const URLs = {
  leaveType: `/web/index.php/api/v2/leave/leave-types`,
  leavePeriod: `/web/index.php/api/v2/leave/leave-period`,
  entitlements: `/web/index.php/api/v2/leave/leave-entitlements`,
  leaveRequest: `/web/index.php/api/v2/leave/leave-requests`,
  employeeRequest: `/web/index.php/api/v2/leave/employees/leave-requests`
}

class LeavePageHelper {
  /**
   * generate future leave dates
   * @returns 
   */
  static generateFutureLeaveDates() {
    return {
      fromDate: dayjs().add(5, DATE_UNIT.DAY).format(DATE_FORMAT.DEFAULT),
      toDate: dayjs().add(10, DATE_UNIT.DAY).format(DATE_FORMAT.DEFAULT)
    }
  }

  /**
   * add new leave type
   * @param {ILeave} leavePageInfo
   * @returns
   */
  static addLeaveType(leavePageInfo: ILeave) {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.leaveType, {
      name: `${leavePageInfo.leaveTypeName} ${Date.now()}`,
      situational: false
    })
  }

  /**
   * select leave period
   * @param {ILeave} leavePageInfo
   * @returns
   */
  static selectLeavePeriod(leavePageInfo: ILeave) {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.PUT, URLs.leavePeriod, {
      startDay: leavePageInfo.leavePerStartedDay,
      startMonth: leavePageInfo.leavePerStartedMonth
    })
  }

  /**
   * add entitlements
   * @param {ILeave} leavePageInfo
   * @param {number} empNumber
   * @param {number} leaveTypeId
   * @returns
   */
  static addEntitlements(leavePageInfo: ILeave, empNumber: any, leaveTypeId: number) {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.entitlements, {
      empNumber,
      entitlement: leavePageInfo.entitlementDuration,
      fromDate: leavePageInfo.entitlementFromDate,
      leaveTypeId,
      toDate: leavePageInfo.entitlementEndDate
    })
  }

  /**
   * apply leave request
   * @param {ILeave} leavePageInfo
   * @param {number} leaveTypeId
   * @returns
   */
  static applyLeaveRequest(leavePageInfo: ILeave, leaveTypeId: number) {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.leaveRequest, {
      comment: leavePageInfo.leaveRequestComment,
      fromDate: leavePageInfo.leaveRequestFromDate,
      leaveTypeId,
      toDate: leavePageInfo.leaveRequestEndDate
    })
  }

  /**
   * approve leave request by admin
   * @param {ILeave} leavePageInfo
   * @param {number} requestId
   * @returns
   */
  static approveLeaveRequest(leavePageInfo: ILeave, requestId: number) {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.PUT, `${URLs.employeeRequest}/${requestId}`, {
      action: leavePageInfo.leaveRequestStatus
    })
  }

  /**
   * delete added leave type
   * @param {ILeave} leaveTypeIds
   * @returns
   */
  static deleteLeaveType(leaveTypeIds: number[]) {
    return CommonHelper.cleanup(URLs.leaveType, leaveTypeIds)
  }
}
export { LeavePageHelper }
