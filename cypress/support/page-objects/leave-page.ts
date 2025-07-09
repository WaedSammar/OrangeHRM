import { ElementHandler } from '../element-handler'
import { PAGES } from '../helpers/constants'
import { ILeaveTableRowData } from '../types/leaveTableRow'

enum LEAVE_TABLE_HEADERS {
  DATE = 'Date',
  EMPLOYEE_NAME = 'Employee Name',
  LEAVE_TYPE = 'Leave Type',
  LEAVE_BALANCE = 'Leave Balance (Days)',
  NUMBER_OF_DAYS = 'Number of Days',
  STATUS = 'Status',
  COMMENTS = 'Comments'
}

class LeavePage {
  /**
   * go to leave page
   */
  static goToLeavePage() {
    ElementHandler.clickMenuItem(PAGES.LEAVE)
  }

  /**
   * verify leave request status in leave table
   * @param {ILeaveTableRowData} data
   */
  static verifyLeaveStatusInTable(data: ILeaveTableRowData) {
    ElementHandler.validateTableRow(data)
  }
}
export { LeavePage, LEAVE_TABLE_HEADERS }
