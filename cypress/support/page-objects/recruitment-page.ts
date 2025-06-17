import { COMMON_LOCATORS, ElementHandler } from '../element-handler'
import { COMMON_BUTTONS, PAGES } from '../helpers/constants'

enum LABELS {
  STATUS = 'Status'
}

class RecruitmentPage {
  private static LOCATORS = {
    eyeIcon: '.bi-eye-fill'
  }
  
  /**
   * go to Recruitment Page
   */
  static goToRecruitmentPage() {
    ElementHandler.clickMenuItem(PAGES.RECRUITMENT)
  }

  /**
   * select status to search for
   * @param {string} statusOption
   */
  static selectStatus(statusOption: string = 'Shortlisted') {
    ElementHandler.selectDropdownByLabel(LABELS.STATUS, statusOption)
  }

  /**
   * click add button
   */
  static clickSearchBtn() {
    ElementHandler.clickButton(COMMON_BUTTONS.SEARCH)
  }

  /**
   * open shortListed candidate details
   */
  static openShortlistedDetails() {
    ElementHandler.getHeaderIndex('Status').then((statusIndex) => {
      cy.get(COMMON_LOCATORS.table)
        .find(COMMON_LOCATORS.tableCard)
        .each(($row) => {
          const statusText = $row.find(COMMON_LOCATORS.cell).eq(statusIndex).text().trim()
          if (statusText === 'Shortlisted') {
            cy.wrap($row).find(this.LOCATORS.eyeIcon).click()
            return false
          }
        })
    })
  }
}
export { RecruitmentPage }
