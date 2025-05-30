import CommonHelper from "./common-helper";
import { HTTP_METHODS } from "./constants";

const URLs = {
  nationality: `/web/index.php/api/v2/admin/nationalities`,
  limit: `?limit=500`,
  users: `/web/index.php/api/v2/admin/users`,
};

class AdminPageHelpers {
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
export { AdminPageHelpers };
