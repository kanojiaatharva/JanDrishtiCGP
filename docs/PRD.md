# JanDrishti — Product Requirements Document

**Version:** 1.0  
**Status:** Engineering Source of Truth  
**Theme:** Innovation  
**Product:** JanDrishti — AI for Digital Public Infrastructure & Governance

## 1. Product Vision

JanDrishti transforms fragmented citizen voices into geographically aggregated, evidence-backed development priorities.

The platform accepts citizen requests through voice, text, WhatsApp, web and assisted channels; understands multilingual input; converts reports into structured civic issues; groups similar requests into demand hotspots; enriches hotspots with demographic, infrastructure and public-investment evidence; calculates transparent priority scores; and presents recommendations to government officers for human review and action.

The governing principle is:

> **AI recommends → evidence explains → human approves → citizen gets updated.**

AI must never autonomously make or execute a government decision.

---

## 2. Problem

Citizen development requests are fragmented across channels and languages. English-first systems exclude or discourage many people, while planners often see individual complaints instead of collective demand.

This creates three core problems:

1. **Fragmented voice:** reports arrive through multiple disconnected channels.
2. **Language and access barriers:** citizens may communicate naturally in regional languages or voice.
3. **Weak planning signal:** isolated complaints do not reveal geographic concentration, recurring demand, infrastructure gaps or plan gaps.

---

## 3. Goals

### Primary goals

- Enable citizens to report civic/development issues in their preferred language.
- Make voice the easiest reporting method.
- Accept reports from the mobile app, web and WhatsApp.
- Convert unstructured reports into validated structured issues.
- Aggregate semantically and geographically similar requests.
- Identify demand hotspots.
- Combine demand with demographic, infrastructure and public-investment evidence.
- Generate transparent priority scores.
- Give officers explainable recommendations.
- Preserve human-in-the-loop decision making.
- Return status and action updates to citizens.
- Provide secure APIs that can later integrate with government DPIs.
- Make the core architecture reusable across districts, states and countries.

### Secondary goals

- Support low-connectivity environments.
- Minimize collection and exposure of personally identifiable information.
- Maintain complete auditability of important administrative actions.
- Make AI outputs observable and reviewable.

---

## 4. Non-goals for MVP

The first release will not attempt to:

- replace government decision makers;
- automatically allocate public funds;
- automatically approve projects;
- integrate Aadhaar unless explicitly required;
- provide nationwide live government datasets;
- train a proprietary foundation model;
- build a full nationwide IVR network;
- guarantee support for every Indian language on day one;
- implement every possible government-system connector;
- create a blockchain or token system.

These belong to the roadmap.

---

## 5. Target Users

### Citizen

Needs a simple, trustworthy way to report an issue and track what happens.

### Government Officer

Needs to understand where demand is concentrated, why an area is high priority, and what action may be appropriate.

### District Administrator

Needs a district-wide view of demand, infrastructure gaps, investments and unresolved priorities.

### Analyst

Needs aggregated data, trends and evidence without unnecessary citizen PII.

### Field Worker

Needs assigned actions, verification tasks and status updates.

### System Administrator

Manages users, roles, configuration, datasets, integrations and audit access.

---

## 6. Product Surfaces

### A. Citizen React Native App

Core screens:

- Splash
- Language selection
- Home
- Voice reporting
- Text reporting
- Location confirmation
- AI-generated report summary
- Submit confirmation
- My Reports
- Report detail/timeline
- Notifications
- Profile
- Privacy/consent

### B. Officer Web Application

Core screens:

- Login/MFA
- District dashboard
- Demand hotspot map
- Reports
- Clusters
- Evidence explorer
- Recommendation detail
- Review/action workflow
- Alerts
- Analytics
- Audit log
- Profile/settings

### C. WhatsApp System

Capabilities:

- onboarding
- language selection
- text report
- voice report
- location sharing
- AI understanding
- confirmation
- report ID
- status lookup
- citizen updates

### D. Backend/API

Shared business and intelligence platform for all channels.

---

## 7. Citizen Reporting Flow

1. Citizen opens app or WhatsApp.
2. Citizen selects/pre-selects language.
3. Citizen speaks or types a problem.
4. Audio is transcribed if necessary.
5. Language and issue are identified.
6. AI extracts category, location, severity, urgency and summary.
7. Location is confirmed or requested.
8. Citizen reviews the structured summary.
9. Citizen edits if needed.
10. Citizen submits.
11. Backend creates a report ID.
12. Report enters asynchronous processing.
13. Similar requests are clustered.
14. Area evidence is calculated.
15. Priority score is generated where sufficient evidence exists.
16. Officer reviews recommendations.
17. Officer approves/rejects/requests evidence.
18. Government action is recorded.
19. Citizen receives status updates.

