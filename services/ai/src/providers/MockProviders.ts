import { LLMProvider } from '../interfaces.js';

export class MockLLMProvider implements LLMProvider {
  constructor(private mockResponse: string) {}

  async generateStructuredExtraction(prompt: string): Promise<string> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.mockResponse;
  }
}

export class MockSpeechProvider {
  async transcribe(audioBuffer: Buffer): Promise<string> {
    return "This is a mock transcription of citizen voice input.";
  }
}
