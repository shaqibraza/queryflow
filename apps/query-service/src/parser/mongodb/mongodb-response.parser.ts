import { MongoCommand } from "@queryflow/shared";
import { ResponseParser } from "../interfaces/response-parser.js";

export class MongoDbResponseParser implements ResponseParser<string, MongoCommand> {
  parse(response: string): MongoCommand {
    const cleaned = response
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    try {
      return JSON.parse(cleaned) as MongoCommand;
    } catch {
      throw new Error("Gemini returned invalid MongoDB JSON.");
    }
  }
}
