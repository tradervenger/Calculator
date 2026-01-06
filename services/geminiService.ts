
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function solveMathProblem(query: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Solve this math problem or explain this expression: "${query}". Keep the answer concise and clear, ideally just the result if it's a simple calculation, or a brief explanation if it's a word problem.`,
      config: {
        temperature: 0.1,
        maxOutputTokens: 200,
      }
    });
    
    return response.text || "Sorry, I couldn't solve that.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to AI. Check your connection.";
  }
}
