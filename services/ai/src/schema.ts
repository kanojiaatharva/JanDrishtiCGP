import { z } from 'zod';

export const IssueCategoryEnum = z.enum([
  'DRINKING_WATER',
  'ROADS',
  'HEALTHCARE',
  'SANITATION',
  'ELECTRICITY',
  'EDUCATION',
  'PUBLIC_TRANSPORT',
  'DRAINAGE',
  'WASTE_MANAGEMENT',
  'OTHER'
]);

export const UrgencyEnum = z.enum([
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL'
]);

export const ExtractionOutputSchema = z.object({
  issueCategory: IssueCategoryEnum,
  subCategory: z.string().describe('A more specific sub-category for the issue.'),
  language: z.string().describe('The primary language of the original input.'),
  normalizedText: z.string().describe('A clean, normalized English translation of the issue.'),
  location: z.object({
    address: z.string().nullable(),
    district: z.string().nullable(),
    ward: z.string().nullable(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable()
  }).describe('Extracted location data. Use null if unknown.'),
  urgency: UrgencyEnum,
  severity: z.number().min(0).max(10).describe('A score from 0-10 indicating severity based on the citizen description.'),
  entities: z.array(z.string()).describe('List of named entities, organizations, or people mentioned.'),
  keywords: z.array(z.string()).describe('Tags and keywords.'),
  confidence: z.number().min(0).max(1).describe('Model confidence in this extraction (0.0 to 1.0).')
});

export type IssueCategory = z.infer<typeof IssueCategoryEnum>;
export type Urgency = z.infer<typeof UrgencyEnum>;
export type ExtractionOutput = z.infer<typeof ExtractionOutputSchema>;
