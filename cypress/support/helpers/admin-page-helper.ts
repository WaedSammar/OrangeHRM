import { COMMON_URLs } from './apis-helpers'
import { CommonHelper } from './common-helper'
import { HTTP_METHODS, SIZE_LIMIT } from './constants'

enum PARAMS {
  LIMIT = '?limit='
}

class AdminPageHelper {
  /**
   * get nationality made prev
   * @returns
   */
  static getNationality(limit: number = SIZE_LIMIT.fiveHundred) {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.GET, `${COMMON_URLs.nationalities}${PARAMS.LIMIT}${limit}`)
  }

  /**
   * adding nationality via API
   * @param {string} nationality
   * @returns
   */
  static addNationality(nationality: string) {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, COMMON_URLs.nationalities, {
      name: nationality
    })
  }

  /**
   * delete created nationality
   * @param {number[]} ids
   */
  static deleteNationalities(ids: number[]) {
    CommonHelper.cleanup(COMMON_URLs.nationalities, ids)
  }
}
export { AdminPageHelper }
