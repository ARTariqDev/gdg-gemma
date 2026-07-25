import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function askGemma(document, question) {
  const response = await ai.models.generateContent({
    model: "gemma-4-26b-a4b-it",
    contents: `
Document:
${document}

Question:
${question}
    `,
  });

  return response.text;
}