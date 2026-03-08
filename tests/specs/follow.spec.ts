import { test, expect } from "../fixtures/base.fixture";
import { HomePage } from "../pages/home.page";
import { UserCredentials } from "../types/user.types";

test.describe("Follow", () => {
  let follower: UserCredentials;
  let followed: UserCredentials;

  test.beforeEach(async ({ userFactory }) => {
    follower = userFactory(1);
    followed = userFactory(2);

    await test.step("Create two users", async () => {});
  });

  test("should display followed users articles in followers feed", async ({
    page,
    api,
    articleFactory,
  }) => {
    const article = articleFactory.create();

    await test.step("auth followed user", async () => {
      const authFollowed = await api.auth(followed);
      await expect(authFollowed, "Create user via API failed").toBeOK();
      const { user } = await authFollowed.json();
      api.setToken(user.token);
    });

    await test.step("publish article for followed user", async () => {
      const publish = await api.publishArticle(article);
      await expect(publish, "publish article failed").toBeOK();
    });

    await test.step("auth follower user", async () => {
      const authFollower = await api.auth(follower);
      await expect(authFollower, "Create user via API failed").toBeOK();
      const { user } = await authFollower.json();
      const token = user.token;
      api.setToken(token);
      await page.addInitScript((t: string) => {
        window.localStorage.setItem("token", t);
      }, token);
    });

    await test.step("follow user", async () => {
      const follow = await api.follow(followed.username);
      await expect(follow, "Follow user via API failed").toBeOK();
    });

    const homePage = new HomePage(page);
    await test.step("go to my feed", async () => {
      await homePage.navigate();
      await homePage.myFeed.click();
    });

    await test.step("validate article in my feed", async () => {
      await homePage.articlePreview.validate(article);
    });
  });
});
