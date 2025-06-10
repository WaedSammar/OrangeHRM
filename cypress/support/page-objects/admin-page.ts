import { COMMON_LOCATORS, ElementHandler } from '../element-handler'
import { COMMON_BUTTONS, PAGES } from '../helpers/constants'

enum BUTTONS {
  NATIONALITIES = 'Nationalities',
  DELETE = ' Yes, Delete '
}

class AdminPage {

  /**
   * go to admin page
   */
  static goToAdminPage() {
    ElementHandler.clickMenuItem(PAGES.ADMIN)
  }
  
  /**
   * click add button
   */
  static clickAddBtn() {
    ElementHandler.clickButton(COMMON_BUTTONS.ADD)
  }

  /**
   * delete created user
   */
  static deleteCreatedUsername() {
    cy.get(COMMON_LOCATORS.trashIcon).click()
    ElementHandler.clickButton(BUTTONS.DELETE)
  }

  /**
   * save button
   * @param index
   */
  static clickSave(index: number = 0, buttonText: string = 'Save') {
    ElementHandler.clickSave(index, buttonText)
  }
}
export { AdminPage }
