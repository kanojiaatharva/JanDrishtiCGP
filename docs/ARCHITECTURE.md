# JanDrishti — System Architecture

## 1. Architecture Principles

1. **API-first:** every client uses shared backend contracts.
2. **Event-driven processing:** long-running AI work is asynchronous.
3. **Human-in-the-loop:** AI recommends; authorized humans decide.
4. **Privacy by design:** minimize PII sent to AI services.
5. **Secure by default:** no secrets in clients, least privilege everywhere.
6. **Modular:** channels, AI, evidence and recommendation engines are replaceable.
7. **Observable:** every important pipeline stage is measurable.
8. **Interoperable:** public APIs and stable schemas enable future DPI integration.
9. **MVP-friendly:** start as a modular monorepo/deployable services, not unnecessary microservices.
10. **Cloud-native:** Google Cloud is the primary deployment target.

---

## 2. High-Level Architecture

```text
                         ┌──────────────────────┐
                         │     CITIZENS         │
                         └──────────┬───────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
           React Native          WhatsApp           Web
              App                Cloud API         Portal
                  │                 │                 │
                  └─────────────────┼─────────────────┘
                                    │
                              API / Webhooks
                                    │
                              API Gateway
                                    │
                              Cloud Run API
                                    │
                         ┌──────────┴──────────┐
                         │                     │
                      MySQL                 Pub/Sub
                    Transactional               │
                         │           ┌──────────┼───────────┐
                         │           │          │           │
                         │        AI Worker  Cluster     Notify Worker
                         │           │        Worker          │
                         │           │          │             │
                         │      Speech/Gemini  │         WhatsApp/Push
                         │           │          │
                         └───────────┼──────────┘
                                     │
                              Intelligence Layer
                                     │
                         ┌───────────┴───────────┐
                         │                       │
                    BigQuery               Maps/Geo APIs
                         │
                    Analytics
                         │
                 Officer Dashboard
                         │
                    Human Review
                         │
                  Government Action
                         │
                  Citizen Notification
```

---

## 3. Recommended Technology Stack

### Web

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- TanStack Query
- Zod
- Recharts
- Google Maps Platform or MapLibre

### Mobile

- React Native
- Expo
- TypeScript
- Expo Router
- TanStack Query
- Zustand
- NativeWind
- Expo audio/media APIs

### Backend

- Node.js
- NestJS
- TypeScript
- Prisma ORM
- Zod/class-validator
- OpenAPI

### Database

**MySQL 8.x**

Use:

- MySQL spatial types/indexes for geographic fields where useful;
- Prisma for standard relational access;
- raw SQL for specialized spatial/analytical queries where required.

### Cloud

- Google Cloud Run
- Cloud SQL for MySQL
- Cloud Storage
- Pub/Sub
- Cloud Tasks
- BigQuery
- Secret Manager
- Cloud Logging
- Cloud Monitoring
- Artifact Registry

### AI

- Vertex AI / Gemini
- Google Cloud Speech-to-Text

### Authentication

- Firebase Authentication for citizen accounts;
- Firebase Authentication/custom claims or enterprise identity integration for officer accounts;
- MFA for privileged users.

### WhatsApp

- Meta WhatsApp Cloud API
- verified webhooks

### CI/CD

- GitHub Actions
- Docker
- Terraform

---

## 4. Why MySQL

The project will use MySQL rather than PostgreSQL.

MySQL is appropriate for:

- transactional application data;
- strong relational integrity;
- report/status/action workflows;
- role-based access;
- audit logs;
- administrative configuration;
- geographic point data using spatial types.

Do not attempt to make MySQL the entire analytics platform. Large historical analytics and aggregation should be pushed to BigQuery.

---

## 5. Deployment Model

For MVP:

```text
Cloud Run
 ├── API service
 ├── AI worker
 ├── WhatsApp worker
 ├── Analytics/cluster worker
 └── Notification worker
```

