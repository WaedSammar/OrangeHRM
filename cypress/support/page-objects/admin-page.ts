import { ElementHandler } from "../element-handler";
import CommonHelper from "../helpers/common-helper";
import { HTTP_METHODS, PAGES } from "../helpers/constants";

enum LABELS {
  NAME = "Name",
}

const URLs = {
  getNationality: `/web/index.php/api/v2/admin/nationalities?limit=1000`,
  deleteNationality: `/web/index.php/api/v2/admin/nationalities`
};

class AdminPage {
  private static LOCATORS = {
    nationalityTab: ".oxd-topbar-body-nav-tab-item",
  };

  static goToAdminPage() {
    ElementHandler.clickMenuItem(PAGES.ADMIN);
  }

  static clickNationality() {
    cy.get(this.LOCATORS.nationalityTab).contains("Nationalities").click();
  }

  static clickAddBtn() {
    ElementHandler.clickButton("Add");
  }

  static addNationality(nationality: string) {
    ElementHandler.findInputByLabel(LABELS.NAME).type(nationality);
  }

  static getNationality() {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.GET, URLs.getNationality);
  }

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
