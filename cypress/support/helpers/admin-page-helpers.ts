import { COMMON_URLs } from "../element-handler";
import CommonHelper from "./common-helper";
import { HTTP_METHODS } from "./constants";

const URLs = {
  limit: `?limit=500`,
};

class AdminPageHelpers {
  /**
   * get nationality made prev
   * @returns
   */
  static getNationality() {
    return CommonHelper.sendAPIRequest(
      HTTP_METHODS.GET,
      `${COMMON_URLs.nationalities}${URLs.limit}`
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
