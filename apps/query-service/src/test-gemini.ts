import { GeminiClient } from "./ai/clients/gemini.client.js";

async function main() {
  try {
    const gemini = new GeminiClient();

    const response = await gemini.generate("Say Hello");
  } catch (error: any) {
    throw new Error(error);
  }
}

main();
