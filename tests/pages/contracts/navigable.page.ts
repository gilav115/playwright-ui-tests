import { expect } from "@playwright/test";
import { BasePage } from "./base.page";

/**
 * If we can navigate to a given page directly, then is should also implement navigate function.
 * The purpose is, to have a centralized and encapsulated navigation behavior.
 */
export abstract class NavigablePage extends BasePage {
  protected abstract buildPath(...args: string[]): string;

  public async navigate(...args: string[]): Promise<void> {
    await this.page.goto(this.buildPath(...args));
    await this.verifyIsLoaded();
  }

  /**
   * Every page will be verified by URL + element.
   * Base always checks URL.
   * Page implements how to check elements.
   */
  public async verifyIsLoaded(...args: string[]): Promise<void> {
    const path = this.buildPath(...args);
    await expect(
      this.page,
      `${this.constructor.name} should be on ${path}`,
    ).toHaveURL(new RegExp(path));

    await this.verifyElements();
  }
}
