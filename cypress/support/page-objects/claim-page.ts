import { ElementHandler } from '../element-handler'
import { PAGES, COMMON_BUTTONS } from '../helpers/constants'
import { IClaimRequest } from '../types/claim'
import { IClaimRequestDataTableRowData } from '../types/claimTableRowData'

export enum CLAIM_TABLE_HEADERS {
  REFERENCE_ID = 'Reference Id',
  EMPLOYEE_NAME = 'Employee Name',
  EVENT_NAME = 'Event Name',
  DESCRIPTION = 'Description',
  CURRENCY = 'Currency',
  SUBMITTED_DATE = 'Submitted Date',
  STATUS = 'Status',
  AMOUNT = 'Amount',
  ACTIONS = 'Actions'
}

enum LABELS {
  EVENT = 'Event',
  CURRENCY = 'Currency',
  EXPENSE_TYPE = 'Expense Type',
  AMOUNT = 'Amount'
}

class ClaimPage {
  private static LOCATORS = {
    clickBtn: 'button[type="button"]'
  }

  /**
   * go to claim page
   */
  static goToClaimPage() {
    ElementHandler.clickMenuItem(PAGES.CLAIM)
  }

  /**
   * click to submit claim
   */
  static clickSubmitBtn() {
    ElementHandler.clickButton(COMMON_BUTTONS.SUBMIT)
  }

  /**
   * select event type
   * @param {string} eventType
   */
  static selectEventType(eventType: string) {
    ElementHandler.selectDropdownByLabel(LABELS.EVENT, eventType)
  }

  /**
   * select currency type
   * @param {string} currencyType
   */
  static selectCurrencyType(currencyType: string) {
    ElementHandler.selectDropdownByLabel(LABELS.CURRENCY, currencyType)
  }

  /**
   * click to create claim
   */
  static clickCreateBtn() {
    ElementHandler.clickButton(COMMON_BUTTONS.CREATE)
  }

  /**
   * click add to create expense
   */
  static clickAddBtn() {
    ElementHandler.clickButton(COMMON_BUTTONS.ADD)
  }

  /**
   * select currency type
   * @param {string} name
   */
  static selectExpenseType(name: string) {
    ElementHandler.selectDropdownByLabel(LABELS.EXPENSE_TYPE, name)
  }

  /**
   * select expense date
   * @param {string} date
   */
  static selectEExpenseDate(date: string) {
    ElementHandler.selectDate(date)
  }

  /**
   * select expense amount
   * @param {string} amount
   */
  static selectExpenseAmount(amount: string) {
    ElementHandler.clearAndFill(LABELS.AMOUNT, amount)
  }

  /**
   * save expense information
   */
  static saveAddedExpenseInfo() {
    ElementHandler.clickSave(0, COMMON_BUTTONS.SAVE)
  }

  /**
   * add expense
   * @param {IClaimRequest} claimPageInfo
   */
  static addExpense(claimPageInfo: IClaimRequest) {
    this.clickAddBtn()
    this.selectExpenseType(claimPageInfo.expenseTypeName)
    this.selectEExpenseDate(claimPageInfo.expenseDate)
    this.selectExpenseAmount(claimPageInfo.expenseAmount)
    this.saveAddedExpenseInfo()
  }

  /**
   * click allow action in table
   * @param data
   */
  static clickAllowAction(data: IClaimRequestDataTableRowData) {
    ElementHandler.clickActionIconInRow(data, this.LOCATORS.clickBtn)
  }

  /**
   * approve the request
   */
  static clickApprove() {
    ElementHandler.clickButton(COMMON_BUTTONS.APPROVE)
  }

  static verifyInfoInClaimTable(claimPageInfo: IClaimRequestDataTableRowData) {
    ElementHandler.validateTableRow(claimPageInfo) 
  }
}
export { ClaimPage }
