import { ClaimPageHelper } from '../../support/helpers/claim-page-helper'
import { PIMPageHelper } from '../../support/helpers/pim-page-helper'
import { CLAIM_TABLE_HEADERS, ClaimPage } from '../../support/page-objects/claim-page'
import { IClaimRequest } from '../../support/types/claim'
import { IEmployeeInfo } from '../../support/types/employee'

describe('Claim Page Test Cases', () => {
  let claimPageInfo: IClaimRequest, employeeMockData: IEmployeeInfo, employeeInfo: IEmployeeInfo
  let employeeIds: number[] = []
  let createdEmployeesMap: Record<string, IEmployeeInfo> = {}
  let credentialsList: { username: string; password: string }[] = []
  let eventIds: number[] = []
  let expenseIds: number[] = []

  before(() => {
    cy.fixture('employee-page-mock').then((addEmployeeData) => {
      employeeMockData = addEmployeeData
      employeeInfo = { ...employeeMockData }
    })
    cy.fixture('claim-page-mock').then((claimPageData) => {
      claimPageInfo = claimPageData
    })
  })

  beforeEach(() => {
    employeeIds = []
    eventIds = []
    expenseIds = []

    cy.login()
    PIMPageHelper.createEmployeeViaAPI(employeeInfo).then((response) => {
      const empNumber = response.body.data.empNumber.toString()
      employeeIds.push(Number(empNumber))
      createdEmployeesMap[empNumber] = response.body.data

      PIMPageHelper.createUserViaAPI(employeeInfo, empNumber).then(({ credentials }) => {
        credentialsList.push({
          username: credentials.username,
          password: credentials.password
        })
        ClaimPageHelper.createEventType(claimPageInfo).then((response) => {
          const eventId = response.body.data.id
          eventIds.push(eventId)

          ClaimPageHelper.createExpenseType(claimPageInfo).then((response) => {
            const expenseId = response.body.data.id
            expenseIds.push(expenseId)
          })
        })
      })
    })
  })

  it('submit claim, add expense and approve it by admin', () => {
    cy.logout()
    cy.login(credentialsList[0].username, credentialsList[0].password)

    ClaimPage.goToClaimPage()
    ClaimPage.clickSubmitBtn()
    ClaimPage.selectEventType(claimPageInfo.eventTypeName)
    ClaimPage.selectCurrencyType(claimPageInfo.currencyType)
    ClaimPage.clickCreateBtn()

    ClaimPage.addExpense(claimPageInfo)
    ClaimPage.clickSubmitBtn()

    cy.logout()
    cy.login()
    ClaimPage.goToClaimPage()
    const data = {
      [CLAIM_TABLE_HEADERS.EMPLOYEE_NAME]: `${employeeInfo.firstName} ${employeeInfo.lastName}`,
      [CLAIM_TABLE_HEADERS.EVENT_NAME]: claimPageInfo.eventTypeName,
      [CLAIM_TABLE_HEADERS.STATUS]: claimPageInfo.claimRequestStatus
    }
    ClaimPage.clickAllowAction(data)
    ClaimPage.clickApprove()
  })

  afterEach(() => {
    PIMPageHelper.deleteUsers(employeeIds)
    ClaimPageHelper.deleteEventType(eventIds)
    ClaimPageHelper.deleteExpenseType(expenseIds)
  })
})
