/**
 * Base HTTP client. Owns the transport layer: base URL, shared headers, and
 * the raw fetch calls. Domain clients (AuthClient, ArticleClient, …) receive
 * an instance of this class and never construct URLs or headers themselves.
 */
export class ApiClient {
  constructor(private readonly baseUrl: string) {}

  async get(path: string): Promise<Response> {
    return fetch(`${this.baseUrl}${path}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
    });
  }

  async post(path: string, body: unknown): Promise<Response> {
    return fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
  }

  async put(path: string, body: unknown): Promise<Response> {
    return fetch(`${this.baseUrl}${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
  }

  async patch(path: string, body: unknown): Promise<Response> {
    return fetch(`${this.baseUrl}${path}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
  }

  async delete(path: string): Promise<Response> {
    return fetch(`${this.baseUrl}${path}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
    });
  }
}
