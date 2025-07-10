import { LeavePageHelper } from '../../support/helpers/leave-page-helper'
import { PIMPageHelper } from '../../support/helpers/pim-page-helper'
import { LEAVE_TABLE_HEADERS, LeavePage } from '../../support/page-objects/leave-page'
import { IEmployeeInfo } from '../../support/types/employee'
import { ILeaveRequestData } from '../../support/types/leave'

describe('Leave page test cases', () => {
  let leavePageInfo: ILeaveRequestData, employeeMockData: IEmployeeInfo, employeeInfo: IEmployeeInfo
  let employeeIds: number[] = []
  let leaveTypeIds: number[] = []
  let entitlementIds: number[] = []
  let credentialsList: { username: string; password: string }[] = []
  let createdEmployeesMap: Record<string, IEmployeeInfo> = {}

  before(() => {
    cy.fixture('leave-page-mock').then((leavePageData) => {
      leavePageInfo = leavePageData
    })
    cy.fixture('employee-page-mock').then((addEmployeeData) => {
      employeeMockData = addEmployeeData
      employeeInfo = { ...employeeMockData }
    })
  })

  beforeEach(() => {
    employeeIds = []
    leaveTypeIds = []
    entitlementIds = []

    const { fromDate, toDate } = LeavePageHelper.generateFutureLeaveDates()
    leavePageInfo.leaveRequestFromDate = fromDate
    leavePageInfo.leaveRequestEndDate = toDate

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
        LeavePageHelper.addLeaveType(leavePageInfo).then((response) => {
          const leaveId = response.body.data.id
          leaveTypeIds.push(leaveId)

          LeavePageHelper.selectLeavePeriod(leavePageInfo).then(() => {
            LeavePageHelper.addEntitlements(leavePageInfo, empNumber, leaveId).then((response) => {
              const entitlementId = response.body.data.id
              entitlementIds.push(entitlementId)
            })
          })
        })
      })
    })
  })

  it('Validate schedule status after admin approval', () => {
    cy.logout()
    cy.login(credentialsList[0].username, credentialsList[0].password)

    LeavePageHelper.applyLeaveRequest(leavePageInfo, leaveTypeIds[0]).then((response) => {
      const requestId = response.body.data.id
      cy.logout()
      cy.login()

      LeavePageHelper.approveLeaveRequest(leavePageInfo, requestId).then(() => {
        cy.logout()
        cy.login(credentialsList[0].username, credentialsList[0].password)

        LeavePage.goToLeavePage()
        const employeeData = createdEmployeesMap[employeeIds[0].toString()]
        const data = {
          [LEAVE_TABLE_HEADERS.EMPLOYEE_NAME]: `${employeeData.firstName} ${employeeData.middleName} ${employeeData.lastName}`,
          [LEAVE_TABLE_HEADERS.STATUS]: leavePageInfo.leaveStatus
        }
        LeavePage.verifyLeaveStatusInTable(data)
      })
    })
  })

  afterEach(() => {
    cy.logout()
    cy.login()
    PIMPageHelper.deleteUsers(employeeIds)
    LeavePageHelper.deleteLeaveType(leaveTypeIds)
  })
})
