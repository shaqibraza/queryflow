import { GoogleGenAI } from "@google/genai";
import { env } from "../../config/env.js";
import { ResponseCleaner } from "../utils/response-cleaner.js";

export class GeminiClient {
  private readonly client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY
    });
  }

  async generate(prompt: string): Promise<string> {
    const response = await this.client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt
    });

    const text = response.text ?? "";

    return ResponseCleaner.clean(text);
  }
}
