import { defineConfig } from 'cypress'
import * as xlsx from 'xlsx'
import { promises as fs } from 'fs'

export default defineConfig({
  projectId: 'zwebt5',
  e2e: {
    async setupNodeEvents(on, config) {
      on('task', {
        async parseXlsxToJson({ filePath }) {
          await fs.access(filePath, fs.constants.R_OK)

          const buffer = await fs.readFile(filePath)
          const workbook = xlsx.read(buffer, { type: 'buffer' })
          const result: Record<string, unknown[]> = {}

          workbook.SheetNames.forEach((sheetName) => {
            const sheet = workbook.Sheets[sheetName]
            const json = xlsx.utils.sheet_to_json(sheet, { defval: '' })
            result[sheetName] = json
          })
          return result
        }
      })
    },
    baseUrl: 'https://opensource-demo.orangehrmlive.com',
    specPattern: 'cypress/e2e/**/*-spec.cy.ts',
    defaultBrowser: 'chrome',
    video: false
  },
  viewportWidth: 1728,
  viewportHeight: 1117
})
