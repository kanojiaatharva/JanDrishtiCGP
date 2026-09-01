# JanDrishti — MySQL Database Design

## 1. Database

**MySQL 8.x**

ORM:

**Prisma**

Database responsibilities:

- transactional state;
- identity references;
- report lifecycle;
- recommendations;
- government actions;
- auditability;
- configuration.

BigQuery handles large-scale analytics.

---

## 2. Design Rules

- Use UUIDs for externally exposed identifiers.
- Use internal numeric IDs only where useful for indexing.
- Use UTC timestamps in storage.
- Use `created_at` and `updated_at` consistently.
- Use soft deletion only where legally/business appropriate.
- Never hard-delete audit records.
- Never store plaintext passwords.
- Never store unnecessary PII.
- Every AI output stores model/version metadata.
- Every recommendation stores scoring-version metadata.
- Every location stores its source.

---

## 3. Core Tables

### users

```text
id
public_id
firebase_uid
role_id
status
last_login_at
created_at
updated_at
```

### roles

```text
id
name
description
created_at
```

Roles:

```text
CITIZEN
FIELD_WORKER
OFFICER
DISTRICT_ADMIN
ANALYST
AUDITOR
SUPER_ADMIN
```

### citizens

```text
id
user_id
display_name
phone_hash
phone_last4
preferred_language
district_id
consent_version
created_at
updated_at
```

Avoid storing plaintext phone numbers unless operationally necessary.

### officers

```text
id
user_id
employee_reference
department
district_id
mfa_required
created_at
updated_at
```

---

## 4. Geography

### states

```text
id
code
name
```

### districts

```text
id
state_id
code
name
```

### wards

```text
id
district_id
code
name
boundary_reference
```

### localities

```text
id
ward_id
name
type
```

### locations

```text
id
state_id
district_id
ward_id
locality_id
latitude
longitude
point
source
confidence
created_at
```

Use MySQL spatial support for `point` where useful.

---

## 5. Reports

### reports

```text
id
public_id
citizen_id
source_channel
status
language
category_id
subcategory
summary
description
location_id
severity
urgency
ai_confidence
cluster_id
submitted_at
created_at
updated_at
```

Source channels:

```text
MOBILE
WEB
WHATSAPP
IVR
KIOSK
```

Statuses:

```text
CREATED
PROCESSING
AWAITING_CONFIRMATION
SUBMITTED
AI_PROCESSED
CLUSTERED
PRIORITIZED
UNDER_REVIEW
NEEDS_MORE_INFO
ACTION_PLANNED
IN_PROGRESS
RESOLVED
REJECTED
DUPLICATE
```

### report_media

```text
id
report_id
storage_object_key
media_type
mime_type
duration_seconds
checksum
processing_status
retention_expires_at
created_at
```

Never expose raw Cloud Storage object keys directly to clients.

### report_transcripts

```text
id
report_id
language
transcript
confidence
provider
model_version
created_at
```

---

## 6. AI Analysis

### report_ai_analysis

```text
id
report_id
model_provider
model_name
model_version
prompt_version
language
category
subcategory
summary
severity
urgency
entities_json
location_json
confidence
raw_response_reference
created_at
```

Do not store unrestricted raw model output if it can contain unnecessary PII. Prefer sanitized structured output.

---

## 7. Categories

### issue_categories

```text
id
code
name
description
active
created_at
updated_at
```

Seed:

```text
WATER
ROADS
HEALTH
EDUCATION
SANITATION
ELECTRICITY
TRANSPORT
PUBLIC_SAFETY
HOUSING
OTHER
```

---

## 8. Clusters

### issue_clusters

```text
id
public_id
category_id
district_id
ward_id
title
description
report_count
recurrence_score
semantic_score
geographic_score
hotspot_score
status
created_at
updated_at
```

### cluster_members

```text
cluster_id
report_id
similarity_score
assigned_at
```

A report may belong to one active primary cluster in MVP.

---

## 9. Evidence

### demographic_snapshots

```text
id
area_type
area_id
population
population_density
vulnerable_population_index
source
dataset_version
as_of_date
created_at
```

### infrastructure_assets

```text
id
area_id
category_id
asset_type
facility_count
coverage_score
condition_score
capacity
source
dataset_version
as_of_date
created_at
```

### public_projects

```text
id
area_id
category_id
name
status
planned_start
planned_end
allocated_budget
spent_budget
source
dataset_version
created_at
updated_at
```

### area_evidence

```text
id
area_id
category_id
demand_score
severity_score
need_gap_score
infrastructure_gap_score
population_need_score
plan_gap_score
evidence_completeness
computed_at
scoring_version
```

---

## 10. Priority

### priority_scores

```text
id
cluster_id
score
demand_component
severity_component
need_gap_component
infrastructure_component
population_component
plan_gap_component
scoring_version
confidence
evidence_completeness
computed_at
```

### recommendations

```text
id
cluster_id
priority_score_id
recommendation_type
title
description
reasoning
status
created_at
updated_at
```

Statuses:

```text
PENDING_REVIEW
APPROVED
REJECTED
MORE_EVIDENCE_REQUESTED
SUPERSEDED
```

---

## 11. Human Review

### officer_reviews

```text
id
recommendation_id
officer_id
decision
reason
notes
created_at
```

Decisions:

```text
APPROVE
REJECT
REQUEST_MORE_EVIDENCE
```

### government_actions

```text
id
recommendation_id
assigned_to
action_type
status
description
started_at
completed_at
created_at
updated_at
```

---

## 12. Notifications

### notifications

```text
id
citizen_id
report_id
channel
type
status
message_template
provider_message_id
sent_at
delivered_at
created_at
```

Channels:

```text
APP
WHATSAPP
SMS
EMAIL
```

---

## 13. Consent

### consents

```text
id
citizen_id
consent_type
version
status
captured_at
withdrawn_at
source
```

Consent types:

```text
DATA_PROCESSING
VOICE_PROCESSING
LOCATION
NOTIFICATIONS
ANALYTICS
```

---

## 14. Audit Logs

### audit_logs

```text
id
actor_user_id
action
resource_type
resource_id
district_id
metadata_json
request_id
created_at
```

Audit logs must be append-only from the application perspective.

Examples:

```text
OFFICER_LOGIN
REPORT_VIEWED
RECOMMENDATION_APPROVED
RECOMMENDATION_REJECTED
ACTION_CREATED
ACTION_STATUS_CHANGED
ROLE_CHANGED
DATASET_IMPORTED
CONFIG_CHANGED
```

---

## 15. Indexing

Required indexes include:

- users.firebase_uid;
- citizens.user_id;
- officers.user_id;
- reports.public_id;
- reports.citizen_id;
- reports.status;
- reports.category_id;
- reports.location_id;
- reports.created_at;
- reports.cluster_id;
- issue_clusters.district_id;
- issue_clusters.ward_id;
- priority_scores.cluster_id;
- recommendations.status;
- officer_reviews.officer_id;
- audit_logs.actor_user_id;
- audit_logs.resource_id.

Use spatial indexes where supported and useful for location queries.

---

## 16. Retention

Suggested defaults:

- raw voice: short-lived unless consent/business requirement requires retention;
- transcripts: retained according to data policy;
- reports: retained according to government policy;
- audit logs: long retention;
- analytics aggregates: retain according to program requirements.

Retention must be configurable by deployment.

---

## 17. Data Migration

All schema changes must use Prisma migrations.

Never modify production schema manually without a migration and rollback plan.

Seed scripts must be deterministic for demo environments.