These can share a repository and packages while deploying independently.

Avoid a large Kubernetes deployment for the hackathon.

---

## 6. Request Types

### Synchronous

Use synchronous APIs for:

- authentication/session validation;
- profile reads;
- report list;
- report detail;
- dashboard reads;
- officer actions.

### Asynchronous

Use Pub/Sub/Cloud Tasks for:

- speech transcription;
- Gemini analysis;
- embedding generation;
- clustering;
- large analytics jobs;
- WhatsApp media processing;
- notifications;
- retries.

---

## 7. Core Processing Pipeline

```text
Input
 ↓
Consent
 ↓
Normalize
 ↓
Store raw media securely
 ↓
Speech-to-text if audio
 ↓
Language detection
 ↓
AI structured extraction
 ↓
Schema validation
 ↓
Human-readable summary
 ↓
Citizen confirmation
 ↓
Persist report
 ↓
Geocode / location resolution
 ↓
Embedding
 ↓
Cluster assignment
 ↓
Evidence enrichment
 ↓
Priority calculation
 ↓
Recommendation
 ↓
Officer review
 ↓
Government action
 ↓
Citizen notification
```

---

## 8. Data Boundaries

### Transactional source of truth

MySQL:

- users;
- citizens;
- officers;
- reports;
- report events;
- recommendations;
- officer actions;
- audit logs;
- configuration.

### Analytical source

BigQuery:

- historical report facts;
- aggregate demand;
- demographic datasets;
- infrastructure datasets;
- investment datasets;
- analytics tables;
- model evaluation datasets.

### Object storage

Cloud Storage:

- raw audio;
- processed audio when retention is allowed;
- attachments;
- import files;
- exported reports.

Raw media should have lifecycle policies.

---

## 9. Geographic Architecture

Store report location as:

- latitude;
- longitude;
- optional MySQL `POINT`;
- administrative hierarchy IDs.

Preferred hierarchy:

```text
Country
 ↓
State
 ↓
District
 ↓
Block
 ↓
Ward
 ↓
Village / Locality
```

Never infer exact citizen location from AI alone.

A location can originate from:

1. explicit user location;
2. shared WhatsApp location;
3. selected map location;
4. verified address;
5. administrative mapping;
6. officer correction.

Every location should include a `source` and optional confidence.

---

## 10. Scalability Strategy

Initial MVP:

- one Cloud SQL MySQL instance;
- Cloud Run autoscaling;
- Pub/Sub workers;
- BigQuery for analytics;
- Cloud Storage for media.

Scale by:

- increasing Cloud Run instances;
- increasing worker concurrency;
- partitioning Pub/Sub processing;
- caching dashboard queries;
- moving heavy analytical queries to BigQuery;
- read replicas where justified;
- separating AI worker deployments by workload.

---

## 11. Failure Strategy

AI failure:

```text
AI fails
 ↓
Retry
 ↓
Dead-letter queue
 ↓
Mark processing error
 ↓
Allow manual/alternative processing
```

WhatsApp failure:

```text
Send
 ↓
Retry via Cloud Tasks
 ↓
Exponential backoff
 ↓
Record delivery state
```

Database failure:

- automatic backups;
- retry transient errors;
- connection pooling;
- graceful degradation for read-heavy dashboards.

Never lose a citizen report silently.

---

## 12. Observability

Every request should carry a correlation ID.

Log:

- request ID;
- authenticated actor ID where appropriate;
- route;
- latency;
- status;
- service;
- AI job ID;
- report ID;
- error category.

Never log:

- OTPs;
- passwords;
- access tokens;
- raw authorization headers;
- unnecessary PII;
- full citizen audio.

---

## 13. Environment Separation

Required:

```text
local
development
staging
production
```

Each environment must have separate:

- databases;
- storage buckets;
- Firebase projects/config where practical;
- WhatsApp credentials;
- secrets;
- service accounts.

Never use production data in local development.
