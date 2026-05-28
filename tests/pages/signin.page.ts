import { Locator, Page } from "@playwright/test";
import { NavigablePage } from "./contracts/navigable.page";

export class SignInPage extends NavigablePage {

readonly userName: Locator;
readonly password: Locator;
readonly loginButton: Locator;

  protected buildPath(): string {
    return "#/login";
  }

  constructor(page: Page) {
    super(page);
    this.userName = page.getByRole('textbox', { name: 'Username' });
    this.password = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.locator('[data-test="login-button"]');
  }

  protected async verifyElements(): Promise<void> {

  }

  async login(userName: string, password: string) {
    await this.userName.fill(userName);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}
