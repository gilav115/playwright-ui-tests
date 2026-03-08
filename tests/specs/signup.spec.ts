import { test, expect } from "../fixtures/base.fixture";
import { SignUpPage } from "../pages/signup.page";
import { SignInPage } from "../pages/signin.page";

/**
 * User fields for registration
 */
type Field = "username" | "email" | "password";

/**
 * Which conflicts are possible in user registration
 */
type Conflict = "email" | "username" | "email and username";

test.describe("Sign Up", () => {
  test.describe("User Registration", () => {
    test("should register a new account with a unique identity", async ({
      page,
      newUser,
    }) => {
      const signUpPage = new SignUpPage(page);

      await test.step("Navigate to registration page", async () => {
        await signUpPage.navigate();
      });

      await test.step("Submit a valid registration form", async () => {
        await signUpPage.signUp(newUser);
      });

      await test.step("Validate successful redirect to sign in page", async () => {
        const signinPage = new SignInPage(page);
        await signinPage.verifyIsLoaded();
      });
    });
  });

  test.describe("Form Validation", () => {
    let signUpPage: SignUpPage;

    test.beforeEach(async ({ page }) => {
      signUpPage = new SignUpPage(page);
      await test.step("Navigate to registration page", async () => {
        await signUpPage.navigate();
      });
    });

    const validationCases: {
      field: Field;
      value: string;
      description: string;
    }[] = [
      { field: "username", value: "", description: "missing username" },
      { field: "email", value: "", description: "missing email" },
      { field: "password", value: "", description: "missing password" },
      { field: "email", value: "invalid-email", description: "invalid email" },
    ];

    for (const c of validationCases) {
      test(`should prevent registration when ${c.description}`, async ({
        newUser,
      }) => {
        const user: typeof newUser = { ...newUser, [c.field]: c.value };
        await signUpPage.fillForm(user);
        await expect(
          signUpPage.signUpButton,
          "SignUp button should be disabled for invalid credentials",
        ).toBeDisabled();
      });
    }
  });

  test.describe("Registration Constraints", () => {
    const scenarios: {
      conflict: Conflict;
      unique: { email: boolean; username: boolean };
    }[] = [
      {
        conflict: "email",
        unique: { email: false, username: true },
      },
      {
        conflict: "username",
        unique: { email: true, username: false },
      },
      {
        conflict: "email and username",
        unique: { email: false, username: false },
      },
    ];

    for (const { conflict, unique } of scenarios) {
      test(`should handle existing ${conflict} conflict`, async ({
        page,
        newUser,
        api,
      }) => {
        const signUpPage = new SignUpPage(page);

        await test.step("Create existing user via API", async () => {
          const seededUser = { ...newUser };
          if (unique.email) {
            seededUser.email = `other_${newUser.email}`;
          }
          if (unique.username) {
            seededUser.username = `other_${newUser.username}`;
          }

          const response = await api.register(seededUser);
          await expect(response, "Create user via API failed").toBeOK();
        });

        await test.step("Navigate to registration page", async () => {
          await signUpPage.navigate();
        });

        await test.step(`Register user with existing ${conflict}`, async () => {
          await signUpPage.fillForm(newUser);
          await signUpPage.signUpClick();

          if (!unique.email)
            await expect(
              signUpPage.emailAlreadyExist,
              "Register existing email error missing",
            ).toBeVisible();
          if (!unique.username)
            await expect(
              signUpPage.usernameAlreadyExist,
              "Register existing username error missing",
            ).toBeVisible();
        });
      });
    }
  });
});
