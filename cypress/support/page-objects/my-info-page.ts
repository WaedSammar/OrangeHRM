import { ElementHandler } from "../element-handler";
import { PAGES } from "../helpers/constants";

class MyInfo {
  /**
   * go to info page
   */
  static goToMyInfoPage() {
    ElementHandler.clickMenuItem(PAGES.MY_INFO);
  }
}
export { MyInfo };
