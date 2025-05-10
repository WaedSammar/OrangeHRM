import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://opensource-demo.orangehrmlive.com",
  },
  viewportWidth: 1728,
  viewportHeight: 1117,
});
