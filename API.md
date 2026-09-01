# JanDrishti — API Contract

## 1. API Standards

Base:

```text
/api/v1
```

Format:

```text
JSON
```

Authentication:

```text
Authorization: Bearer <token>
```

All timestamps:

```text
ISO 8601 UTC
```

All externally exposed IDs:

```text
UUID/public IDs
```

---

## 2. Standard Success Response

```json
{
  "data": {},
  "meta": {
    "requestId": "req_123"
  }
}
```

## 3. Standard Error

```json
{
  "error": {
    "code": "REPORT_NOT_FOUND",
    "message": "Report could not be found.",
    "requestId": "req_123"
  }
}
```

Never expose stack traces in production.

---

## 4. Authentication

### GET /auth/me

Returns authenticated user profile and permissions.

### POST /auth/sync

Synchronizes authenticated Firebase user with application user record.

---

## 5. Citizen

### GET /citizens/me

Returns current citizen profile.

### PATCH /citizens/me

Updates allowed profile fields.

### GET /citizens/me/reports

Returns paginated reports owned by the citizen.

---

## 6. Reports

### POST /reports

Creates a citizen report.

Request:

```json
{
  "sourceChannel": "MOBILE",
  "language": "hi",
  "category": "WATER",
  "subcategory": "DRINKING_WATER",
  "summary": "Unsafe drinking water",
  "description": "....",
  "location": {
    "latitude": 22.72,
    "longitude": 75.86,
    "source": "USER_CONFIRMED"
  }
}
```

### POST /reports/:id/media

Creates an upload session for media.

Never upload media through a long-running API process if direct signed upload is practical.

### GET /reports/:id

Returns report detail if authorized.

### PATCH /reports/:id

Citizen may edit only allowed fields and only before final submission.

### POST /reports/:id/confirm

Confirms AI-generated report summary.

### GET /reports/:id/timeline

Returns report status history.

---

## 7. AI

### POST /ai/transcription-jobs

Creates a transcription job.

### GET /ai/jobs/:id

Returns processing state.

AI routes should generally be internal/service-protected rather than publicly exposed to clients.

---

## 8. Hotspots

### GET /hotspots

Query:

```text
districtId
wardId
category
from
to
minScore
```

Response includes:

```json
{
  "id": "cluster_123",
  "title": "Drinking Water Access",
  "area": "Ward 14",
  "reportCount": 1284,
  "priorityScore": 92,
  "centroid": {
    "lat": 22.71,
    "lng": 75.85
  }
}
```

---

## 9. Clusters

### GET /clusters

Officer/analyst scoped.

### GET /clusters/:id

Returns:

- cluster metadata;
- report count;
- representative issue;
- evidence;
- score;
- recommendation.

### GET /clusters/:id/reports

Paginated cluster members.

---

## 10. Evidence

### GET /areas/:id/evidence

Returns:

- demographics;
- infrastructure;
- public projects;
- citizen demand;
- data freshness;
- evidence completeness.

---

## 11. Recommendations

### GET /recommendations

Filters:

```text
district
ward
category
status
minPriority
```

### GET /recommendations/:id

Returns:

- score;
- score components;
- evidence;
- recommendation;
- confidence;
- history.

### POST /recommendations/:id/decision

Request:

```json
{
  "decision": "APPROVE",
  "reason": "High demand and low service coverage.",
  "notes": "Proceed to field verification."
}
```

Allowed:

```text
APPROVE
REJECT
REQUEST_MORE_EVIDENCE
```

---

## 12. Government Actions

### POST /recommendations/:id/actions

Creates an action after authorized review.

### PATCH /actions/:id

Updates action status.

Statuses:

```text
PLANNED
ASSIGNED
IN_PROGRESS
BLOCKED
COMPLETED
CANCELLED
```

---

## 13. Notifications

### GET /notifications

Returns user notifications.

### POST /notifications/:id/read

Marks notification as read.

---

## 14. WhatsApp

### GET /whatsapp/webhook

Meta verification endpoint.

### POST /whatsapp/webhook

Receives verified Meta webhook events.

Webhook handling must be idempotent.

Store inbound message IDs and ignore duplicate processing.

---

## 15. Officer Dashboard

### GET /dashboard/summary

Returns:

- total reports;
- high-priority areas;
- resolution rate;
- category distribution;
- recent trend.

### GET /dashboard/trends

Returns time-series aggregates.

### GET /dashboard/hotspots

Returns map-ready hotspot data.

---

## 16. Admin

Admin endpoints must be protected by elevated RBAC.

Examples:

```text
POST /admin/users/:id/roles
POST /admin/datasets/import
GET  /admin/audit-logs
POST /admin/scoring-config
```

---

## 17. Pagination

Default:

```text
pageSize = 25
maxPageSize = 100
```

Prefer cursor pagination for large datasets.

---

## 18. Idempotency

Use idempotency keys for:

- report submission;
- officer decision;
- government action creation;
- WhatsApp processing where relevant.

---

## 19. Versioning

Breaking API changes require:

```text
/api/v2
```

Do not silently break v1 clients.

---

## 20. API Security Rules

Every endpoint must answer:

1. Who is the caller?
2. What role do they have?
3. What geographic scope do they have?
4. Does the resource belong to that scope?
5. Is the action allowed?
6. Is the request valid?
7. Should the action be audited?

