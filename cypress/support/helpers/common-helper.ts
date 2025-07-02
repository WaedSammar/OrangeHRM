import { HTTP_METHODS } from './constants'

const COMMON_URLs = {
  nationalities: `/web/index.php/api/v2/admin/nationalities`,
  users: `/web/index.php/api/v2/admin/users`,
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
