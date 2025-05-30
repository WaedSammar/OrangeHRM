import { COMMON_URLs, VALUES } from "../element-handler";
import CommonHelper from "./common-helper";
import { HTTP_METHODS } from "./constants";

class AdminPageHelpers {
  /**
   * get nationality made prev
   * @returns
   */
  static getNationality(limit: number = VALUES.fiveHundred) {
    return CommonHelper.sendAPIRequest(
      HTTP_METHODS.GET,
      `${COMMON_URLs.nationalities}?limit=${limit}`
    );
  }

  /**
   * delete created nationality
   * @param {number} id
   */
  static deleteNationality(id: number) {
    CommonHelper.sendAPIRequest(
      HTTP_METHODS.DELETE,
      COMMON_URLs.nationalities,
      {
        ids: [String(id)],
      },
      {
        "Content-Type": "application/json",
      }
    );
  }
}
export { AdminPageHelpers };
