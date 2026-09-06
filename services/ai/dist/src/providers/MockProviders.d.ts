import { LLMProvider } from '../interfaces.js';
export declare class MockLLMProvider implements LLMProvider {
    private mockResponse;
    constructor(mockResponse: string);
    generateStructuredExtraction(prompt: string): Promise<string>;
}
export declare class MockSpeechProvider {
    transcribe(audioBuffer: Buffer): Promise<string>;
}
