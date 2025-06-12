import { HTML_TAGS, TIMEOUT } from './helpers/constants'
import { TableRowData } from './types/tableRowData.types'

const COMMON_LOCATORS = {
  menuBtn: 'span.oxd-main-menu-item--name',
  menuItems: 'span.oxd-main-menu-item--name',
  dropDownList: '.oxd-userdropdown-name',
  loaderIcon: '.oxd-loading-spinner',
  submitBtn: `${HTML_TAGS.button}[type='submit']`,
  downloadIcon: '.oxd-icon.bi-download',
  trashIcon: '.oxd-icon.bi-trash'
}

const COMMON_URLs = {
  nationalities: `/web/index.php/api/v2/admin/nationalities`,
  users: `/web/index.php/api/v2/admin/users`
}

enum DROP_DOWN {
  ABOUT = 'About',
  SUPPORT = 'Support',
  CHANGE_PASSWORD = 'Change Password',
  LOGOUT = 'Logout'
}

export enum PIM_TABLE_HEADERS {
  ID = 'Id',
  FIRST_AND_MIDDLE_NAME = 'First (& Middle) Name',
  LAST_NAME = 'Last Name',
  JOB_TITLE = 'Job Title'
}

class ElementHandler {
  private static LOCATORS = {
    table: '[role="table"]',
    columnHeader: '[role="columnheader"]',
    cell: '[role="cell"]',
    tableCard: '.oxd-table-card'
  }

  /**
   * wait for the loader to be hidden
   */
  static waitLoaderToBeHidden() {
    return new Cypress.Promise((resolve) => {
      cy.get(HTML_TAGS.body, { timeout: TIMEOUT.tenSec }).within(($body) => {
        if (!$body.find(COMMON_LOCATORS.loaderIcon).length) {
          cy.get(COMMON_LOCATORS.loaderIcon, { timeout: TIMEOUT.tenSec })
            .should('not.exist')
            .then(() => resolve())
        } else {
          resolve()
        }
      })
    })
  }

  /**
   * click on the selected page
   * @param {string} label - label name
   */
  static clickMenuItem(label: string) {
    cy.get(COMMON_LOCATORS.menuItems).contains(label).click()
  }

  /**
   * click on buttons
   * @param {string} label - name of button needed
   */
  static clickButton(label: string) {
    cy.get(HTML_TAGS.button).contains(label).click()
  }

  /**
   * get input using label
   * @param {string} labelText - label for input box
   * @returns - label user want
   */
  static findInputByLabel(labelText: string) {
    return cy.contains(HTML_TAGS.label, labelText).parent().next().find(HTML_TAGS.input)
  }

  /**
   * clear the written and type the required text
   * @param {string} label
   * @param {string} text
   */
  static clearAndFill(label: string, text: string) {
    this.findInputByLabel(label).clear().type(text)
  }

  /**
   * type value for given field
   * @param {string} selector
   * @param {string} value
   */
  static typeIntoField(selector: string, value: string) {
    cy.get(selector).type(value)
  }

  /**
   * get the value for given field
   * @param {string} className
   * @returns
   */
  static getFieldValue(className: string) {
    return cy.get(className).invoke('val')
  }

  /**
   * save information user entered
   * @param index
   */
  static clickSave(index: number = 0, buttonText: string) {
    cy.get(COMMON_LOCATORS.submitBtn).eq(index).click().contains(buttonText)
  }

  /**
   * logout from current user
   */
  static logout() {
    cy.get(COMMON_LOCATORS.dropDownList).click()
    cy.contains(DROP_DOWN.LOGOUT).click()
  }

  static getHeaderIndex(headerName: string) {
    return new Cypress.Promise<number>((resolve) => {
      cy.get(this.LOCATORS.table)
        .find(this.LOCATORS.columnHeader)
        .contains(headerName)
        .invoke('index')
        .then((index) => {
          resolve(index)
        })
    })
  }

  static validateTableRow(data: TableRowData) {
    const headers = Object.keys(data)
    const matchesPerColumn: { [key: string]: number[] } = {}

    headers.forEach((key) => {
      matchesPerColumn[key] = []

      this.getHeaderIndex(key).then((headerIndex) => {
        cy.get(this.LOCATORS.table)
          .find(this.LOCATORS.tableCard)
          .each(($row, rowIndex) => {
            cy.wrap($row)
              .find(this.LOCATORS.cell)
              .eq(headerIndex)
              .invoke('text')
              .then((text) => {
                if (text === data[key]) {
                  matchesPerColumn[key].push(rowIndex)
                }
              })
          })
      })
    })

    cy.then(() => {
      const matchingIndices = matchesPerColumn[headers[0]].filter((index) => {
        return headers.every((key) => matchesPerColumn[key].includes(index))
      })
      if (matchingIndices.length === 0) throw new Error('No matching rows found')
      if (matchingIndices.length > 1) throw new Error('Multiple matching rows found')

      const matchIndex = matchingIndices[0]

      cy.get(this.LOCATORS.table)
        .find(this.LOCATORS.tableCard)
        .eq(matchIndex)
        .find(this.LOCATORS.cell)
        .then(($cells) => {
          headers.forEach((key) => {
            this.getHeaderIndex(key).then((headerIndex) => {
              cy.wrap($cells).eq(headerIndex).should('have.text', data[key])
            })
          })
        })
    })
  }
}
export { ElementHandler, COMMON_LOCATORS, COMMON_URLs }
