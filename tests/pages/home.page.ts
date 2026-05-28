import { Locator, Page } from "@playwright/test";
import { NavigablePage } from "./contracts/navigable.page";

export class HomePage extends NavigablePage {
  readonly shoppingCart: Locator;

  protected buildPath(): string {
    return "/inventory";
  }

  constructor(page: Page) {
    super(page);
    this.shoppingCart = page.locator('[data-test="shopping-cart-link"]');
  }

  protected async verifyElements(): Promise<void> {}

  async addToCart(name: string): Promise<void> {
    await this.page
      .getByText(name, { exact: true })
      .locator("..")
      .getByRole("button", { name: "Add to cart" })
      .click();
  }

  async goToCart(): Promise<void> {
    await this.shoppingCart.click();
  }
}
