import { faker } from '@faker-js/faker'
import { IClaimRequest } from '../../types/claim'

class ClaimInitializer {
  /**
   * make initializer for added event type
   * @param {IClaimRequest} claimPageInfo
   * @returns
   */
  static initializerEventType(claimPageInfo: IClaimRequest) {
    const payload = {
      description: claimPageInfo.eventTypeDescription || faker.lorem.paragraph(),
      name: claimPageInfo.eventTypeName || faker.company.catchPhrase(),
      status: claimPageInfo.eventTypeStatus ?? faker.datatype.boolean()
    }
    return payload
  }

  /**
   * make initializer for added expense type
   * @param {IClaimRequest} claimPageInfo
   * @returns
   */
  static initializerExpenseType(claimPageInfo: IClaimRequest) {
    const payload = {
      description: claimPageInfo.expenseTypeDescription || faker.lorem.paragraph(),
      name: claimPageInfo.expenseTypeName || faker.commerce.department(),
      status: claimPageInfo.expenseTypeStatus ?? faker.datatype.boolean()
    }
    return payload
  }
}
export { ClaimInitializer }
