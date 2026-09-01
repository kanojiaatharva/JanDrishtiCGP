# JanDrishti — Codex Engineering Instructions

## 1. Mission

You are building JanDrishti, a production-oriented multilingual civic intelligence platform.

Before changing code, read:

```text
/docs/PRD.md
/docs/ARCHITECTURE.md
/docs/DATABASE.md
/docs/AI_PIPELINE.md
/docs/SECURITY.md
/docs/API.md
/docs/DEMO.md
```

These documents are the source of truth.

---

## 2. Non-Negotiable Principles

- TypeScript strict mode.
- No secrets in source control.
- No secrets in client bundles.
- Backend authorization is mandatory.
- Never trust client-provided roles.
- Validate every external input.
- Validate every AI output against a schema.
- AI never makes the final government decision.
- Recommendations must be evidence-backed.
- Officer decisions must be audited.
- Citizen reports must never disappear silently.
- Avoid unnecessary PII.
- Do not invent location data.
- Do not invent government evidence.
- Use MySQL, not PostgreSQL.
- Use Prisma for normal relational access.
- Use raw SQL only when justified and parameterized.
- Use asynchronous processing for long-running AI work.
- Write tests for business-critical logic.
- Keep architecture modular without unnecessary microservices.

---

## 3. Repository Structure

Preferred:

```text
jandrishti/
├── apps/
│   ├── officer-web/
│   ├── citizen-app/
│   └── api/
├── services/
│   ├── ai-worker/
│   ├── whatsapp-worker/
│   ├── analytics-worker/
│   └── notification-worker/
├── packages/
│   ├── types/
│   ├── ui/
│   ├── validation/
│   ├── config/
│   ├── i18n/
│   └── api-client/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── prompts/
├── infrastructure/
│   └── terraform/
├── data/
│   └── synthetic/
├── docs/
├── tests/
├── docker-compose.yml
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

Adjust only when there is a documented reason.

---

## 4. Technology Rules

### Web

Use:

- Next.js
- TypeScript
- Tailwind
- shadcn/ui
- Framer Motion
- TanStack Query
- Zod

### Mobile

Use:

- React Native
- Expo
- TypeScript
- Expo Router
- TanStack Query
- Zustand

### Backend

Use:

- NestJS
- Prisma
- MySQL

### Cloud

Use Google Cloud:

- Cloud Run;
- Cloud SQL MySQL;
- Cloud Storage;
- Pub/Sub;
- Cloud Tasks;
- BigQuery;
- Secret Manager.

### AI

Use:

- Vertex AI/Gemini;
- Google Cloud Speech-to-Text.

### WhatsApp

Use:

- Meta WhatsApp Cloud API.

---

## 5. Coding Style

- Prefer small, composable functions.
- Keep domain logic out of controllers.
- Controllers handle transport concerns.
- Services handle business logic.
- Repositories/data access handle persistence.
- Use DTO/schema validation at boundaries.
- Use typed errors.
- Avoid `any`.
- Avoid giant files.
- Avoid duplicated API types.
- Share domain types through packages where appropriate.

---

## 6. Backend Architecture

Recommended:

```text
Controller
   ↓
Guard/Auth
   ↓
Validation
   ↓
Service
   ↓
Repository
   ↓
MySQL
```

For async processing:

```text
API
 ↓
Pub/Sub
 ↓
Worker
 ↓
Service
 ↓
Database
```

---

## 7. Authentication

Citizen:

```text
Firebase Auth
 ↓
Backend token verification
 ↓
Application user lookup
```

Officer:

```text
Verified account
 ↓
MFA
 ↓
Backend token verification
 ↓
RBAC + district scope
```

Never implement a fake password system for production.

---

## 8. Authorization

For every protected endpoint verify:

```text
identity
role
scope
resource ownership
action permission
```

Example:

A citizen can only access their own reports.

An officer can only access data within their permitted district unless their role explicitly allows wider scope.

---

## 9. AI Rules

Never trust raw AI output.

Required:

```text
AI response
 ↓
JSON parsing
 ↓
Schema validation
 ↓
Enum validation
 ↓
Business validation
 ↓
