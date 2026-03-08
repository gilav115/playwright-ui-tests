import { expect, Locator, Page } from "@playwright/test";
import { NavigablePage } from "./contracts/navigable.page";
import { Article } from "../types/article.types";
import { ArticlePreview } from "../components/article-preview.component";

export class HomePage extends NavigablePage {
  readonly emptyFeedMessage: Locator;
  readonly popularTags: Locator;
  readonly myFeed: Locator;
  readonly articlePreview: ArticlePreview;

  constructor(page: Page) {
    super(page);

    this.emptyFeedMessage = page.getByText("No articles are here... yet.");
    this.popularTags = page.getByText("Popular Tags");
    this.myFeed = page.getByText("My Feed");
    this.articlePreview = new ArticlePreview(page);
  }

  protected buildPath(): string {
    return "#";
  }

  async verifyElements(): Promise<void> {
    await expect(
      this.myFeed,
      "My Feed button not visible in home page",
    ).toBeVisible();

    await expect(
      this.articlePreview.loadingArticlesMessage,
      "loading articles state stuck",
    ).toBeHidden();
  }

  async goToSignIn() {
    await this.navbar.goToSignIn();
  }

  async goToSignUp() {
    await this.navbar.goToSignUp();
  }
}
