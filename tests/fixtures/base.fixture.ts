import { test as base, request } from "@playwright/test";
import { createUserCredentials } from "../utils/user.factory";
import { UserCredentials } from "../types/user.types";
import { ConduitApi } from "./api.fixtures";
import { env } from "../../config/env";
import { ArticleFactory } from "../utils/article.factory";
import { ArticleComment } from "../types/comment.types";

/**
 * Custom fixture types for the extended Playwright test.
 */
type Fixtures = {
  newUser: UserCredentials;
  api: ConduitApi;
  articleFactory: ArticleFactory;
  userFactory: (suffix: number) => UserCredentials;
  commentFactory: (body: string) => ArticleComment;
};

/**
 * Extends the base Playwright test to provide a 'newUser' fixture.
 * The user is only generated if requested by the test (Lazy Loading).
 */

export const test = base.extend<Fixtures>({
  newUser: async ({}, use, testInfo) => {
    const user = createUserCredentials(testInfo.workerIndex);
    await use(user);
  },

  api: async ({}, use) => {
    await use(
      new ConduitApi(await request.newContext({ baseURL: env.apiUrl })),
    );
  },

  /**
   * Generates a new article object for tests.
   *
   * Usage:
   * ```ts
   * const article = articleFactory.create();
   * ```
   */
  articleFactory: async ({}, use) => {
    await use(new ArticleFactory());
  },

  /**
   * Generates a new user object for tests.
   *
   * Usage:
   * ```ts
   * const user = userFactory(<value>);
   * ```
   */
  userFactory: async ({}, use) => {
    await use(createUserCredentials);
  },

  /**
   * Generates a new comment object for tests.
   *
   * Usage:
   * ```ts
   * const comment = commentFactory(<value>);
   * ```
   */
  commentFactory: async ({}, use) => {
    await use(
      (body: string): ArticleComment => ({
        comment: { body },
      }),
    );
  },
});

export { expect } from "@playwright/test";
