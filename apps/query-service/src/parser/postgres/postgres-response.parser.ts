import { ResponseParser } from "../interfaces/response-parser.js";

export class PostgresResponseParser implements ResponseParser<string, string> {
  parse(response: string): string {
    return response
      .replace(/```sql/gi, "")
      .replace(/```/g, "")
      .trim();
  }
}
