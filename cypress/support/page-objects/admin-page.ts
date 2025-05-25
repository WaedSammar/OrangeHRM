import { ElementHandler } from "../element-handler";
import CommonHelper from "../helpers/common-helper";
import { HTTP_METHODS, PAGES } from "../helpers/constants";

enum LABELS {
  NAME = "Name",
  USERNAME = "Username",
}

const URLs = {
  getNationality: `/web/index.php/api/v2/admin/nationalities?limit=1000`,
  deleteNationality: `/web/index.php/api/v2/admin/nationalities`,
};

class AdminPage {
  private static LOCATORS = {
    nationalityTab: ".oxd-topbar-body-nav-tab-item",
    searchBtn: ".oxd-button.oxd-button--secondary",
    trashIcon: ".oxd-icon.bi-trash"
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
  static clickNationality() {
    cy.get(this.LOCATORS.nationalityTab).contains("Nationalities").click();
  }

  /**
   * click add button
   */
  static clickAddBtn() {
    ElementHandler.clickButton("Add");
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
    return CommonHelper.sendAPIRequest(HTTP_METHODS.GET, URLs.getNationality);
  }

  /**
   * search about created username
   * @param {string} username
   */
  static searchOnCreatedUsername(username: string) {
    ElementHandler.findInputByLabel(LABELS.USERNAME).type(username);
    ElementHandler.clickButton("Search");
  }

  /**
   * delete created user
   */
  static deleteCreatedUsername() {
    cy.get(this.LOCATORS.trashIcon).click();
    ElementHandler.clickButton(" Yes, Delete ");
  }

  /**
   * delete created nationality
   * @param {number} id
   */
  static deleteNationality(id: number) {
    CommonHelper.sendAPIRequest(
      HTTP_METHODS.DELETE,
      URLs.deleteNationality,
      {
        ids: [String(id)],
      },
      {
        "Content-Type": "application/json",
      }
    );
    cy.reload();
  }
}
export { AdminPage };
