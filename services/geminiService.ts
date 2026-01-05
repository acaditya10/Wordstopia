import { GoogleGenAI, Type } from "@google/genai";

/**
 * Fetches AI-generated context for a word, including mnemonics, etymology, and usage tips.
 * Uses the gemini-3-pro-preview model for world-class linguistic analysis.
 */
export const getDeepContext = async (word: string) => {
  try {
    // Initializing the AI client inside the function ensures it always picks up
    // the latest process.env.API_KEY, which is standard for Vercel environment variables.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      // Upgraded to Pro for complex linguistic reasoning and etymology tasks
      model: 'gemini-3-pro-preview',
      contents: `Provide a deep context for the word "${word}". Include:
      1. A memorable mnemonic device to remember its meaning.
      2. A brief etymology (origin) in one sentence.
      3. A unique usage tip.
      Keep it professional, engaging, and concise.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mnemonic: { 
              type: Type.STRING,
              description: "A short, clever memory aid for the word."
            },
            etymology: { 
              type: Type.STRING,
              description: "The historical origin of the word in a single sentence."
            },
            usageTip: { 
              type: Type.STRING,
              description: "A tip on how to use the word correctly in conversation or writing."
            },
          },
          required: ["mnemonic", "etymology", "usageTip"],
        },
      },
    });

    if (!response.text) {
      throw new Error("Empty response from AI model.");
    }

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Deep Context Error:", error);
    return null;
  }
};