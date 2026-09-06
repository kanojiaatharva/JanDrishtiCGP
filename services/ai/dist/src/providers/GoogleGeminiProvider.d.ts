import { LLMProvider } from '../interfaces.js';
export declare class GoogleGeminiProvider implements LLMProvider {
    private ai;
    constructor(apiKey?: string);
    generateStructuredExtraction(prompt: string): Promise<string>;
}
