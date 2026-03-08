import { expect, Locator, Page } from "@playwright/test";
import { NavigablePage } from "./contracts/navigable.page";
import { UserCredentials } from "../types/user.types";

export class SignUpPage extends NavigablePage {
  protected buildPath(): string {
    return "#/register";
  }

  readonly username: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly signUpButton: Locator;
  readonly usernameAlreadyExist: Locator;
  readonly emailAlreadyExist: Locator;

  constructor(page: Page) {
    super(page);

    this.username = page.getByPlaceholder("Username");
    this.email = page.getByPlaceholder("Email");
    this.password = page.getByPlaceholder("Password");
    this.signUpButton = page.getByRole("button", { name: "Sign up" });
    this.usernameAlreadyExist = page.getByText(
      "Username: A user with that username already exists.",
    );
    this.emailAlreadyExist = page.getByText(
      "Email: A user with that email already exists.",
    );
  }

  async verifyElements(): Promise<void> {
    await expect(
      this.signUpButton,
      "SignUp button should be visible upon landing",
    ).toBeVisible();
  }

  /**
   * Fill form only
   * @param credentials user credentials
   */
  async fillForm(credentials: UserCredentials) {
    await this.username.fill(credentials.username);
    await this.email.fill(credentials.email);
    await this.password.fill(credentials.password);
  }

  async signUpClick() {
    await this.signUpButton.click();
  }

  /**
   * Happy flow for sign up
   * @param credentials valid user credentials
   */
  async signUp(credentials: UserCredentials): Promise<void> {
    await this.fillForm(credentials);
    await expect(
      this.signUpButton,
      "SignUp button should be enabled for valid credentials",
    ).toBeEnabled();
    await this.signUpClick();
  }
}
