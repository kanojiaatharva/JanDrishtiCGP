import { REPORT_STATUSES, USER_ROLES } from '@jandrishti/types';
import { z } from 'zod';

export const userRoleSchema = z.enum(USER_ROLES);
export const reportStatusSchema = z.enum(REPORT_STATUSES);
export const issueCategorySchema = z.enum([
  'WATER',
  'ROADS',
  'HEALTH',
  'EDUCATION',
  'SANITATION',
  'ELECTRICITY',
  'TRANSPORT',
  'PUBLIC_SAFETY',
  'HOUSING',
  'OTHER',
]);

export const locationSchema = z.object({
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  source: z.enum([
    'USER_CONFIRMED',
    'WHATSAPP_SHARED',
    'MAP_SELECTED',
    'VERIFIED_ADDRESS',
    'ADMINISTRATIVE_MAPPING',
    'OFFICER_CORRECTED',
    'AI_EXTRACTED_MENTION',
  ]),
  confidence: z.number().min(0).max(1).optional(),
});

export const priorityComponentsSchema = z.object({
  demand: z.number().min(0).max(100),
  severity: z.number().min(0).max(100),
  needGap: z.number().min(0).max(100),
  infrastructureGap: z.number().min(0).max(100),
  populationNeed: z.number().min(0).max(100),
  planGap: z.number().min(0).max(100),
});

export const reportDraftSchema = z.object({
  sourceChannel: z.enum(['MOBILE', 'WEB', 'WHATSAPP', 'IVR', 'KIOSK']),
  language: z.string().trim().min(2).max(10),
  category: issueCategorySchema,
  subcategory: z.string().trim().min(1).max(100),
  summary: z.string().trim().min(1).max(500),
  description: z.string().trim().min(1).max(5000),
  location: locationSchema,
  severity: z.number().int().min(1).max(5),
  urgency: z.number().int().min(1).max(5),
});

export const aiStructuredIssueSchema = z.object({
  category: issueCategorySchema,
  subcategory: z.string().trim().min(1).max(100),
  summary: z.string().trim().min(1).max(500),
  severity: z.number().int().min(1).max(5),
  urgency: z.number().int().min(1).max(5),
  entities: z.array(z.string().trim().min(1).max(100)).max(25),
  location: locationSchema,
  confidence: z.number().min(0).max(1),
});

export const recommendationDecisionSchema = z.object({
  decision: z.enum(['APPROVE', 'REJECT', 'REQUEST_MORE_EVIDENCE']),
  reason: z.string().trim().min(1).max(1000),
  notes: z.string().trim().max(5000).optional(),
});

export const apiSuccessSchema = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    data,
    meta: z.object({ requestId: z.string().min(1) }),
  });

export type ReportDraft = z.infer<typeof reportDraftSchema>;
export type AiStructuredIssue = z.infer<typeof aiStructuredIssueSchema>;
