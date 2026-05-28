import { Page } from "@playwright/test";

/**
 * A page we cannot navigate to directly (e.g., a success page), should extend this interface only.
 * Else, extend NavigablePage
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  protected abstract verifyElements(): Promise<void>;
}
