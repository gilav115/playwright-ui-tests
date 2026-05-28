/**
 * Tests the sign-in flow directly — no pre-authenticated state.
 * This spec must NOT be in a project with `dependencies: ["setup"]`.
 */
import { USERS } from "../../config/tags";
import { test } from "../fixtures/base.fixture";
// import { loginViaUI } from "../utils/auth.util";

test.describe("Sign In", () => {
  test("should sign in with valid credentials", async ({ page }) => {
    // await loginViaUI(page, newUser);
    // TODO: assert post-login state
  });

  test("should reject invalid credentials", async ({ page }) => {
    // TODO: implement
  });
});
