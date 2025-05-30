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

  static deleteUserByUsername(username: string) {
    return CommonHelper.sendAPIRequest(
      HTTP_METHODS.GET,
      COMMON_URLs.users
    ).then((response) => {

      const users = response.body.data;
      const userToDelete = users.find((user) => user.userName === username);
      const userId = userToDelete.id;

      return CommonHelper.sendAPIRequest(
        HTTP_METHODS.DELETE,
        COMMON_URLs.users,
        { ids: [userId.toString()] },
        {
          "Content-Type": "application/json",
        }
      );
    });
  }
}
export { AdminPageHelpers };
