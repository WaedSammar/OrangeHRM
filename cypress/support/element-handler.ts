import { HTML_TAGS } from "./helpers/constants"

const LOCATORS = {
  loaderIcon: ".oxd-loading-spinner"
}

class ElementHandler {

  /**
   * wait for the loader to be hidden
   */
  static waitLoaderToBeHidden() {
    cy.get(HTML_TAGS.body, { timeout: 10000 })
      .within(($body) => {
        if (!$body.find(LOCATORS.loaderIcon).length) {
          cy.get(LOCATORS.loaderIcon, { timeout: 10000 })
            .should("not.exist");
        }
      })
  }

}
export { ElementHandler };