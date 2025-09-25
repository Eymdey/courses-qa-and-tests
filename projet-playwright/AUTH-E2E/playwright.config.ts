import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "html",
  use: {
    // URL de base pour tous nos tests
    baseURL: "http://127.0.0.1:8080",
    trace: "on-first-retry",
  },

  // === AJOUTE CETTE SECTION ===
  // Lance un serveur web local avant d'exécuter les tests
  webServer: {
    command: "npx http-server -p 8080",
    url: "http://127.0.0.1:8080",
    reuseExistingServer: !process.env.CI,
  },
  // ============================

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
