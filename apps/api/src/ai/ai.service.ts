import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  async extractInformation(text: string) {
    // In a real application, this would call Vertex AI or Gemini
    // with a strict schema to extract information.
    // For this MVP, we return a mocked structured response.

    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI delay

    return {
      issue: 'Extracted Issue from: ' + text.substring(0, 30) + '...',
      location: 'Ward 14 (Simulated)',
      category: 'Infrastructure',
      urgency: 7,
      description: text,
      normalizedText: text,
    };
  }
}
