"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleGeminiProvider = void 0;
const genai_1 = require("@google/genai");
class GoogleGeminiProvider {
    ai;
    constructor(apiKey) {
        // Falls back to GEMINI_API_KEY from environment if not explicitly passed
        this.ai = new genai_1.GoogleGenAI({ apiKey });
    }
    async generateStructuredExtraction(prompt) {
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
exports.GoogleGeminiProvider = GoogleGeminiProvider;
