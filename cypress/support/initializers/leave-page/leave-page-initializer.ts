import { faker } from '@faker-js/faker/.'
import { ILeaveRequestData } from '../../types/leave'
import { CHANGE_DATE_FORMAT } from '../pim-page/pim-page-initializer'

class LeaveInitializer {
  /**
   * create initializer for adding leave type
   * @param {ILeaveRequestData} leavePageInfo
   * @returns
   */
  static InitializerAddLeaveType(leavePageInfo: ILeaveRequestData) {
    const payload = {
      name: `${leavePageInfo.leaveTypeName} ${Date.now()}` || `${faker.word.adjective()} Leave`,
      situational: leavePageInfo.leaveSituational ?? faker.datatype.boolean()
    }
    return payload
  }

  /**
   * Initializer for select leave period
   * @param leavePageInfo
   * @returns
   */
  static InitializerSelectLeavePeriod(leavePageInfo: ILeaveRequestData) {
    const payload = {
      startDay: leavePageInfo.leavePerStartedDay || faker.number.int({ min: 1, max: 28 }),
      startMonth: leavePageInfo.leavePerStartedMonth || faker.number.int({ min: 1, max: 12 })
    }
    return payload
  }

  /**
   * Initializer for add entitlements
   * @param {ILeaveRequestData} leavePageInfo
   * @param {number} empNumber
   * @param {number} leaveTypeId
   * @returns
   */
  static InitializerAddEntitlements(leavePageInfo: ILeaveRequestData, empNumber: number, leaveTypeId: number) {
    const payload = {
      empNumber,
      entitlement: leavePageInfo.entitlementDuration || faker.number.int({ min: 1, max: 30 }),
      fromDate: leavePageInfo.entitlementFromDate || CHANGE_DATE_FORMAT(faker.date.future()),
      leaveTypeId,
      toDate: leavePageInfo.entitlementEndDate || CHANGE_DATE_FORMAT(faker.date.future())
    }
    return payload
  }

  /**
   * Initializer for apply leave  request
   * @param {ILeaveRequestData} leavePageInfo
   * @param {number} leaveTypeId
   * @returns
   */
  static InitializerApplyLeaveRequest(leavePageInfo: ILeaveRequestData, leaveTypeId: number) {
    const payload = {
      comment: leavePageInfo.leaveRequestComment || faker.lorem.sentence(),
      fromDate: leavePageInfo.leaveRequestFromDate || CHANGE_DATE_FORMAT(faker.date.future()),
      leaveTypeId,
      toDate: leavePageInfo.leaveRequestEndDate || CHANGE_DATE_FORMAT(faker.date.future())
    }
    return payload
  }
}
export { LeaveInitializer }
