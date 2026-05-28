/**
 * Tests that require an already-authenticated user.
 *
 * This spec belongs to a project with:
 *   dependencies: ["setup"]
 *   use: { storageState: authStatePath(env.testUserEmail) }
 *
 * The page arrives here already logged in — auth.setup.ts ran first,
 * saved the session to disk, and Playwright loaded it before this test started.
 * No login steps needed.
 */
import { test } from "../fixtures/base.fixture";
import { USERS } from "../../config/tags";

test.describe("Authenticated", () => {
  test("should display home feed when signed in", { tag: USERS.USER.label }, async ({ page }) => {
      
  });
});
