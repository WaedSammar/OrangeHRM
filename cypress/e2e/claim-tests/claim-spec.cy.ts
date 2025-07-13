import { ClaimPageHelper } from '../../support/helpers/claim-page-helper'
import { PIMPageHelper } from '../../support/helpers/pim-page-helper'
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

  it('submit claim, add expense and approve it by admin', () => {})

  afterEach(() => {
    cy.logout()
    cy.login()
    PIMPageHelper.deleteUsers(employeeIds)
    ClaimPageHelper.deleteEventType(eventIds)
    ClaimPageHelper.deleteExpenseType(expenseIds)
  })
})
