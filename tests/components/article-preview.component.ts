import { Locator, Page, expect } from "@playwright/test";
import { Article } from "../types/article.types";

export class ArticlePreview {
  readonly loadingArticlesMessage: Locator;
  readonly noArticleMessage: Locator;

  constructor(private page: Page) {
    this.loadingArticlesMessage = page.getByText("Loading articles...");
    this.noArticleMessage = page.getByText("No articles are here... yet.");
  }

  getArticlePreview(article: Article): Locator {
    return this.page
      .locator(".article-preview")
      .filter({ has: this.page.getByRole("heading", { name: article.title }) });
  }

  articleLink(title: string) {
    return this.page.getByRole("heading", { name: title });
  }

  async goToArticle(title: string) {
    await this.articleLink(title).click();
  }

  /**
   * Validate that an article's content appears properly in the UI.
   * This method takes into account the `.article-preview` element only.
   * Here we check - title, description, body and tags.
   * @param article expected article
   */
  async validate(article: Article) {
    const articlePreview = this.getArticlePreview(article);

    await expect(
      articlePreview.locator("h1"),
      `article ${article.title} should appear in my-feed`,
    ).toHaveText(article.title);

    await expect(
      articlePreview.locator("p"),
      "article about should appear",
    ).toContainText(article.description);

    await expect(
      articlePreview.getByText("Read more..."),
      "link to article content should appear",
    ).toBeVisible();

    const tags = articlePreview.locator(".tag-list li");

    await expect(
      tags,
      "displayed tags should match article configuration",
    ).toHaveCount(article.tagList.length);

    for (const tag of article.tagList) {
      const match = tags.filter({ hasText: tag });
      await expect(
        match,
        `displayed tags did not include expected tag ${tag}`,
      ).toBeVisible();
    }
  }

  async expectArticlePresence(article: Article, present: boolean) {
    present
      ? await this.expectArticlePresent(article)
      : await this.expectArticleAbsent(article);
  }

  async expectArticlePresent(article: Article) {
    await expect(
      this.getArticlePreview(article),
      `article ${article.title} should be present`,
    ).toBeVisible();
  }

  async expectArticleAbsent(article: Article) {
    await expect(
      this.getArticlePreview(article),
      `article ${article.title} should be absent`,
    ).toHaveCount(0);
  }

  async expectNoArticles() {
    await expect(
      this.noArticleMessage,
      "no articles message did not appear",
    ).toBeVisible();
  }
}
