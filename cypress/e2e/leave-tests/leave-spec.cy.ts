import { LeavePageHelper } from '../../support/helpers/leave-page-helper'
import { PIMPageHelper } from '../../support/helpers/pim-page-helper'
import { IEmployeeInfo } from '../../support/types/employee'
import { ILeave } from '../../support/types/leave'

describe('Leave page test cases', () => {
  let leavePageInfo: ILeave, employeeMockData: IEmployeeInfo, employeeInfo: IEmployeeInfo
  let employeeIds: number[] = []
  let leaveTypeIds: number[] = []
  let entitlementIds: number[] = []

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

    cy.login()
    PIMPageHelper.createEmployeeViaAPI(employeeInfo).then((response) => {
      const empNumber = response.body.data.empNumber
      employeeIds.push(empNumber)

      PIMPageHelper.createUserViaAPI(employeeInfo, empNumber).then(() => {
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

  it('Validate schedule status after admin approval', () => {})

  afterEach(() => {
    PIMPageHelper.deleteUsers(employeeIds)
    LeavePageHelper.deleteLeaveType(leaveTypeIds)
  })
})
