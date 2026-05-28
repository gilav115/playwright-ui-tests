import { ApiClient } from "./api.client";
import { AuthClient } from "./clients/auth.client";
import { env } from "../../config/env";

export class ClientFactory {
  readonly auth: AuthClient;

  constructor() {
    const base = new ApiClient(env.apiUrl);
    this.auth = new AuthClient(base);
  }
}
