import { Page } from "@playwright/test";
import { NavigablePage } from "./contracts/navigable.page";

export class CartPage extends NavigablePage {
  protected buildPath(): string {
    return "/cart";
  }

  constructor(page: Page) {
    super(page);
  }

  protected async verifyElements(): Promise<void> {}

  async isInCart(name: string): Promise<boolean> {
    return this.page.getByText(name, { exact: true }).isVisible();
  }
}
