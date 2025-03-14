import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    env: {
      apiUrl: "http://localhost:8080" // ✅ Cypress에서 API 요청 주소 설정
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
