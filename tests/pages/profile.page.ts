import { expect, Locator, Page } from "@playwright/test";
import { NavigablePage } from "./contracts/navigable.page";
import { Article } from "../types/article.types";
import { ArticlePreview } from "../components/article-preview.component";

export class MyProfilePage extends NavigablePage {
  readonly updateProfileButton: Locator;
  readonly articlePreview: ArticlePreview;

  constructor(page: Page) {
    super(page);

    this.updateProfileButton = page.getByRole("button", {
      name: "Edit Profile Settings",
    });

    this.articlePreview = new ArticlePreview(page);
  }

  protected buildPath(): string {
    return "#/my-profile";
  }

  myArticlesLink(username: string) {
    return this.page.getByRole("link", {
      name: new RegExp(`${username}'s Articles`, "i"),
    });
  }

  async verifyElements(): Promise<void> {
    await expect(
      this.updateProfileButton,
      "Update profile settings button",
    ).toBeVisible();

    await expect(
      this.articlePreview.loadingArticlesMessage,
      "loading articles state stuck",
    ).toBeHidden();
  }
}
