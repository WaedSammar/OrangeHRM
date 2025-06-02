import { ElementHandler } from '../../support/element-handler'
import { AdminPageHelper } from '../../support/helpers/admin-page-helper'
import { APIsHelper } from '../../support/helpers/apis-helpers'
import CommonHelper from '../../support/helpers/common-helper'
import { PIMPageHelper } from '../../support/helpers/pim-page-helper'
import { AdminPage } from '../../support/page-objects/admin-page'
import { MyInfo } from '../../support/page-objects/my-info-page'
import { PIMPage } from '../../support/page-objects/pim-page'
import { IEmployeeInfo } from '../../support/types/employee.types'

describe('Employee management - Add and Save Test Cases', () => {
  let employeeMockData: IEmployeeInfo, employeeInfo: IEmployeeInfo, nationalityId: number

  before(() => {
    cy.fixture('employee-page-mock').then((addEmployeeData) => {
      employeeMockData = addEmployeeData

      cy.login()
      AdminPage.goToAdminPage()
      AdminPage.clickNationalities()
      AdminPage.clickAddBtn()
      AdminPage.addNationality(employeeMockData.newNationality)

      const createLoadNationality = CommonHelper.generateRandomString(9, 'loadNationality')
      APIsHelper.interceptNationalities(createLoadNationality)
      AdminPage.clickSave()
      APIsHelper.waitForApiResponse(createLoadNationality)

      AdminPageHelper.getNationality().then((res) => {
        const added = res.body.data.find(({ name }) => name === employeeMockData.newNationality)
        nationalityId = added.id
      })
      ElementHandler.logout()
    })
  })

  beforeEach(() => {
    cy.login()

    const randomNum = CommonHelper.generateRandomNumber()
    employeeInfo = {
      ...employeeMockData,
      employeeId: `${employeeMockData.employeeId}${randomNum}`,
      userName: `${employeeMockData.userName}${randomNum}`,
      nationality: employeeMockData.newNationality,
      nationalityId
    }
  })

  it('Adding a new employee, saving information and verifying it', () => {
    PIMPage.goToPIMPage()
    PIMPage.clickAddBtn()
    PIMPage.fillEmployeeInfo(employeeInfo)

    const createLoadPersonalDetails = CommonHelper.generateRandomString(7, 'loadPersonalDetails')
    APIsHelper.interceptGetEmployeeDetailsRequest(createLoadPersonalDetails)
    PIMPage.clickSave()
    APIsHelper.waitForApiResponse(createLoadPersonalDetails)

    PIMPage.fillPersonalDetails(employeeInfo)
    PIMPage.clickSave()
    PIMPage.fillAdditionalEmployeeDetails(employeeInfo)
    PIMPage.clickSave(1)

    ElementHandler.logout()
    cy.login(employeeInfo.userName, employeeInfo.password)
    MyInfo.goToMyInfoPage()
    PIMPage.verifyEmployeeInfo(employeeInfo)
  })

  it('Adding a new employee via API', () => {
    PIMPageHelper.createEmployeeViaAPI(employeeInfo).then((response) => {
      const empNumber = response.body.data.empNumber
      PIMPageHelper.createUserViaAPI(employeeInfo, empNumber)
      PIMPageHelper.updateEmployeeDetailsViaAPI(employeeInfo, empNumber)
      PIMPageHelper.updateEmployeeCustomFieldsViaAPI(employeeInfo, empNumber)
    })
    ElementHandler.logout()
    cy.login(employeeInfo.userName, employeeInfo.password)
    MyInfo.goToMyInfoPage()
    PIMPage.verifyEmployeeInfo(employeeInfo)
  })

  it('Adding a new employee, upload attachment and verify it', () => {
    PIMPage.goToPIMPage()
    PIMPage.clickAddBtn()
    PIMPage.fillEmployeeInfo(employeeInfo)

    const createLoadPersonalDetailsPage = CommonHelper.generateRandomString(7, 'loadPersonalDetailsPage')
    APIsHelper.interceptGetEmployeeDetailsRequest(createLoadPersonalDetailsPage)
    PIMPage.clickSave()
    APIsHelper.waitForApiResponse(createLoadPersonalDetailsPage)

    PIMPage.fillPersonalDetails(employeeInfo)
    PIMPage.clickSave()
    PIMPage.fillAdditionalEmployeeDetails(employeeInfo)
    PIMPage.clickSave(1)
    PIMPage.uploadAttachment()
    PIMPage.clickSave(2)

    ElementHandler.logout()
    cy.login(employeeInfo.userName, employeeInfo.password)
    MyInfo.goToMyInfoPage()
    PIMPage.downloadUploadedFile()
    PIMPage.verifyUploadedFile()
    PIMPage.verifyEmployeeInfo(employeeInfo)
  })

  it.only('Adding a new employee via UI and verify from table with pagination', () => {
    PIMPageHelper.createEmployeeViaAPI(employeeInfo).then((res) => {
      const empNumber = res.body.data.empNumber
      PIMPageHelper.createUserViaAPI(employeeInfo, empNumber)
      PIMPageHelper.updateEmployeeDetailsViaAPI(employeeInfo, empNumber)
      PIMPageHelper.updateEmployeeCustomFieldsViaAPI(employeeInfo, empNumber)

      PIMPageHelper.searchEmployeeInPaginatedList(employeeInfo).then((foundEmployee) => {
        PIMPage.goToPIMPage()
        PIMPage.verifyEmployeeInTable(employeeInfo, foundEmployee)
      })
    })
  })

  afterEach(() => {
    ElementHandler.logout()
    cy.login()
    AdminPage.goToAdminPage()
    AdminPageHelper.deleteUserByUsername(employeeInfo.userName)
  })

  after(() => {
    AdminPage.clickNationalities()
    AdminPageHelper.deleteNationalities([nationalityId])
  })
})
