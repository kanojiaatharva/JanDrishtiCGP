import { LLMProvider } from '../interfaces.js';
import { GoogleGenAI } from '@google/genai';

export class GoogleGeminiProvider implements LLMProvider {
  private ai: GoogleGenAI;
  
  constructor(apiKey?: string) {
    // Falls back to GEMINI_API_KEY from environment if not explicitly passed
    this.ai = new GoogleGenAI({ apiKey }); 
  }

  async generateStructuredExtraction(prompt: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return response.text || "{}";
  }
}
