import { test, expect } from "../fixtures/base.fixture";
import { SignInPage } from "../pages/signin.page";

type Field = "email" | "password";

const scenarios: { field: Field }[] = [
  { field: "email" },
  { field: "password" },
];

const randomString = () => Math.random().toString(36).slice(2, 8);

test.describe("Sign In", () => {
  let signInPage: SignInPage;

  test.describe("Auth", () => {
    test.beforeEach(async ({ page, newUser, api }) => {
      await test.step("Create user via API", async () => {
        const response = await api.register(newUser);
        await expect(response, "Create user via API failed").toBeOK();
      });

      signInPage = new SignInPage(page);
      await test.step("Navigate to signin page", async () => {
        await signInPage.navigate();
      });
    });

    test("should sign in successfully when valid credentials", async ({
      newUser,
    }) => {
      await test.step("Sign in new user", async () => {
        await signInPage.signIn(newUser);
      });

      await test.step("Verify dashboard user is visible", async () => {
        await signInPage.expectUserSignedIn();
      });
    });

    for (const { field } of scenarios) {
      test(`should reject sign in with incorrect ${field}`, async ({
        page,
        newUser,
      }) => {
        const user = {
          ...newUser,
          email:
            field === "email"
              ? `user_${randomString()}@test.com`
              : newUser.email,
          password: field === "password" ? randomString() : newUser.password,
        };

        await test.step(`provide invalid ${field}`, async () => {
          await signInPage.fillCredentials(user);

          const responsePromise = page.waitForResponse(
            (r) =>
              r.url().includes("/users/login") &&
              r.request().method() === "POST",
          );

          await signInPage.signInButton.click();

          const response = await responsePromise;
          expect(response.status()).toBe(422);

          await expect(
            signInPage.invalidCredentialsMessage,
            `Error message should appear when invalid ${field}`,
          ).toBeVisible();
        });
      });
    }
  });

  test.describe("Form Validation", () => {
    test.beforeEach(async ({ page }) => {
      signInPage = new SignInPage(page);

      await test.step("Navigate to signin page", async () => {
        await signInPage.navigate();
      });
    });

    for (const { field } of scenarios) {
      test(`should prevent sign in when missing ${field}`, async ({
        newUser,
      }) => {
        const user = {
          ...newUser,
          email: field === "email" ? "" : newUser.email,
          password: field === "password" ? "" : newUser.password,
        };

        await test.step(`provide incomplete ${field}`, async () => {
          await signInPage.fillCredentials(user);
          await expect(
            signInPage.signInButton,
            `sign in button should remain disabled when missing ${field}`,
          ).toBeDisabled();
        });
      });
    }

    test("should prevent sign in when invalid email", async ({ newUser }) => {
      const user = { ...newUser, email: newUser.username };

      await test.step("provide invalid email", async () => {
        await signInPage.fillCredentials(user);
        await expect(
          signInPage.signInButton,
          "sign in button should remain disabled when invalid email",
        ).toBeDisabled();
      });
    });
  });
});
