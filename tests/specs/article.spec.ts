import { test, expect } from "../fixtures/base.fixture";
import { HomePage } from "../pages/home.page";
import { EditorPage } from "../pages/editor.page";
import { MyProfilePage } from "../pages/profile.page";
import { ArticlePage } from "../pages/article.page";

test.describe("Article", () => {
  let editorPage: EditorPage;
  let myProfilePage: MyProfilePage;
  let articlePage: ArticlePage;
  let homePage: HomePage;

  test.beforeEach(async ({ page, newUser, api }) => {
    await test.step("Sign in user via API", async () => {
      const auth = await api.auth(newUser);
      await expect(auth, "Create user via API failed").toBeOK();

      const { user } = await auth.json();
      const token = user.token;

      await page.addInitScript((t: string) => {
        window.localStorage.setItem("token", t);
      }, token);

      api.setToken(token);

      homePage = new HomePage(page);
      myProfilePage = new MyProfilePage(page);
      editorPage = new EditorPage(page);
      articlePage = new ArticlePage(page);
    });
  });

  test("should allow to write an article when a user is signed in", async ({
    newUser,
    articleFactory,
  }) => {
    const article = articleFactory.create();

    await test.step("go to editor page", async () => {
      await editorPage.navigate();
    });

    await test.step("publish article", async () => {
      await editorPage.publishArticle(article);
    });

    await test.step("go to user profile", async () => {
      await editorPage.navbar.goToProfile(newUser.username);
    });

    await test.step("validate article", async () => {
      await myProfilePage.verifyElements();
      await myProfilePage.articlePreview.validate(article);
    });
  });

  test("should allow to edit an article", async ({
    newUser,
    articleFactory,
    api,
  }) => {
    const article = articleFactory.create();

    await test.step("publish an article via api", async () => {
      await api.publishArticle(article);
    });

    await test.step("go to my articles", async () => {
      await homePage.navigate(); // we need to go to home to app will load user profile first
      await homePage.navbar.goToProfile(newUser.username);
      await myProfilePage.verifyIsLoaded();
      await myProfilePage.articlePreview.goToArticle(article.title);
    });

    await test.step("go to edit article", async () => {
      await articlePage.verifyIsLoaded(article.title);
      await articlePage.editArticleClick();
    });

    const newArticle = articleFactory.create(2);
    await test.step("edit article", async () => {
      await editorPage.editArticle(newArticle);
    });

    await test.step("validate article edited", async () => {
      await editorPage.navbar.goToProfile(newUser.username);
      await myProfilePage.articlePreview.validate(newArticle);
    });
  });

  test("should allow to delete an article", async ({
    newUser,
    api,
    articleFactory,
  }) => {
    const article = articleFactory.create();

    await test.step("publish an article via api", async () => {
      await api.publishArticle(article);
    });

    await test.step("go to my articles", async () => {
      await homePage.navigate(); // we need to go to home to app will load user profile first
      await homePage.navbar.goToProfile(newUser.username);
      await myProfilePage.verifyIsLoaded();
      await myProfilePage.articlePreview.goToArticle(article.title);
    });

    await test.step("delete article", async () => {
      await articlePage.verifyIsLoaded(article.title);
      await articlePage.deleteArticleClick();
    });

    await test.step("validate article deleted from home page", async () => {
      await homePage.verifyIsLoaded(); // delete should redirect to home page
      await homePage.articlePreview.expectArticlePresence(article, false);
    });

    await test.step("validate article deleted from profile page", async () => {
      await homePage.navbar.goToProfile(newUser.username);
      await myProfilePage.verifyIsLoaded();
      await myProfilePage.articlePreview.expectArticlePresence(article, false);
      await myProfilePage.articlePreview.expectNoArticles(); // assuming a single article in this test
    });
  });
});
