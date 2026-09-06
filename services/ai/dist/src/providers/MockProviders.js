"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockSpeechProvider = exports.MockLLMProvider = void 0;
class MockLLMProvider {
    mockResponse;
    constructor(mockResponse) {
        this.mockResponse = mockResponse;
    }
    async generateStructuredExtraction(prompt) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return this.mockResponse;
    }
}
exports.MockLLMProvider = MockLLMProvider;
class MockSpeechProvider {
    async transcribe(audioBuffer) {
        return "This is a mock transcription of citizen voice input.";
    }
}
exports.MockSpeechProvider = MockSpeechProvider;
