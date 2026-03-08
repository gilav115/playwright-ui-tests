import { randomUUID } from "node:crypto";
import { Article } from "../types/article.types";

export class ArticleFactory {
  private random(): string {
    return Math.random().toString(36).slice(2, 8);
  }

  /**
   * Create a fake article content.
   * The content is designed to be unique by using a UUID for each generated article.
   * @param tagsCount number of tags to generate
   * @returns a unique article object
   */
  create(tagsCount: number = 0): Article {
    const tags = Array.from({ length: tagsCount }, () => this.random());

    const id = randomUUID();
    return {
      title: `Article ${id}`,
      description: `About ${id}`,
      body: `Content ${id}`,
      tagList: tags,
    };
  }
}
