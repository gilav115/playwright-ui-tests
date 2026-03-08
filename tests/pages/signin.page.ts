import { expect, Locator, Page } from "@playwright/test";
import { NavigablePage } from "./contracts/navigable.page";
import { UserCredentials } from "../types/user.types";

export class SignInPage extends NavigablePage {
  protected buildPath(): string {
    return "#/login";
  }

  readonly email: Locator;
  readonly password: Locator;
  readonly signInButton: Locator;
  readonly noArticlesMessage: Locator;
  readonly invalidCredentialsMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.email = page.getByRole("textbox", { name: "Email" });
    this.password = page.getByPlaceholder("Password");
    this.signInButton = page.getByRole("button", { name: "Sign in" });
    this.noArticlesMessage = page.getByText(" No articles are here... yet. ");
    this.invalidCredentialsMessage = page.getByText(
      "Invalid email or password",
    );
  }

  async verifyElements(): Promise<void> {
    await expect(
      this.signInButton,
      "SignIn button should be disabled upon landing",
    ).toBeDisabled();
  }

  async fillCredentials(credentials: UserCredentials) {
    await this.email.fill(credentials.email);
    await this.password.fill(credentials.password);
  }

  async signIn(credentials: UserCredentials): Promise<void> {
    await this.fillCredentials(credentials);
    await expect(
      this.signInButton,
      "Sign in button should be enabled for valid credentials",
    ).toBeEnabled();
    await this.signInButton.click();
  }

  async expectUserSignedIn() {
    await this.navbar.expectUserSignedInState();
  }
}
