import { HTML_TAGS } from "./helpers/constants";

const LOCATORS = {
  menuBtn: "span.oxd-main-menu-item--name",
  menuItems: "span.oxd-main-menu-item--name",
  dropDownList: ".oxd-userdropdown-name",
};

class ElementHandler {
  /**
   * click on the selected page
   * @param {string} label - label name
   */
  static clickMenuItem(label: string) {
    cy.get(LOCATORS.menuItems).contains(label).click();
  }

  /**
   * click on buttons
   * @param {string} label - name of button needed
   */
  static clickButton(label: string) {
    cy.get(HTML_TAGS.button).contains(label).click();
  }

  /**
   * get input using label
   * @param {string} labelText - label for input box
   * @returns - label user want
   */
  static findInputByLabel(labelText: string) {
    return cy.contains("label", labelText).parent().next().find("input");
  }

  /**
   * clear the written and type the required text
   * @param {string} label
   * @param {string} text
   */
  static clearAndFill(label: string, text: string) {
    this.findInputByLabel(label).clear().type(text);
  }

  /**
   * type value for given field
   * @param {string} selector
   * @param {string} value
   */
  static typeIntoField(selector: string, value: string) {
    cy.get(selector).type(value);
  }

  /**
   * get the value for given field
   * @param {string} className
   * @returns
   */
  static getFieldValue(className: string) {
    return cy.get(className).invoke("val");
  }

  /**
   * logout from current user
   */
  static logout() {
    cy.get(LOCATORS.dropDownList).click();
    cy.contains("Logout").click();
  }
}
export { ElementHandler };
