import { defineConfig, devices } from "@playwright/test";
import { env } from "./config/env";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  globalTimeout: 10 * 60 * 1000,
  timeout: 30 * 1000,
  testDir: "./tests/specs",
  /* 
  Enable full parallel execution.
  This allows tests within the same file to run concurrently, improving overall execution speed.
  If a specific suite requires sequential execution due to shared state, use:
  test.describe.configure({ mode: 'serial' });
  */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Do not retry, do not hide flakiness */
  retries: 0,
  /* Limit CI parallelism for stability */
  workers: process.env.CI ? 2 : undefined,
  /* 
  Reporter to use. See https://playwright.dev/docs/test-reporters 
  In CI:
  - Use "dot" to keep logs compact.
  - Use "github" to surface failures in GitHub Actions UI.
  - Generate an HTML report for debugging (uploaded as artifact).

  Locally:
  - Use "list" for readable terminal output.
  - Generate HTML report for interactive debugging.
  */
  reporter: process.env.CI
    ? [["dot"], ["github"], ["html"]]
    : [["list"], ["html"]],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: env.baseUrl,
    extraHTTPHeaders: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    headless: true,

    /* Retain on failure (matches retries: 0). See https://playwright.dev/docs/trace-viewer */
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
