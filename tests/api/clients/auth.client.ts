import { ApiClient } from "../api.client";
import { UserCredentials } from "../../types/user.types";

/**
 * Auth domain client. Covers the /users and /users/login endpoints.
 * Each method maps to one API operation and handles the Conduit request envelope.
 */
export class AuthClient {
  constructor(private readonly client: ApiClient) {}

  /** POST /users — create a new account. */
  async register(user: UserCredentials): Promise<void> {
    await this.client.post("users", { user });
  }

  /** POST /users/login — authenticate an existing account. */
  async login(user: Pick<UserCredentials, "email" | "password">): Promise<void> {
    await this.client.post("users/login", { user });
  }
}
