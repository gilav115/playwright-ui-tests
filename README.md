# UI Automation With PlayWright + TypeScript

## Purpose

This repository contains UI automated tests for the demo application provided as part of a technical assessment. The goal of this solution is to demonstrate:

- Clear and maintainable test design
- Sensible automation architecture
- Reliable validation of core user journeys

The focus is correctness, readability, and engineering judgement rather than exhaustive coverage.

---

## Technology Stack

- Playwright (TypeScript)
- Node.js
- Docker
- Playwright Test Runner

---

## Requirements

The following tools must be installed before running the project.

### Node.js

Recommended version 18+

- Check installation: `node -v`
- Install from: https://nodejs.org

### Docker

Docker is required to run the demo application locally.

- Check installation: `docker --version`
- Install from: https://www.docker.com

---

## Project Setup

```
git clone <repository-url>
cd <repository>
npm install
npx playwright install --with-deps
```

---

## Running the Application Locally

1. Unzip the provided demo application.
2. Start the application using Docker: `docker compose up`

**Application URLs:**

- Frontend: http://localhost:4200
- Backend API: http://localhost:8000

\_Wait for container are fully start before running tests (validate via frontend URL)

---

## Test Configuration

Configuration is defined in: `playwright.config.ts`

**Important settings:**

- Test directory: `tests/specs` -> `testDir: "./tests/specs"`
- Fully parallel execution enabled -> `fullyParallel: true`
- Global timeout: 10 minutes -> `globalTimeout: 10 * 60 * 1000`
- Test timeout: 30 seconds -> `timeout: 30 * 1000`
- Retries disabled -> `retries: 0`
- Artifacts retained on failure: trace, screenshot, video

Tests run against the configured base URL: `env.baseUrl` (defined in `env.ts`).

**Parallel Execution**

To optimize execution time, this project is configured to run tests in **full parallel mode**.

**Suite & Test Level:** Parallelism is applied both across different test files and between individual tests within a single file.

**Data Isolation:** This architecture requires strict **data isolation**. Each test is designed to be independent, ensuring that the state or side effects of one test do not impact others.
Sharing or reusing data between tests could cause instability.

---

## Running Tests

You can run tests using either direct Playwright commands or the defined `npm` scripts (which include linting).

### Using npm scripts (includes linting)

- **Run tests on all supported browsers:** `npm test`
- **Chromium:** `npm run test:chrome`
- **Firefox:** `npm run test:firefox`
- **WebKit/Safari:** `npm run test:safari`

### Using Playwright commands directly

- **Run all tests:** `npx playwright test`
- **UI Mode:** `npx playwright test --ui`
- **Headed Mode:** `npx playwright test --headed`
- **Specific File:** `npx playwright test tests/specs/signin.spec.ts`

## Playwright UI Mode

Playwright’s UI Mode provides a built-in interactive experience for running and debugging tests. It allows you to step through actions, inspect the DOM snapshot at every step, and see console logs in real time.

**Open UI Mode:** `npx playwright test --ui`

## Test Reports

After a test run completes, Playwright generates a comprehensive HTML report. This report provides a visual breakdown of results and includes embedded artifacts (traces, screenshots, and videos) if they were captured during a failure.

**Open the HTML report:** `npx playwright show-report`

For detailed post-mortem debugging, you can use the **Playwright Trace Viewer**, which allows you to step through each action of your test in a timeline with full DOM snapshots.

**Learn more:** [Playwright Trace Viewer Documentation](https://playwright.dev)

---

## Linting in our Project

This project uses **ESLint** to enforce code quality and consistent style across the test suite.

- **How it works:** When you run tests via the `npm` scripts (like `npm test`), the project executes `npm run lint` first.
- **Validation:** If the linter identifies any issues, the test execution will stop. This ensures that the code remains clean and maintainable.
- **Manual Check:** You can run the linter independently at any time using: `npm run lint`
