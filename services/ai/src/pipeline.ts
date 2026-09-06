import { LLMProvider } from './interfaces.js';
import { ExtractionOutputSchema, ExtractionOutput } from './schema.js';
import { EXTRACTION_PROMPT_V1 } from '../prompts/v1_extraction.prompt.js';

export class AIPipeline {
  constructor(private llmProvider: LLMProvider) {}

  /**
   * Processes raw citizen text and returns strictly validated structured data.
   */
  async extractInformation(rawText: string, maxRetries = 2): Promise<{ data: ExtractionOutput, rawString: string }> {
    let attempt = 0;
    let lastError: any = null;

    let basePrompt = EXTRACTION_PROMPT_V1.replace('{{INPUT_TEXT}}', rawText);

    while (attempt <= maxRetries) {
      try {
        const rawJsonString = await this.llmProvider.generateStructuredExtraction(basePrompt);
        
        let parsedJson;
        try {
           parsedJson = JSON.parse(rawJsonString);
        } catch (e) {
           throw new Error("LLM did not return valid JSON syntax.");
        }

        // Validate strictly against Zod Schema
        const validatedData = ExtractionOutputSchema.parse(parsedJson);

        return { data: validatedData, rawString: rawJsonString };
      } catch (error: any) {
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
