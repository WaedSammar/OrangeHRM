import { defineConfig } from 'cypress'
import * as xlsx from 'xlsx';
import { promises as fs } from 'fs';

export default defineConfig({
  projectId: 'zwebt5',
  e2e: {
    baseUrl: 'https://opensource-demo.orangehrmlive.com',
    specPattern: 'cypress/e2e/**/*-spec.cy.ts',
    defaultBrowser: 'chrome',
    video: false
  },
  viewportWidth: 1728,
  viewportHeight: 1117,
});
