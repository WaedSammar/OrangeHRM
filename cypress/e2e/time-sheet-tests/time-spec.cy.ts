import { PIMPageHelper } from '../../support/helpers/pim-page-helper'
import { TimePageHelper } from '../../support/helpers/time-page-helper'
import { TimeSheetPage } from '../../support/page-objects/time-page'
import { IEmployeeInfo } from '../../support/types/employee'

describe('Time Sheet Test Cases', () => {
  let employeeMockData: IEmployeeInfo, employeeInfo: IEmployeeInfo, timeSheetMockData
  let employeeIds: number[] = []
  let customerIds: number[] = []
  let projectIds: number[] = []
  let createdEmployeesMap: Record<string, IEmployeeInfo> = {}
  let credentialsList: { username: string; password: string }[] = []

  before(() => {
    cy.fixture('employee-page-mock').then((addEmployeeData) => {
      employeeMockData = addEmployeeData
      employeeInfo = { ...employeeMockData }
    })
    cy.fixture('time-page-mock').then((timeSheetData) => {
      timeSheetMockData = timeSheetData
    })
  })

  beforeEach(() => {
    employeeIds = []
    customerIds = []
    projectIds = []

    cy.login()
    PIMPageHelper.createEmployeeViaAPI(employeeInfo).then((employeeResponse) => {
      const empNumber = employeeResponse.body.data.empNumber.toString()
      employeeIds.push(Number(empNumber))
      createdEmployeesMap[empNumber] = employeeResponse.body.data

      PIMPageHelper.createUserViaAPI(employeeInfo, empNumber).then(({ credentials }) => {
        credentialsList.push({
          username: credentials.username,
          password: credentials.password
        })

        TimePageHelper.createCustomer(timeSheetMockData).then((response) => {
          const customerId = response.body.data.id
          customerIds.push(customerId)

          TimePageHelper.createProject(customerId, timeSheetMockData).then((response) => {
            const projectId = response.body.data.id
            projectIds.push(projectId)

            TimePageHelper.createActivityForProject(projectId, timeSheetMockData.activityName).then(() => {})
          })
        })
      })
    })
  })

  it('Validate TimeSheet Submission by Employee and Approval by Admin', () => {
    cy.logout()
    cy.login(credentialsList[0].username, credentialsList[0].password)
    TimeSheetPage.goToTimePage()
    TimeSheetPage.createNewTimeSheet(timeSheetMockData)

    cy.logout()
    cy.login
  })

  afterEach(() => {
    PIMPageHelper.deleteUsers(employeeIds)
    TimePageHelper.deleteProjects(projectIds)
    TimePageHelper.deleteCustomers(customerIds)
  })
})
