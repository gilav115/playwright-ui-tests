/**
 * Runs once before any project with `dependencies: ["setup:admin"]`.
 * Logs in as the admin user and persists their session to disk.
 */
import { test as setup } from "../fixtures/base.fixture";
import { saveSession } from "../utils/auth.util";
import { USERS } from "../../config/tags";

setup("authenticate as admin", async ({ page, userFactory }) => {
  await saveSession(page, userFactory.existing(USERS.ADMIN), USERS.ADMIN.storagePath);
  console.log("authenticating admin...");
});
