import { test } from "../fixtures/base.fixture";
import { SignUpPage } from "../pages/signup.page";
import { SignInPage } from "../pages/signin.page";

test.describe("Auth", () => {
  test("should allow a newly registered user to sign in", async ({
    page,
    newUser,
  }) => {
    const signUpPage = new SignUpPage(page);
    const signInPage = new SignInPage(page);

    await test.step("Navigate to registration page", async () => {
      await signUpPage.navigate();
    });

    await test.step("Submit a valid registration form", async () => {
      await signUpPage.signUp(newUser);
    });

    await test.step("Validate successful redirect to sign in page", async () => {
      await signInPage.verifyIsLoaded();
    });

    await test.step("Sign in new user", async () => {
      await signInPage.signIn(newUser);
    });

    await test.step("Verify dashboard user is visible", async () => {
      await signInPage.expectUserSignedIn();
    });
  });
});
