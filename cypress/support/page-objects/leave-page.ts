import { COMMON_LOCATORS, ElementHandler } from '../element-handler'
import { PAGES } from '../helpers/constants'
import { ILeaveRequestDataTableRowData } from '../types/leaveTableRow'

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
   * @param {ILeaveRequestDataTableRowData} data
   */
  static verifyLeaveStatusInTable(data: ILeaveRequestDataTableRowData) {
    const expectedStatus = data[LEAVE_TABLE_HEADERS.STATUS]
    const dataWithoutStatus = { ...data }
    delete dataWithoutStatus[LEAVE_TABLE_HEADERS.STATUS]

    ElementHandler.getMatchingRowByData(dataWithoutStatus).then((matchIndex) => {
      cy.get(COMMON_LOCATORS.table)
        .find(COMMON_LOCATORS.tableCard)
        .eq(matchIndex)
        .find(COMMON_LOCATORS.cell)
        .then(($cells) => {
          ElementHandler.getHeaderIndex(LEAVE_TABLE_HEADERS.STATUS).then((statusIndex) => {
            const actualStatus = $cells.eq(statusIndex).text().trim()
            expect(actualStatus).to.include(expectedStatus)
          })
        })
    })
  }
}

export { LeavePage, LEAVE_TABLE_HEADERS }
