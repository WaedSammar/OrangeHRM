import { HTTP_METHODS } from './constants'

const COMMON_URLs = {
  nationalities: `/web/index.php/api/v2/admin/nationalities`,
  users: `/web/index.php/api/v2/admin/users`,
  DASHBOARD: '/dashboard'
}

export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-'
}

export enum GENDER {
  MALE = 'Male',
  FEMALE = 'Female'
}

export enum MaritalStatus {
  SINGLE = 'Single',
  MARRIED = 'Married',
  DIVORCED = 'Divorced',
  WIDOWED = 'Widowed'
}

class CommonHelper {
  static generateRandomString(length: number = 7, prefix: string = '', suffix: string = ''): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let text = ''

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return `${prefix} ${text} ${suffix}`
  }

  static generateRandomNumber(max: number = 10000): number {
    return Math.floor(Math.random() * max)
  }

  static generateRandomBloodType() {
    return this.getRandomEnum(BloodType)
  }

  static generateRandomGender(): GENDER {
    return this.getRandomEnum(GENDER)
  }

  static generateRandomMaritalStatus(): MaritalStatus {
    return this.getRandomEnum(MaritalStatus)
  }

  static getRandomEnum<T>(enumObj: T) {
    const values = Object.values(enumObj)
    const randomIndex = Math.floor(Math.random() * values.length)
    return values[randomIndex]
  }

  static interceptRequests(requestURL: string, httpRequestMethod: HTTP_METHODS, aliasName: string) {
    return new Cypress.Promise((resolve) => {
      cy.intercept({
        url: `**${requestURL}*`,
        method: httpRequestMethod
      })
        .as(aliasName)
        .then(resolve)
    })
  }

  static sendAPIRequest(method: string, url: string, body?: string | object, header?: Record<string, string>) {
    return cy
      .request({
        method,
        url,
        ...(body && { body }),
        headers: {
          ...(body ? { 'Content-Type': 'application/json' } : {}),
          ...(header || {})
        }
      })
      .then((response) => {
        expect(response.status).to.eq(200)
        return response
      })
  }

  static cleanup(URL: string, ids: number[]) {
    this.sendAPIRequest(HTTP_METHODS.DELETE, URL, {
      ids
    })
  }
}
export { CommonHelper, COMMON_URLs }