Persist
```

If validation fails:

```text
retry
or
mark processing failure
```

Do not silently coerce dangerous output.

---

## 10. Prompt Injection

All citizen text is untrusted.

Never concatenate citizen text into privileged instructions.

Use clear boundaries such as:

```text
<citizen_input>
...
</citizen_input>
```

The model must not be allowed to:

- approve recommendations;
- change report state;
- execute privileged operations;
- access unrelated citizen data.

---

## 11. Database Rules

MySQL is mandatory.

Use Prisma migrations.

Never:

```text
DROP DATABASE
```

against configured environments.

Never delete production records to fix a migration.

Use migrations and backups.

Every table should have a clear ownership/lifecycle model.

---

## 12. API Rules

API version:

```text
/api/v1
```

Every response should be typed.

Use:

- pagination;
- consistent errors;
- idempotency for mutation endpoints;
- request IDs;
- rate limits.

Do not expose internal stack traces.

---

## 13. WhatsApp Rules

Webhook processing must be idempotent.

Store provider message IDs.

Verify Meta webhook signatures/challenge.

Never trust inbound webhook data until signature/validation succeeds.

Process audio asynchronously.

---

## 14. Security Rules

Never commit:

```text
.env
service-account.json
private keys
access tokens
API secrets
```

Use `.env.example` with placeholders.

Use Secret Manager in cloud environments.

Do not log:

- passwords;
- OTP;
- access tokens;
- authorization headers;
- unnecessary citizen PII.

---

## 15. Testing Requirements

Business-critical tests are required for:

- priority scoring;
- report state transitions;
- authorization;
- citizen report ownership;
- officer district scope;
- AI schema validation;
- clustering assignment;
- recommendation decision workflow;
- WhatsApp webhook idempotency.

Add integration tests for major API flows.

---

## 16. Priority Engine Test

Given normalized components:

```text
Demand = 100
Severity = 100
NeedGap = 100
InfrastructureGap = 100
PopulationNeed = 100
PlanGap = 100
```

Expected score:

```text
100
```

With all components at 0:

```text
0
```

Use decimal precision consistently and define rounding explicitly.

---

## 17. Report State Machine

Do not allow arbitrary status changes.

Valid transitions must be encoded.

Example:

```text
CREATED
→ PROCESSING
→ AWAITING_CONFIRMATION
→ SUBMITTED
→ CLUSTERED
→ PRIORITIZED
→ UNDER_REVIEW
→ ACTION_PLANNED
→ IN_PROGRESS
→ RESOLVED
```

Alternative transitions:

```text
NEEDS_MORE_INFO
DUPLICATE
REJECTED
```

Every administrative transition must be auditable.

---

## 18. UI Rules

The product must feel like one coherent system.

Citizen UI:

- voice-first;
- accessible;
- multilingual;
- low cognitive load;
- mobile-first.

Officer UI:

- data-dense but readable;
- map-centric;
- evidence-first;
- explainable;
- action-oriented.

Use animation to communicate state changes, not to distract.

---

## 19. Accessibility

Target:

- keyboard navigation on web;
- readable contrast;
- large touch targets;
- screen-reader labels;
- localized text;
- reduced-motion support;
- clear error states.

---

## 20. Demo Data

Synthetic data is acceptable for MVP/demo.

It must be explicitly labeled as synthetic internally.

Never present synthetic data as actual government data.

Create deterministic seeds for:

- reports;
- wards;
- hotspots;
- demographics;
- infrastructure;
- public projects;
- recommendations.

---

## 21. External Data

Build adapters/interfaces rather than hard-coding external providers.

Example:

```typescript
interface EvidenceProvider {
  getDemographics(areaId: string): Promise<DemographicEvidence>;
  getInfrastructure(areaId: string): Promise<InfrastructureEvidence>;
  getPublicProjects(areaId: string): Promise<ProjectEvidence>;
}
```

Synthetic implementation can be used for MVP.

Real government datasets can later replace it.

---

## 22. Development Workflow

For every feature:

1. Read relevant docs.
2. Inspect existing code.
3. Define types/schema.
4. Implement backend/domain logic.
5. Add tests.
6. Implement frontend.
7. Add loading/error/empty states.
8. Run lint/typecheck/tests.
9. Update docs if architecture changed.
10. Commit only coherent changes.

Do not rewrite unrelated code.

---

## 23. Definition of Done

A feature is done only when:

- implementation exists;
- validation exists;
- auth exists where required;
- authorization exists;
- tests exist for critical paths;
- loading/error states exist;
- telemetry/logging exists where appropriate;
- docs are updated if needed;
- typecheck passes;
- lint passes;
- tests pass.

---

## 24. Codex Behavior

Do not ask for approval for every routine engineering decision.

Make reasonable decisions consistent with these documents.

When an architectural choice materially conflicts with the docs:

1. identify the conflict;
2. explain the smallest viable change;
3. update the relevant architecture document;
4. then implement.

Never silently replace MySQL with another database.

Never silently remove security requirements to make a demo work.

Never convert the product into a static mockup when a functional implementation is requested.

---

## 25. Priority Order

When tradeoffs occur, prioritize:

1. Security
2. Correctness
3. Core end-to-end functionality
4. Data integrity
5. Explainability
6. Accessibility
7. Performance
8. Visual polish
9. Optional features

---

## 26. Product North Star

The system must demonstrate:

```text
Citizen voice
      ↓
AI understanding
      ↓
Collective demand
      ↓
Evidence
      ↓
Transparent priority
      ↓
Human decision
      ↓
Government action
      ↓
Citizen update
```

That loop is the product.
