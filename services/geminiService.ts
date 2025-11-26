import { GoogleGenAI, Type } from "@google/genai";
import { AIInsight, ElementData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getElementInsight = async (element: ElementData): Promise<AIInsight> => {
  if (!process.env.API_KEY) {
    return {
        funFact: "API Key is missing. Cannot fetch live data.",
        realWorldUse: "API Key is missing.",
        bondingBehavior: "Unknown"
    };
  }

  const prompt = `
    Provide 3 specific insights for the chemical element ${element.name} (${element.symbol}) suitable for a Grade 11 chemistry student.
    1. A surprising or fun fact.
    2. A concrete real-world application.
    3. A brief explanation of its bonding behavior (ionic/covalent tendencies).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            funFact: { type: Type.STRING },
            realWorldUse: { type: Type.STRING },
            bondingBehavior: { type: Type.STRING }
          },
          required: ["funFact", "realWorldUse", "bondingBehavior"]
        }
      }
    });

    const result = response.text;
    if (!result) throw new Error("No data returned");
    return JSON.parse(result) as AIInsight;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      funFact: `Could not load AI data for ${element.name}.`,
      realWorldUse: "Information unavailable.",
      bondingBehavior: "Information unavailable."
    };
  }
};