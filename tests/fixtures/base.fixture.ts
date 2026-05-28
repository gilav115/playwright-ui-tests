import { test as base } from "@playwright/test";
import { UserFactory } from "../utils/user.factory";
import { ClientFactory } from "../api/client.factory";
import { UserCredentials } from "../types/user.types";

type Fixtures = {
  newUser: UserCredentials;
  api: ClientFactory;
  userFactory: UserFactory;
};

export const test = base.extend<Fixtures>({
  userFactory: async ({}, use) => {
    await use(new UserFactory());
  },
  newUser: async ({ userFactory }, use, testInfo) => {
    await use(userFactory.create(testInfo.workerIndex));
  },
  api: async ({}, use) => {
    await use(new ClientFactory());
  },
});

export { expect } from "@playwright/test";
