import { Injectable } from '@nestjs/common';
import { AIPipeline, MockLLMProvider, GoogleGeminiProvider } from '@jandrishti/ai';

@Injectable()
export class AiService {
  private pipeline: AIPipeline;

  constructor() {
    // If we have an API key, use it. Otherwise, fallback to the Mock provider for Demo Mode.
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (apiKey) {
       this.pipeline = new AIPipeline(new GoogleGeminiProvider(apiKey));
    } else {
       // Deterministic mock fallback
       const mockJson = JSON.stringify({
          issueCategory: 'ROADS',
          subCategory: 'Potholes',
          language: 'en',
          normalizedText: 'There is a large pothole on Main Street near the hospital causing severe traffic jams.',
          location: { address: 'Main Street near the hospital', district: null, ward: null, latitude: null, longitude: null },
          urgency: 'HIGH',
          severity: 8,
          entities: ['Main Street', 'hospital'],
          keywords: ['pothole', 'traffic', 'jam'],
          confidence: 0.92
       });
       this.pipeline = new AIPipeline(new MockLLMProvider(mockJson));
    }
  }

  async extractInformation(text: string) {
    const startTime = Date.now();
    try {
      const result = await this.pipeline.extractInformation(text);
      
      // Transform into the expected output for the frontend/reports layer
      return {
        issue: result.data.subCategory || result.data.issueCategory,
        location: result.data.location.address || 'Unknown',
        category: result.data.issueCategory,
        urgency: result.data.severity, // Or map HIGH to numeric if preferred
        description: text,
        normalizedText: result.data.normalizedText,
        
        // Metadata for AIAnalysis persistence
        _aiMetadata: {
           model: 'gemini-2.5-flash',
           modelVersion: 'v1',
           promptVersion: 'v1_extraction',
           latency: Date.now() - startTime,
           confidence: result.data.confidence,
           structuredResult: JSON.stringify(result.data)
        }
      };
    } catch (err: any) {
      throw new Error(`AI Extraction failed: ${err.message}`);
    }
  }
}
