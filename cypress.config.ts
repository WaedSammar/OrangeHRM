import { defineConfig } from "cypress";
import * as xlsx from "xlsx";

export default defineConfig({
  projectId: "zwebt5",
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        parseXlsxToJson({ filePath }) {
          const workbook = xlsx.readFile(filePath);
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const json = xlsx.utils.sheet_to_json(sheet, { defval: "" });
          return json;
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
