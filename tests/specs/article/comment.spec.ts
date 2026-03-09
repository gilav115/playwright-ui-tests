import { test, expect } from "../../fixtures/base.fixture";
import { HomePage } from "../../pages/home.page";
import { ArticlePage } from "../../pages/article.page";
import { UserCredentials } from "../../types/user.types";
import { Article } from "../../types/article.types";
import { uniqueString } from "../../utils/random.util";

test.describe("Comment", () => {
  let articlePage: ArticlePage;
  let homePage: HomePage;

  let publishingUser: UserCredentials;
  let commentingUser: UserCredentials;
  let article: Article;

  test.beforeEach(async ({ page, userFactory, articleFactory, api }) => {
    await test.step("Publish an article", async () => {
      publishingUser = userFactory(1);
      article = articleFactory.create();

      const auth = await api.auth(publishingUser);
      await expect(auth, "Create publishingUser via API failed").toBeOK();

      const { user } = await auth.json();
      const token = user.token;
      api.setToken(token);

      const publish = await api.publishArticle(article);
      await expect(publish, "Publish article via API failed").toBeOK();
    });

    await test.step("Sign in user under test", async () => {
      commentingUser = userFactory(2);
      const auth = await api.auth(commentingUser);
      await expect(auth, "Create publishingUser via API failed").toBeOK();

      const { user } = await auth.json();
      const token = user.token;
      api.setToken(token);

      await page.addInitScript((t: string) => {
        window.localStorage.setItem("token", t);
      }, token);

      homePage = new HomePage(page);
      articlePage = new ArticlePage(page);
    });
  });

  test("should allow to comment on an article", async ({ commentFactory }) => {
    const comment = commentFactory(`this is a comment ${uniqueString()}`);

    await test.step("comment on article", async () => {
      await homePage.navigate(); // we need to go to home to app will load user profile first
      await homePage.articlePreview.goToArticle(article.title);
      await articlePage.verifyIsLoaded(article.title);
      await articlePage.writeComment(comment);
    });

    await test.step("verify comment appear", async () => {
      await articlePage.expectCommentPresence(comment, true);
    });
  });

  test("show allow to delete comment", async ({ api, commentFactory }) => {
    const comment = commentFactory(`this is a comment ${uniqueString()}`);

    await test.step("publish comment via API", async () => {
      const commentCall = await api.commentOnArticle(article, comment);
      await expect(commentCall, "Comment on article via API failed").toBeOK();
    });

    await test.step("delete comment", async () => {
      await homePage.navigate(); // we need to go to home to app will load user profile first
      await homePage.articlePreview.goToArticle(article.title);
      await articlePage.verifyIsLoaded(article.title);
      await articlePage.expectCommentPresence(comment, true);
      await articlePage.deleteComment(comment);
      await articlePage.expectCommentPresence(comment, false);
    });
  });
});
