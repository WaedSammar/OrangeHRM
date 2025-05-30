import { ElementHandler } from "../element-handler";
import CommonHelper from "../helpers/common-helper";
import { HTTP_METHODS, PAGES } from "../helpers/constants";

enum LABELS {
  NAME = "Name",
  USERNAME = "Username",
}

enum BUTTONS {
  NATIONALITIES = "Nationalities",
  ADD = "Add",
  SEARCH = "Search",
  DELETE = " Yes, Delete ",
}

const URLs = {
  nationality: `/web/index.php/api/v2/admin/nationalities`,
  limit: `?limit=500`,
  users: `/web/index.php/api/v2/admin/users`,
};

class AdminPage {
  private static LOCATORS = {
    nationalityTab: ".oxd-topbar-body-nav-tab-item",
    searchBtn: ".oxd-button.oxd-button--secondary",
    trashIcon: ".oxd-icon.bi-trash",
  };

  /**
   * go to admin page
   */
  static goToAdminPage() {
    ElementHandler.clickMenuItem(PAGES.ADMIN);
  }

  /**
   * click on nationalities tab
   */
  static clickNationalities() {
    cy.get(this.LOCATORS.nationalityTab)
      .contains(BUTTONS.NATIONALITIES)
      .click();
  }

  /**
   * click add button
   */
  static clickAddBtn() {
    ElementHandler.clickButton(BUTTONS.ADD);
  }

  /**
   * add new nationality
   * @param {string} nationality
   */
  static addNationality(nationality: string) {
    ElementHandler.findInputByLabel(LABELS.NAME).type(nationality);
  }

  /**
   * get nationality made prev
   * @returns
   */
  static getNationality() {
    return CommonHelper.sendAPIRequest(
      HTTP_METHODS.GET,
      `${URLs.nationality}${URLs.limit}`
    );
  }

  /**
   * search about created username
   * @param {string} username
   */
  static searchOnCreatedUsername(username: string) {
    ElementHandler.findInputByLabel(LABELS.USERNAME).type(username);
    ElementHandler.clickButton(BUTTONS.SEARCH);
  }

  /**
   * delete created user
   */
  static deleteCreatedUsername() {
    cy.get(this.LOCATORS.trashIcon).click();
    ElementHandler.clickButton(BUTTONS.DELETE);
  }

  /**
   * delete created nationality
   * @param {number} id
   */
  static deleteNationality(id: number) {
    CommonHelper.sendAPIRequest(
      HTTP_METHODS.DELETE,
      URLs.nationality,
      {
        ids: [String(id)],
      },
      {
        "Content-Type": "application/json",
      }
    );
  }
}
export { AdminPage };
