import { MongoCommand } from "@queryflow/shared";

export class MongoCommandParser {
  static parse(content: string): MongoCommand {
    try {
      return JSON.parse(content) as MongoCommand;
    } catch {
      throw new Error("Gemini returned invalid MongoDB JSON.");
    }
  }
}
