import { AIPipeline } from '../pipeline.js';
import { MockLLMProvider } from '../providers/MockProviders.js';

describe('AIPipeline', () => {
  it('should successfully parse valid JSON matching the schema', async () => {
    const validJson = JSON.stringify({
      issueCategory: 'DRINKING_WATER',
      subCategory: 'Pipeline Leak',
      language: 'en',
      normalizedText: 'Water pipeline is leaking near main street.',
      location: {
        address: 'Main Street',
        district: null,
        ward: null,
        latitude: null,
        longitude: null
      },
      urgency: 'HIGH',
      severity: 8,
      entities: ['Main Street'],
      keywords: ['leak', 'water'],
      confidence: 0.95
    });

    const mockProvider = new MockLLMProvider(validJson);
    const pipeline = new AIPipeline(mockProvider);

    const result = await pipeline.extractInformation('Water pipeline is leaking near main street.');
    
    expect(result.data.issueCategory).toBe('DRINKING_WATER');
    expect(result.data.severity).toBe(8);
  });

  it('should fail after max retries if JSON is always invalid', async () => {
    const invalidJson = JSON.stringify({
      issueCategory: 'UNKNOWN_CATEGORY_NOT_IN_ENUM',
      // missing required fields
    });

    const mockProvider = new MockLLMProvider(invalidJson);
    const pipeline = new AIPipeline(mockProvider);

    await expect(pipeline.extractInformation('Some text', 1)).rejects.toThrow(/AIPipeline failed to extract valid data/);
  });
});
