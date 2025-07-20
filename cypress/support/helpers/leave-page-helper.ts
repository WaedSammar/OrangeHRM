import { DATE_UNIT, DATE_FORMAT } from '../../support/helpers/constants'
import { ILeaveRequestData } from '../types/leave'
import { CommonHelper } from './common-helper'
import { HTTP_METHODS } from './constants'
import { LeaveInitializer } from '../initializers/leave-page/leave-page-initializer'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrBefore)

const leaveBaseURL = '/web/index.php/api/v2/leave'
const URLs = {
  leaveType: `${leaveBaseURL}/leave-types`,
  leavePeriod: `${leaveBaseURL}/leave-period`,
  entitlements: `${leaveBaseURL}/leave-entitlements`,
  leaveRequest: `${leaveBaseURL}/leave-requests`,
  employeeRequest: `${leaveBaseURL}/employees/leave-requests`,
  holidaysFromDate: `${leaveBaseURL}/holidays?fromDate=`,
  holidaysToDate: `&toDate=`
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
   * get business days without holidays
   * @param {string} fromDate
   * @param {string} toDate
   * @returns
   */
  static getBusinessDays(fromDate: string, toDate: string) {
    return CommonHelper.sendAPIRequest(
      HTTP_METHODS.GET,
      `${URLs.holidaysFromDate}${fromDate}${URLs.holidaysToDate}${toDate}`
    ).then((response) => {
      const holidays: string[] = response.body.data.map(({ date }) => date)
      let businessDays = 0
      let fromData = dayjs(fromDate)
      const endDate = dayjs(toDate)

      while (fromData.isSameOrBefore(endDate)) {
        const isWeekend = [0, 6].includes(fromData.day())
        const isHoliday = holidays.includes(fromData.format(DATE_FORMAT.DEFAULT))
        if (!isWeekend && !isHoliday) {
          businessDays++
        }
        fromData = fromData.add(1, DATE_UNIT.DAY)
      }
      return businessDays
    })
  }

  /**
   * get leave status with correct number of days
   * @param {string} leaveStatus
   * @param {string} fromDate
   * @param {string} toDate
   * @returns
   */
  static getLeaveStatusString(leaveStatus: string, fromDate: string, toDate: string) {
    return this.getBusinessDays(fromDate, toDate).then((dayCount) => {
      return `${leaveStatus} (${dayCount.toFixed(2)})`
    })
  }

  /**
   * add new leave type
   * @param {ILeaveRequestData} leavePageInfo
   * @returns
   */
  static addLeaveType(leavePageInfo: ILeaveRequestData) {
    const payload = LeaveInitializer.initializerAddLeaveType(leavePageInfo)
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
    const payload = LeaveInitializer.initializerSelectLeavePeriod(leavePageInfo)
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
    const payload = LeaveInitializer.initializerAddEntitlements(leavePageInfo, empNumber, leaveTypeId)
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
    const payload = LeaveInitializer.initializerApplyLeaveRequest(leavePageInfo, leaveTypeId)
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
