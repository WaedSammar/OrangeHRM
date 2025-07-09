import { AdminPageHelper } from '../../support/helpers/admin-page-helper'
import { APIsHelper } from '../../support/helpers/apis-helpers'
import { CommonHelper } from '../../support/helpers/common-helper'
import { SEPARATORS } from '../../support/helpers/constants'
import { PIMPageHelper } from '../../support/helpers/pim-page-helper'
import { MyInfo } from '../../support/page-objects/my-info-page'
import { PIM_TABLE_HEADERS, PIMPage } from '../../support/page-objects/pim-page'
import { IEmployeeInfo } from '../../support/types/employee'

describe('Employee management - Add and Save Test Cases', () => {
  let employeeMockData: IEmployeeInfo, employeeInfo: IEmployeeInfo, nationalityId: number

  before(() => {
    cy.fixture('employee-page-mock').then((addEmployeeData) => {
      employeeMockData = addEmployeeData

      cy.login()
      AdminPageHelper.addNationality(employeeMockData.newNationality)
      AdminPageHelper.getNationality().then((res) => {
        const added = res.body.data.find(({ name }) => name === employeeMockData.newNationality)
        nationalityId = added.id
      })
      cy.logout()
    })
  })

  beforeEach(() => {
    cy.login()

    employeeInfo = {
      ...employeeMockData,
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

    cy.logout()
    cy.login(employeeInfo.userName, employeeInfo.password)
    MyInfo.goToMyInfoPage()
    PIMPage.verifyEmployeeInfo(employeeInfo)
  })

  it('Adding a new employee via API', () => {
    PIMPageHelper.createEmployeeViaAPI(employeeInfo).then((response) => {
      const empNumber = response.body.data.empNumber

      PIMPageHelper.createUserViaAPI(employeeInfo, empNumber).then(({ credentials }) => {
        PIMPageHelper.updateEmployeeDetailsViaAPI(employeeInfo, empNumber).then(() => {
          PIMPageHelper.updateEmployeeCustomFieldsViaAPI(employeeInfo, empNumber).then(() => {
            cy.logout()
            cy.login(credentials.username, credentials.password)
            MyInfo.goToMyInfoPage()
            PIMPage.verifyEmployeeInfo(employeeInfo)
          })
        })
      })
    })
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

    cy.logout()
    cy.login(employeeInfo.userName, employeeInfo.password)
    MyInfo.goToMyInfoPage()
    PIMPage.downloadUploadedFile()
    PIMPage.verifyUploadedFile()
    PIMPage.verifyEmployeeInfo(employeeInfo)
  })

  it('Verify added employee appears in the table', () => {
    PIMPageHelper.createEmployeeViaAPI(employeeInfo).then((response) => {
      const empNumber = response.body.data.empNumber

      PIMPageHelper.createUserViaAPI(employeeInfo, empNumber).then(() => {
        PIMPageHelper.updateEmployeeDetailsViaAPI(employeeInfo, empNumber).then(() => {
          PIMPageHelper.updateEmployeeCustomFieldsViaAPI(employeeInfo, empNumber).then(() => {
            PIMPage.goToPIMPage()
            const data = {
              [PIM_TABLE_HEADERS.ID]: employeeInfo.employeeId,
              [PIM_TABLE_HEADERS.FIRST_AND_MIDDLE_NAME]: `${employeeInfo.firstName} ${employeeInfo.middleName}`,
              [PIM_TABLE_HEADERS.LAST_NAME]: employeeInfo.lastName,
              [PIM_TABLE_HEADERS.JOB_TITLE]: SEPARATORS.EMPTY
            }
            PIMPage.verifyEmployeeInTable(data)
          })
        })
      })
    })
  })

  afterEach(() => {
    cy.logout()
    cy.login()
    PIMPageHelper.getEmpNumberByEmployeeId(employeeInfo.employeeId).then((empNumber) => {
      PIMPageHelper.deleteUsers([empNumber!])
    })
  })

  after(() => {
    AdminPageHelper.deleteNationalities([nationalityId])
  })
})
