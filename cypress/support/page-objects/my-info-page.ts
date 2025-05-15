import CommonHelper from "../helpers/common-helper";

class MyInfo {
  /**
  * go to info page
  */
  static goToMyInfoPage() {
    CommonHelper.clickMenuItem("My Info");
  }
}
export { MyInfo };