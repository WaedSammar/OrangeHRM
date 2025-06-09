import { COMMON_URLs } from '../element-handler'
import CommonHelper from './common-helper'
import { HTTP_METHODS, SIZE_LIMIT } from './constants'

class AdminPageHelper {
  /**
   * get nationality made prev
   * @returns
   */
  static getNationality(limit: number = SIZE_LIMIT.fiveHundred) {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.GET, `${COMMON_URLs.nationalities}?limit=${limit}`)
  }

  /**
   * delete created nationality
   * @param {number[]} ids
   */
  static deleteNationalities(ids: number[]) {
    console.log(ids)
    CommonHelper.sendAPIRequest(
      HTTP_METHODS.DELETE,
      COMMON_URLs.nationalities,
      {
        ids
      },
      {
        'Content-Type': 'application/json'
      }
    )
  }

  static deleteUserByUsername(username: string) {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.GET, COMMON_URLs.users).then((response) => {
      const users = response.body.data
      const userToDelete = users.find(({ userName }) => userName === username)
      const userId = userToDelete.id

      return CommonHelper.sendAPIRequest(
        HTTP_METHODS.DELETE,
        COMMON_URLs.users,
        { ids: [userId.toString()] },
        {
          'Content-Type': 'application/json'
        }
      )
    })
  }
}
export { AdminPageHelper }
