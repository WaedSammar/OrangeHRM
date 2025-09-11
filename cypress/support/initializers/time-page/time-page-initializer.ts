import { faker } from '@faker-js/faker/.'
import { ITimeSheet } from '../../types/timeSheet'

class TimeInitializer {
  /**
   * initializer for create customer
   * @param {ITimeSheet} timeSheetData 
   * @returns 
   */
  static initializerCreateCustomer(timeSheetData: ITimeSheet) {
    const payload = {
      name: timeSheetData.customerName || faker.person.firstName(),
      description: timeSheetData.customerDescription || faker.lorem.sentence()
    }
    return payload
  }

  /**
   * initializer for create project
   * @param {ITimeSheet} timeSheetData 
   * @param {number} customerId 
   * @returns 
   */
  static initializerCreateProject(timeSheetData: ITimeSheet, customerId: number) {
    const payload = {
      name: timeSheetData.projectName || `project ${faker.company.name()}`,
      description: timeSheetData.projectDescription || faker.lorem.sentence(),
      customerId,
      projectAdminsEmpNumbers: []
    }
    return payload
  }
}
export { TimeInitializer }
