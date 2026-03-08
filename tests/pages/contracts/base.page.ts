import { Page } from "@playwright/test";
import { Navbar } from "../../components/navbar.component";

/**
 * A page we cannot navigate to directly (e.g., a success page), should extend this interface only.
 * Else, extend NavigablePage
 */
export abstract class BasePage {
  readonly navbar: Navbar;

  constructor(protected readonly page: Page) {
    this.navbar = new Navbar(page);
  }

  /**
   * Every page should implement this method.
   * Purpose - verify page is loaded.
   */
  protected abstract verifyElements(): Promise<void>;
}
