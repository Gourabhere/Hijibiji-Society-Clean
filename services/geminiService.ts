import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AnalysisResult {
  rating: number;
  feedback: string;
  isClean: boolean;
}

export const analyzeCleaningImage = async (base64Image: string, taskContext: string): Promise<AnalysisResult> => {
  try {
    const prompt = `
      You are a strict housekeeping supervisor inspector. 
      Analyze this image which claims to show completed work for: "${taskContext}".
      
      Determine:
      1. Is the area clean? (Boolean)
      2. Rate the cleanliness from 1 to 10 (10 being perfect).
      3. Provide short, constructive feedback (max 2 sentences).
      
      Look for: Garbage, dust, footprints, unmopped spots, or clutter.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Best for vision efficiency
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isClean: { type: Type.BOOLEAN },
            rating: { type: Type.NUMBER },
            feedback: { type: Type.STRING }
          },
          required: ["isClean", "rating", "feedback"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Gemini Vision Error:", error);
    // Fallback if AI fails
    return {
      isClean: true,
      rating: 0,
      feedback: "AI Verification unavailable. Please manually inspect."
    };
  }
};