---

## 8. Example Citizen Input

Input:

> हमारे गांव में पीने का पानी साफ नहीं है और हैंडपंप भी अक्सर खराब रहते हैं।

Expected structured interpretation:

```json
{
  "category": "WATER",
  "subcategory": "DRINKING_WATER",
  "language": "hi",
  "severity": 4,
  "urgency": 4,
  "summary": "Unsafe drinking water and frequently broken handpumps",
  "location": {
    "district": "Indore",
    "ward": "14"
  }
}
```

The actual location must be confirmed from citizen-provided location, profile/address context, geocoding or an officer-verified source. The model must not invent a location.

---

## 9. Core Features

### 9.1 Voice-first access

- microphone-first citizen UI;
- audio recording;
- upload/retry;
- speech-to-text;
- transcript preview;
- multilingual processing;
- consent-aware media retention.

### 9.2 Multilingual AI

- language detection;
- transcription;
- translation where useful;
- semantic normalization;
- structured extraction;
- localized citizen responses.

### 9.3 Demand clustering

Cluster reports using:

- issue/category similarity;
- semantic embeddings;
- geographic proximity;
- temporal recurrence;
- optional administrative boundary.

### 9.4 Evidence layer

Evidence can include:

- citizen demand;
- population;
- population density;
- infrastructure coverage;
- facility counts;
- infrastructure condition;
- public schemes;
- planned projects;
- allocated budget;
- plan/project gaps.

### 9.5 Explainable prioritization

Every recommendation must show:

- total score;
- component scores;
- source evidence;
- data freshness;
- confidence/quality indicators;
- reasons for recommendation;
- conflicting evidence when applicable.

### 9.6 Human-in-the-loop

Officer actions:

- Approve;
- Reject with reason;
- Request more evidence;
- Mark duplicate;
- Assign action;
- Change status;
- Add note.

### 9.7 Citizen tracking

Citizen sees:

- report ID;
- submitted time;
- current status;
- government response;
- action;
- updates;
- resolution information.

---

## 10. Priority Engine

Recommended default weighting:

| Signal | Weight |
|---|---:|
| Demand | 30% |
| Severity | 20% |
| Need Gap | 20% |
| Infrastructure Gap | 15% |
| Population Need | 10% |
| Plan Gap | 5% |

Normalized score:

`Priority = 0.30D + 0.20S + 0.20N + 0.15I + 0.10P + 0.05G`

All component values must be normalized to 0–100 before weighting.

The scoring configuration must be stored as versioned configuration rather than hard-coded in the frontend.

A score without sufficient evidence must be marked as provisional and must not be presented as a definitive recommendation.

---

## 11. Success Metrics

### Citizen

- report completion rate;
- median time to submit;
- voice-report success rate;
- language-specific transcription success;
- report confirmation correction rate.

### Intelligence

- percentage of reports successfully structured;
- cluster precision reviewed by analysts;
- hotspot stability;
- recommendation evidence completeness;
- AI confidence distribution.

### Government

- time from report to review;
- recommendation review rate;
- action conversion rate;
- average time to update citizens;
- resolution rate.

### Platform

- API availability;
- processing latency;
- queue failure/retry rate;
- webhook success rate;
- security incidents;
- audit coverage.

---

## 12. MVP Acceptance Criteria

A demo-ready MVP is complete when:

- a citizen can authenticate;
- a citizen can submit Hindi/English voice or text;
- audio is transcribed;
- Gemini produces validated structured issue JSON;
- citizen can review/edit before submission;
- a report is persisted in MySQL;
- a report receives a status;
- similar seeded reports can form a hotspot;
- dashboard displays hotspot data;
- evidence can be viewed;
- priority score is explainable;
- officer can approve/reject/request evidence;
- action changes report/recommendation state;
- citizen can see the resulting status;
- WhatsApp can accept text and voice through a verified webhook;
- all sensitive backend credentials stay server-side;
- important officer actions create audit records.

---

## 13. Future Roadmap

### Phase 2

- more languages;
- IVR;
- field-worker mobile workflows;
- real government datasets;
- richer geospatial analytics;
- advanced trend detection.

### Phase 3

- state-scale deployment;
- open APIs;
- configurable schemas;
- government DPI connectors;
- data-sharing governance;
- multilingual country configuration.

### Phase 4

- India-wide deployment;
- BRICS adaptation;
- country-configurable civic intelligence deployments.

---

## 14. Product Principle

JanDrishti is not a complaint box.

It is a **civic intelligence layer** that converts individual voices into collective, evidence-backed planning signals while preserving human accountability.
