import { Page } from "@playwright/test";
import { UserCredentials } from "../types/user.types";
import { mkdir } from "fs/promises";
import { dirname } from "path";

export async function loginViaUI(page: Page, credentials: UserCredentials): Promise<void> {
  await page.goto("/#/login");
  await page.getByRole("textbox", { name: "Email" }).fill(credentials.email);
  await page.getByPlaceholder("Password").fill(credentials.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/.*\/#\//);
}

export async function saveSession(_page: Page, _credentials: UserCredentials, storagePath: string): Promise<void> {
  await mkdir(dirname(storagePath), { recursive: true });
  // await loginViaUI(_page, _credentials);
  // await _page.context().storageState({ path: storagePath });
}
