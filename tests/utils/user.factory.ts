import { UserCredentials } from "../types/user.types";
import { uniqueString } from "./random.util";

/**
 * Generates a unique user identity for test isolation.
 * @param suffix a value to add to randomness (e.g., worker index)
 * @returns a unique user
 */
export function createUserCredentials(suffix: number): UserCredentials {
  const username = `${uniqueString()}${suffix}`;

  return {
    username: username,
    email: `${username}@example.com`,
    password: "Password123!",
  };
}
