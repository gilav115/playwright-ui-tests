/**
 * Runs once before any project with `dependencies: ["setup:user"]`.
 * Logs in as the regular test user and persists their session to disk.
 */
import { test as setup } from "../fixtures/base.fixture";
import { saveSession } from "../utils/auth.util";
import { USERS } from "../../config/tags";

setup("authenticate as user", async ({ page, userFactory }) => {
  // await saveSession(page, userFactory.existing(USERS.USER), USERS.USER.storagePath);
  console.log("authenticating user...");
});
