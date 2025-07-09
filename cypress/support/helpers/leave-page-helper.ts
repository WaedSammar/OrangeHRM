import dayjs from 'dayjs'
import { DATE_UNIT, DATE_FORMAT } from '../../support/helpers/constants'
import { ILeaveRequestData } from '../types/leave'
import { CommonHelper } from './common-helper'
import { HTTP_METHODS } from './constants'
import { LeaveInitializer } from '../initializers/leave-page/leave-page-initializer'

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
   * @param {ILeaveRequestData} leavePageInfo
   * @returns
   */
  static addLeaveType(leavePageInfo: ILeaveRequestData) {
    const payload = LeaveInitializer.InitializerAddLeaveType(leavePageInfo)
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.leaveType, payload).then((response) => {
      return response
    })
  }

  /**
   * select leave period
   * @param {ILeaveRequestData} leavePageInfo
   * @returns
   */
  static selectLeavePeriod(leavePageInfo: ILeaveRequestData) {
    const payload = LeaveInitializer.InitializerSelectLeavePeriod(leavePageInfo)
    return CommonHelper.sendAPIRequest(HTTP_METHODS.PUT, URLs.leavePeriod, payload).then((response) => {
      return response
    })
  }

  /**
   * add entitlements
   * @param {ILeaveRequestData} leavePageInfo
   * @param {number} empNumber
   * @param {number} leaveTypeId
   * @returns
   */
  static addEntitlements(leavePageInfo: ILeaveRequestData, empNumber: number, leaveTypeId: number) {
    const payload = LeaveInitializer.InitializerAddEntitlements(leavePageInfo, empNumber, leaveTypeId)
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.entitlements, payload).then((response) => {
      return response
    })
  }

  /**
   * apply leave request
   * @param {ILeaveRequestData} leavePageInfo
   * @param {number} leaveTypeId
   * @returns
   */
  static applyLeaveRequest(leavePageInfo: ILeaveRequestData, leaveTypeId: number) {
    const payload = LeaveInitializer.InitializerApplyLeaveRequest(leavePageInfo, leaveTypeId)
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.leaveRequest, payload).then((response) => {
      return response
    })
  }

  /**
   * approve leave request by admin
   * @param {ILeaveRequestData} leavePageInfo
   * @param {number} requestId
   * @returns
   */
  static approveLeaveRequest(leavePageInfo: ILeaveRequestData, requestId: number) {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.PUT, `${URLs.employeeRequest}/${requestId}`, {
      action: leavePageInfo.leaveRequestStatus
    })
  }

  /**
   * delete added leave type
   * @param {ILeaveRequestData} leaveTypeIds
   * @returns
   */
  static deleteLeaveType(leaveTypeIds: number[]) {
    return CommonHelper.cleanup(URLs.leaveType, leaveTypeIds)
  }
}
export { LeavePageHelper }
