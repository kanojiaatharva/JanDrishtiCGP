"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIPipeline = void 0;
const schema_js_1 = require("./schema.js");
const v1_extraction_prompt_js_1 = require("../prompts/v1_extraction.prompt.js");
class AIPipeline {
    llmProvider;
    constructor(llmProvider) {
        this.llmProvider = llmProvider;
    }
    /**
     * Processes raw citizen text and returns strictly validated structured data.
     */
    async extractInformation(rawText, maxRetries = 2) {
        let attempt = 0;
        let lastError = null;
        let basePrompt = v1_extraction_prompt_js_1.EXTRACTION_PROMPT_V1.replace('{{INPUT_TEXT}}', rawText);
        while (attempt <= maxRetries) {
            try {
                const rawJsonString = await this.llmProvider.generateStructuredExtraction(basePrompt);
                let parsedJson;
                try {
                    parsedJson = JSON.parse(rawJsonString);
                }
                catch (e) {
                    throw new Error("LLM did not return valid JSON syntax.");
                }
                // Validate strictly against Zod Schema
                const validatedData = schema_js_1.ExtractionOutputSchema.parse(parsedJson);
                return { data: validatedData, rawString: rawJsonString };
            }
            catch (error) {
                lastError = error;
                attempt++;
                // Append error instructions for the retry
                if (attempt <= maxRetries) {
                    console.warn(`[AIPipeline] Validation failed on attempt ${attempt}. Retrying...`);
                    basePrompt += `\n\n[SYSTEM] Your previous response failed validation with the following error: ${error.message}. PLEASE FIX THIS AND RETURN ONLY VALID JSON.`;
                }
            }
        }
        // Never silently invent fields. Throw the error upwards.
        throw new Error(`AIPipeline failed to extract valid data after ${maxRetries} retries. Last error: ${lastError.message}`);
    }
}
exports.AIPipeline = AIPipeline;
