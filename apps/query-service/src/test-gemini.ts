import { GeminiClient } from "./ai/clients/gemini.client.js";

async function main() {
  try {
    const gemini = new GeminiClient();

    console.log("Sending request to Gemini...\n");

    const response = await gemini.generate("Say Hello");

    console.log("Gemini Response:\n");
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

main();
