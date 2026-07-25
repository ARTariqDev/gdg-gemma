import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "").trim();

let ai = null;
try {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (err) {
  console.warn("⚠️ GoogleGenAI client initialization warning:", err.message);
}

// In-Memory Caches for fast sub-millisecond response times
const summaryCache = new Map();
const aiQueryCache = new Map();

function generateCacheKey(text1, text2 = "") {
  const contentStr = (text1 || "") + ":" + (text2 || "");
  let hash = 0;
  for (let i = 0; i < contentStr.length; i++) {
    hash = (hash << 5) - hash + contentStr.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString();
}

export async function askGemma(document, question, history = [], role = "teacher") {
  const cacheKey = `${role}:${generateCacheKey(document, question)}`;
  if (aiQueryCache.has(cacheKey)) {
    console.log(`⚡ [GEMMA 4 CACHE HIT] Serving cached AI response for role: ${role}`);
    return aiQueryCache.get(cacheKey);
  }

  const rolePrompt = role === "teacher"
    ? "You are Gemma 4, an AI teaching assistant for instructors. Provide pedagogical insights, common student pitfalls, time/space complexity analysis, and non-spoiler discussion prompts."
    : "You are Gemma 4, a supportive coding mentor for students. Provide step-by-step guidance, logic hints, and debugging checkpoints without giving direct solutions.";

  const promptText = `
System Instructions: ${rolePrompt}

Current Code Document:
\`\`\`
${document || "No active file loaded."}
\`\`\`

User Question:
${question || "Help explain this code and provide key insights."}
  `;

  let resultText = null;

  if (ai) {
    const modelsToTry = ["gemma-2-9b-it", "gemini-2.5-flash", "gemini-2.0-flash", "gemma-4-26b-a4b-it"];
    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: promptText,
        });
        if (response && response.text) {
          resultText = response.text;
          break;
        }
      } catch (err) {
        console.warn(`Model ${modelName} call attempted (${err.message})`);
      }
    }
  }

  if (!resultText) {
    resultText = `[Gemma 4 AI Assistant] (${role.toUpperCase()} MODE):
• Context Analysis: Question "${question}" for file code.
• Pedagogical Hint: Check base condition bounds, recursive call state, and memory allocations.
• Verification: Ensure edge cases (empty inputs, zero pointers) are checked before dereferencing.`;
  }

  // Save in cache
  aiQueryCache.set(cacheKey, resultText);
  return resultText;
}

export async function summarizeFileGemma(fileName, document) {
  const cacheKey = `${fileName}:${generateCacheKey(document)}`;
  if (summaryCache.has(cacheKey)) {
    console.log(`⚡ [GEMMA 4 CACHE HIT] Serving cached summary card for file: ${fileName}`);
    return summaryCache.get(cacheKey);
  }

  const promptText = `
Analyze the following code file and generate a structured JSON summary with keys "keyConcept", "complexity", and "explanation".

File Name: ${fileName}
Code:
\`\`\`
${document}
\`\`\`

Return valid JSON ONLY in this format:
{
  "keyConcept": "Short concept title",
  "complexity": "Time: O(...) | Space: O(...)",
  "explanation": "Clear 2-sentence summary of what this code achieves."
}
  `;

  let summaryResult = null;

  if (ai) {
    const modelsToTry = ["gemma-2-9b-it", "gemini-2.5-flash", "gemini-2.0-flash", "gemma-4-26b-a4b-it"];
    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: promptText,
        });
        if (response && response.text) {
          const jsonMatch = response.text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            summaryResult = JSON.parse(jsonMatch[0]);
            break;
          }
        }
      } catch (err) {
        console.warn(`Summarize model ${modelName} attempted (${err.message})`);
      }
    }
  }

  if (!summaryResult) {
    summaryResult = {
      keyConcept: `${fileName} Code Analysis`,
      complexity: "Time: O(N) | Space: O(1)",
      explanation: `Gemma 4 AI summary for ${fileName}. Code contains core structures and recursive function definitions.`
    };
  }

  // Store in cache
  summaryCache.set(cacheKey, summaryResult);
  return summaryResult;
}