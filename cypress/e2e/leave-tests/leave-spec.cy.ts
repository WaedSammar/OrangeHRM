import dayjs from 'dayjs'
import { DATE_FORMAT, DATE_UNIT, ElementHandler } from '../../support/element-handler'
import { LeavePageHelper } from '../../support/helpers/leave-page-helper'
import { PIMPageHelper } from '../../support/helpers/pim-page-helper'
import { LEAVE_TABLE_HEADERS, LeavePage } from '../../support/page-objects/leave-page'
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

    leavePageInfo.leaveRequestFromData = dayjs().add(5, DATE_UNIT.DAY).format(DATE_FORMAT.DEFAULT)
    leavePageInfo.leaveRequestEndData = dayjs().add(10, DATE_UNIT.DAY).format(DATE_FORMAT.DEFAULT)

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

  it('Validate schedule status after admin approval', () => {
    ElementHandler.logout()
    cy.login(employeeInfo.userName, employeeInfo.password)

    LeavePageHelper.applyLeaveRequest(leavePageInfo, leaveTypeIds[0]).then((response) => {
      const requestId = response.body.data.id

      ElementHandler.logout()
      cy.login()

      LeavePageHelper.approveLeaveRequest(leavePageInfo, requestId).then(() => {
        ElementHandler.logout()
        cy.login(employeeInfo.userName, employeeInfo.password)

        LeavePage.goToLeavePage()
        const data = {
          [LEAVE_TABLE_HEADERS.EMPLOYEE_NAME]: `${employeeInfo.firstName} ${employeeInfo.middleName} ${employeeInfo.lastName}`,
          [LEAVE_TABLE_HEADERS.STATUS]: leavePageInfo.leaveStatus
        }
        ElementHandler.validateTableRow(data)
      })
    })
  })

  afterEach(() => {
    ElementHandler.logout()
    cy.login()
    PIMPageHelper.deleteUsers(employeeIds)
    LeavePageHelper.deleteLeaveType(leaveTypeIds)
  })
})
