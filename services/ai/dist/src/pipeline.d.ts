import { LLMProvider } from './interfaces.js';
import { ExtractionOutput } from './schema.js';
export declare class AIPipeline {
    private llmProvider;
    constructor(llmProvider: LLMProvider);
    /**
     * Processes raw citizen text and returns strictly validated structured data.
     */
    extractInformation(rawText: string, maxRetries?: number): Promise<{
        data: ExtractionOutput;
        rawString: string;
    }>;
}
