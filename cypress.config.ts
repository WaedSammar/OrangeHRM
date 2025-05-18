import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "zwebt5",
  e2e: {
    baseUrl: "https://opensource-demo.orangehrmlive.com",
    specPattern: "cypress/e2e/**/*-spec.cy.ts",
    defaultBrowser: "chrome",
  },
  viewportWidth: 1728,
  viewportHeight: 1117,
});
