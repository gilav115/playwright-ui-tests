# Playwright TypeScript UI Test Template

## Purpose

A production-ready Playwright TypeScript template for UI test automation. It demonstrates:

- Clear and maintainable test design
- Sensible automation architecture
- Reliable validation of core user journeys

The focus is correctness, readability, and engineering judgement rather than exhaustive coverage.

## Quick Start

Follow these steps to run the tests locally:

1. Clone and install

```
git clone https://github.com/your-username/playwright-ui-tests
cd playwright-ui-tests
npm install
npx playwright install --with-deps
```

2. Start the application

```
docker compose up
```

Wait until setup is complete and http://localhost:4200 is accessible in your browser before proceeding.

3. Run tests

```
npm test # run tests on all supported browsers
npm run test:chrome # run on a specific browser. also supports firefox and safari
```

4. Additional commands

`npm playwright codegen http://localhost:4200` Playwright code generator helper tool

`npx playwright test --project=chromium --ui` open Playwright interactive UI mode

`npx playwright show-report` view last report

For more detailed information see below.

## Technology Stack

- Playwright (TypeScript)
- Node.js
- Docker
- Playwright Test Runner

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

## Project Setup

```
git clone https://github.com/your-username/playwright-ui-tests
cd playwright-ui-tests
npm install
npx playwright install --with-deps
```

## Environment Configuration

Credentials and URLs are never hardcoded. `config/env.ts` reads them from environment variables.
URL variables fall back to localhost defaults; credential variables are **required** — the run
fails immediately with a clear error if any are missing.

**Local setup:**

```bash
cp .env.example .env
# fill in values in .env
```

`.env` is gitignored and never committed. Playwright loads it automatically — no extra packages needed.

**Variables:**

| Variable | Required | Description |
|---|---|---|
| `BASE_URL` | No | Frontend URL (default: `http://localhost:4200`) |
| `API_URL` | No | Backend API URL (default: `http://localhost:8000/api/`) |
| `TEST_USER_PASSWORD` | Yes | Regular test user password |
| `ADMIN_PASSWORD` | Yes | Admin user password |

**CI:** set the required variables as pipeline secrets instead of a `.env` file.

## Running the Application Locally

1. Unzip the provided demo application.
2. Go to the application main folder.
3. Start the application using Docker: `docker compose up`

**Application URLs:**

- Frontend: http://localhost:4200
- Backend API: http://localhost:8000

Wait for container to fully start before running tests (validate via frontend URL).

## Test Configuration

Configuration is defined in: `playwright.config.ts`

**Important settings:**

- Test directory: `tests` -> `testDir: "./tests"`
- Fully parallel execution enabled -> `fullyParallel: true`
- Global timeout: 10 minutes -> `globalTimeout: 10 * 60 * 1000`
- Test timeout: 30 seconds -> `timeout: 30 * 1000`
- Retries disabled -> `retries: 0`
- Artifacts retained on failure: trace, screenshot, video

Tests run against the configured base URL: `env.baseUrl` (defined in `env.ts`).

**Parallel Execution**

To optimize execution time, this project is configured to run tests in **full parallel mode**.

**Suite and Test Level:** Parallelism is applied both across different test files and between individual tests within a single file.

**Data Isolation:** This architecture requires strict **data isolation**. Each test is designed to be independent, ensuring that the state or side effects of one test do not impact others.
Sharing or reusing data between tests could cause instability.

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

Playwright's UI Mode provides a built-in interactive experience for running and debugging tests. It allows you to step through actions, inspect the DOM snapshot at every step, and see console logs in real time.

**Open UI Mode:** `npx playwright test --ui`

## Test Reports

After a test run completes, Playwright generates a comprehensive HTML report. This report provides a visual breakdown of results and includes embedded artifacts (traces, screenshots, and videos) if they were captured during a failure.

**Open the HTML report:** `npx playwright show-report`

For detailed post-mortem debugging, you can use the **Playwright Trace Viewer**, which allows you to step through each action of your test in a timeline with full DOM snapshots.

**Learn more:** [Playwright Trace Viewer Documentation](https://playwright.dev)

## Linting

This project uses **ESLint** to enforce code quality and consistent style across the test suite.

- **How it works:** When you run tests via the `npm` scripts (like `npm test`), the project executes `npm run lint` first.
- **Validation:** If the linter identifies any issues, the test execution will stop. This ensures that the code remains clean and maintainable.
- **Manual Check:** You can run the linter independently at any time using: `npm run lint`
