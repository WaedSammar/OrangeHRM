import { ElementHandler } from "../element-handler";

class MyInfo {
  /**
  * go to info page
  */
  static goToMyInfoPage() {
    ElementHandler.clickMenuItem("My Info");
  }
}
export { MyInfo };