import { Page, Locator, expect } from "@playwright/test";

export class Navbar {
  readonly logo: Locator;
  readonly home: Locator;
  readonly signIn: Locator;
  readonly signUp: Locator;
  readonly newArticle: Locator;
  readonly settings: Locator;

  constructor(private readonly page: Page) {
    const nav = page.getByRole("navigation");

    this.logo = nav.getByRole("link", { name: "conduit" });
    this.home = nav.getByRole("link", { name: "Home" });
    this.signIn = nav.getByRole("link", { name: "Sign in" });
    this.signUp = nav.getByRole("link", { name: "Sign up" });

    this.newArticle = nav.getByRole("link", { name: "New Article" });
    this.settings = nav.getByRole("link", { name: "Settings" });
  }

  async goHome() {
    await this.home.click();
  }

  async goToSignIn() {
    await this.signIn.click();
  }

  async goToSignUp() {
    await this.signUp.click();
  }

  async goToProfile(username: string) {
    await this.page
      .locator("nav")
      .getByRole("link", { name: username })
      .click();
  }

  async expectUserSignedOutState() {
    await expect(
      this.signIn,
      "Signed out user should have a sign in option",
    ).toBeVisible();
    await expect(
      this.signUp,
      "Signed out user should have a sign up option",
    ).toBeVisible();

    await expect(
      this.newArticle,
      "Signed out user should not be able to create a new article",
    ).not.toBeVisible();

    await expect(
      this.settings,
      "Signed out user should not be able to access settings",
    ).not.toBeVisible();
  }

  async expectUserSignedInState() {
    await expect(
      this.newArticle,
      "New article link is not visible",
    ).toBeVisible();

    await expect(this.settings, "Settings link is not visible").toBeVisible();

    await expect(
      this.signIn,
      "Signed in user should not have a signin option",
    ).not.toBeVisible();

    await expect(
      this.signUp,
      "Signed in user should not have a signup option",
    ).not.toBeVisible();
  }
}
