import { z } from 'zod';
export declare const IssueCategoryEnum: z.ZodEnum<["DRINKING_WATER", "ROADS", "HEALTHCARE", "SANITATION", "ELECTRICITY", "EDUCATION", "PUBLIC_TRANSPORT", "DRAINAGE", "WASTE_MANAGEMENT", "OTHER"]>;
export declare const UrgencyEnum: z.ZodEnum<["LOW", "MEDIUM", "HIGH", "CRITICAL"]>;
export declare const ExtractionOutputSchema: z.ZodObject<{
    issueCategory: z.ZodEnum<["DRINKING_WATER", "ROADS", "HEALTHCARE", "SANITATION", "ELECTRICITY", "EDUCATION", "PUBLIC_TRANSPORT", "DRAINAGE", "WASTE_MANAGEMENT", "OTHER"]>;
    subCategory: z.ZodString;
    language: z.ZodString;
    normalizedText: z.ZodString;
    location: z.ZodObject<{
        address: z.ZodNullable<z.ZodString>;
        district: z.ZodNullable<z.ZodString>;
        ward: z.ZodNullable<z.ZodString>;
        latitude: z.ZodNullable<z.ZodNumber>;
        longitude: z.ZodNullable<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        address: string | null;
        district: string | null;
        ward: string | null;
        latitude: number | null;
        longitude: number | null;
    }, {
        address: string | null;
        district: string | null;
        ward: string | null;
        latitude: number | null;
        longitude: number | null;
    }>;
    urgency: z.ZodEnum<["LOW", "MEDIUM", "HIGH", "CRITICAL"]>;
    severity: z.ZodNumber;
    entities: z.ZodArray<z.ZodString, "many">;
    keywords: z.ZodArray<z.ZodString, "many">;
    confidence: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    issueCategory: "DRINKING_WATER" | "ROADS" | "HEALTHCARE" | "SANITATION" | "ELECTRICITY" | "EDUCATION" | "PUBLIC_TRANSPORT" | "DRAINAGE" | "WASTE_MANAGEMENT" | "OTHER";
    subCategory: string;
    language: string;
    normalizedText: string;
    location: {
        address: string | null;
        district: string | null;
        ward: string | null;
        latitude: number | null;
        longitude: number | null;
    };
    urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    severity: number;
    entities: string[];
    keywords: string[];
    confidence: number;
}, {
    issueCategory: "DRINKING_WATER" | "ROADS" | "HEALTHCARE" | "SANITATION" | "ELECTRICITY" | "EDUCATION" | "PUBLIC_TRANSPORT" | "DRAINAGE" | "WASTE_MANAGEMENT" | "OTHER";
    subCategory: string;
    language: string;
    normalizedText: string;
    location: {
        address: string | null;
        district: string | null;
        ward: string | null;
        latitude: number | null;
        longitude: number | null;
    };
    urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    severity: number;
    entities: string[];
    keywords: string[];
    confidence: number;
}>;
export type IssueCategory = z.infer<typeof IssueCategoryEnum>;
export type Urgency = z.infer<typeof UrgencyEnum>;
export type ExtractionOutput = z.infer<typeof ExtractionOutputSchema>;
