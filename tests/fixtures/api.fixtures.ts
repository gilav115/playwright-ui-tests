import { APIRequestContext, APIResponse } from "@playwright/test";
import { UserCredentials } from "../types/user.types";
import { Article } from "../types/article.types";
import { ArticleComment } from "../types/comment.types";

export class ConduitApi {
  constructor(private request: APIRequestContext) {}

  private token?: string;

  setToken(token: string) {
    this.token = token;
  }

  /**
   * Sign up a user based on provided credentials
   * @param user user credentials
   * @returns API response
   */
  async register(user: UserCredentials): Promise<APIResponse> {
    return this.request.post("users", { data: { user } });
  }

  /**
   * Sign in a user based on provided credentials
   * @param user user credentials
   * @returns API response
   */
  async signIn(user: UserCredentials): Promise<APIResponse> {
    return this.request.post("users/login", {
      data: {
        user: {
          email: user.email,
          password: user.password,
        },
      },
    });
  }

  /**
   * Publish an article
   * @param article article to publish
   * @returns API response
   */
  async publishArticle(article: Article): Promise<APIResponse> {
    return this.request.post("articles", {
      data: { article },
      headers: { Authorization: `Token ${this.token}` },
    });
  }

  /**
   * Sign up and then sign in user based on provided credentials
   * @param user user credentials
   * @returns API response
   */
  async auth(user: UserCredentials): Promise<APIResponse> {
    await this.register(user);
    return this.signIn(user);
  }

  /**
   * The current user, who owns the auth token, will follow the provided user by username
   * @param username user name of the user we want to follow
   * @returns API response
   */
  async follow(username: string): Promise<APIResponse> {
    return this.request.post(`profiles/${username}/follow`, {
      headers: { Authorization: `Token ${this.token}` },
    });
  }

  /**
   * Add a comment to a published article
   * @param article name of the article. used in the call path
   * @param comment the comment body
   * @returns
   */
  async commentOnArticle(article: Article, comment: ArticleComment) {
    const slug = article.title.toLowerCase().replace(/\s+/g, "-");
    return this.request.post(`articles/${slug}/comments`, {
      data: comment,
      headers: { Authorization: `Token ${this.token}` },
    });
  }
}
