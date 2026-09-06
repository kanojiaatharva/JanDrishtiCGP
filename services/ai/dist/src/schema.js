"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractionOutputSchema = exports.UrgencyEnum = exports.IssueCategoryEnum = void 0;
const zod_1 = require("zod");
exports.IssueCategoryEnum = zod_1.z.enum([
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
exports.UrgencyEnum = zod_1.z.enum([
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
]);
exports.ExtractionOutputSchema = zod_1.z.object({
    issueCategory: exports.IssueCategoryEnum,
    subCategory: zod_1.z.string().describe('A more specific sub-category for the issue.'),
    language: zod_1.z.string().describe('The primary language of the original input.'),
    normalizedText: zod_1.z.string().describe('A clean, normalized English translation of the issue.'),
    location: zod_1.z.object({
        address: zod_1.z.string().nullable(),
        district: zod_1.z.string().nullable(),
        ward: zod_1.z.string().nullable(),
        latitude: zod_1.z.number().nullable(),
        longitude: zod_1.z.number().nullable()
    }).describe('Extracted location data. Use null if unknown.'),
    urgency: exports.UrgencyEnum,
    severity: zod_1.z.number().min(0).max(10).describe('A score from 0-10 indicating severity based on the citizen description.'),
    entities: zod_1.z.array(zod_1.z.string()).describe('List of named entities, organizations, or people mentioned.'),
    keywords: zod_1.z.array(zod_1.z.string()).describe('Tags and keywords.'),
    confidence: zod_1.z.number().min(0).max(1).describe('Model confidence in this extraction (0.0 to 1.0).')
});
