import { expect, Locator, Page } from "@playwright/test";
import { NavigablePage } from "./contracts/navigable.page";
import { Article } from "../types/article.types";

export class EditorPage extends NavigablePage {
  readonly heading: Locator;
  readonly titleInput: Locator;
  readonly aboutInput: Locator;
  readonly contentInput: Locator;
  readonly tagsInput: Locator;
  readonly publishButton: Locator;
  readonly tagPills: Locator;
  readonly removeTagButtons: Locator;

  readonly publishedSuccessfully: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.getByRole("heading", { name: "Article editor" });
    this.titleInput = page.getByRole("textbox", { name: "Article Title" });
    this.aboutInput = page.getByRole("textbox", {
      name: "What's this article about?",
    });
    this.contentInput = page.getByRole("textbox", {
      name: "Write your article (in",
    });
    this.tagsInput = page.getByRole("textbox", { name: "Enter tags" });
    this.publishButton = page.getByRole("button", { name: "Publish Article" });
    this.publishedSuccessfully = page.getByText("Published successfully!");
    this.tagPills = this.page.locator(".tag-list .tag-pill");
    this.removeTagButtons = this.page.locator(".tag-pill .ion-close-round");
  }

  protected buildPath(): string {
    return "#/editor";
  }

  async verifyElements(): Promise<void> {
    await expect(this.heading, "Editor heading is not visible").toBeVisible();
  }

  async fillArticleForm(article: Article, clearExistingTags: boolean) {
    if (clearExistingTags) {
      await this.clearTags();
    }

    await this.titleInput.fill(article.title);
    await this.aboutInput.fill(article.description);
    await this.contentInput.fill(article.body);

    for (const tag of article.tagList) {
      await this.tagsInput.fill(tag);
      await this.tagsInput.press("Enter");
    }

    if (article.tagList.length > 0) {
      await expect(
        this.tagPills.first(),
        "expected at list one tag",
      ).toBeVisible();
    }
  }

  /**
   * Publish a fresh new article.
   * @param article the article to publish
   */
  async publishArticle(article: Article): Promise<void> {
    await this.fillArticleForm(article, false);

    await expect(
      this.publishButton,
      "publish button not enabled on valid input",
    ).toBeEnabled();

    await this.publishButton.click();

    await expect(
      this.publishedSuccessfully,
      "success message after publish",
    ).toBeVisible();
  }

  /**
   * This function assumes the provided article contains all required new data, including tags.
   * Any previous tags will be removed before providing the new tags.
   * @param article the edited article
   */
  async editArticle(article: Article) {
    await expect(this.titleInput, "previous article title").not.toHaveValue("");

    await this.fillArticleForm(article, true);

    await expect(
      this.publishButton,
      "publish button not enabled on valid input",
    ).toBeEnabled();

    await this.publishButton.click();

    await expect(
      this.publishedSuccessfully,
      "success message after publish",
    ).toBeVisible();
  }

  async clearTags() {
    while ((await this.removeTagButtons.count()) > 0) {
      await this.removeTagButtons.first().click();
    }
  }
}
