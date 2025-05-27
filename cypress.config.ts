import { defineConfig } from "cypress";
import * as xlsx from "xlsx";

export default defineConfig({
  projectId: "zwebt5",
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        parseXlsxToJson({ filePath }) {
          const workbook = xlsx.readFile(filePath);
          const result = {};

          workbook.SheetNames.forEach((sheetName) => {
            const sheet = workbook.Sheets[sheetName];
            const json = xlsx.utils.sheet_to_json(sheet, { defval: "" });
            result[sheetName] = json;
          });
          return result;
        },
      });
    },
    baseUrl: "https://opensource-demo.orangehrmlive.com",
    specPattern: "cypress/e2e/**/*-spec.cy.ts",
    defaultBrowser: "chrome",
  },
  viewportWidth: 1728,
  viewportHeight: 1117,
});
