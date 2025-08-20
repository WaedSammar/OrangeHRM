import { ElementHandler } from '../element-handler'
import { COMMON_BUTTONS, PAGES } from '../helpers/constants'

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
   * save button
   * @param index
   */
  static clickSave() {
    ElementHandler.clickSave()
  }
}
export { AdminPage }
