import { expect, Locator, Page } from "@playwright/test";
import { NavigablePage } from "./contracts/navigable.page";
import { ArticleComment } from "../types/comment.types";

export class ArticlePage extends NavigablePage {
  readonly loading: Locator;
  readonly commentInput: Locator;
  readonly postCommentButton: Locator;

  constructor(page: Page) {
    super(page);

    this.loading = page.getByText("Loading article...");
    this.commentInput = page.getByRole("textbox", {
      name: "Write a comment...",
    });
    this.postCommentButton = page.getByRole("button", {
      name: "Post Comment",
    });
  }

  /**
   * Here we rely on the structure of the title based on `ArticleFactory`.
   * The title is build as `Article ${id}`, so we extract the ID.
   * We build a custom path for the URL slug.
   * @param args must contain articleTitle
   * @returns the path with the article ID
   */
  protected buildPath(...args: string[]): string {
    const [articleTitle] = args;

    if (!articleTitle) {
      throw new TypeError("articleTitle is required to build article path");
    }

    const id = articleTitle.split(" ")[1];
    return `#/article/article-${id}`;
  }

  async verifyElements(): Promise<void> {
    await expect(
      this.navbar.home,
      "Navigation bar is not visible",
    ).toBeVisible();

    await expect(this.loading, "loading article message stuck").toBeHidden();
  }

  async editArticleClick() {
    await this.page
      .locator("button")
      .filter({ hasText: "Edit Article" })
      .first()
      .click();
  }

  async deleteArticleClick() {
    await this.page
      .locator("button")
      .filter({ hasText: "Delete Article" })
      .first()
      .click();
  }

  async writeComment(comment: ArticleComment) {
    await this.commentInput.fill(comment.comment.body);
    await this.postCommentButton.click();
  }

  async deleteComment(comment: ArticleComment) {
    await this.page
      .locator(".card")
      .filter({ hasText: comment.comment.body })
      .locator(".ion-trash-a")
      .click();
  }

  async expectCommentPresence(comment: ArticleComment, present: boolean) {
    const element = this.page.getByText(comment.comment.body, { exact: true });
    present
      ? await expect(element, "comment is not visible").toHaveCount(1)
      : await expect(element, "comment is not hidden").toHaveCount(0);
  }
}
