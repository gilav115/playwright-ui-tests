import { UserCredentials } from "../types/user.types";
import { uniqueString } from "./random.util";
import { env } from "../../config/env";
import { USERS } from "../../config/tags";

type UserEntry = typeof USERS[keyof typeof USERS];

const existingUsers = new Map<UserEntry, UserCredentials>([
  [USERS.USER,  { username: "testuser",  email: "testuser@example.com", password: env.testUserPassword }],
  [USERS.ADMIN, { username: "adminuser", email: "admin@example.com",    password: env.adminPassword }],
]);

export class UserFactory {
  /** Returns the pre-seeded credentials for the given role. */
  existing(role: UserEntry): UserCredentials {
    const credentials = existingUsers.get(role);
    if (!credentials) throw new Error(`No credentials defined for role: ${role.label}`);
    return credentials;
  }

  /** Creates a unique set of credentials for a throwaway test user. */
  create(suffix: number = 0): UserCredentials {
    const username = `${uniqueString()}${suffix}`;
    return {
      username,
      email: `${username}@example.com`,
      password: "Password123!",
    };
  }
}
