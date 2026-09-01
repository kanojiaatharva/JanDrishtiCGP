# JanDrishti — Hackathon Demo Specification

## 1. Demo Objective

Demonstrate the complete loop:

> **Citizen voice → AI understanding → collective demand → evidence → priority → human decision → citizen update**

The demo should feel like one functioning platform, not disconnected mock screens.

---

## 2. Demo Scenario

Citizen:

**Meena**

Issue:

**Drinking water**

Language:

**Hindi**

Area:

**Ward 14**

Seeded environment:

- 1,284 similar water reports;
- high recurrence;
- 38% monthly growth;
- low water coverage;
- population pressure;
- no active corresponding project.

---

## 3. Demo Sequence

### Step 1 — Citizen

Open mobile app.

Show:

```text
Namaste, Meena

How can we help your community today?

[ Microphone ]

आप बोलिए...
```

---

### Step 2 — Voice

Citizen speaks:

> हमारे गांव में पीने का पानी साफ नहीं है और हैंडपंप भी अक्सर खराब रहते हैं।

---

### Step 3 — AI

Show:

```text
Language
Hindi

Issue
Drinking Water

Severity
High

Urgency
High

Confidence
94%
```

---

### Step 4 — Confirmation

Show AI summary and require:

```text
[ Submit Report ]
[ Edit ]
```

This demonstrates responsible AI.

---

### Step 5 — Report ID

Show:

```text
Thank you.

Your report has been submitted.

JR-2026-001284
```

---

### Step 6 — Officer Dashboard

Switch to web dashboard.

Show KPI cards.

Then map:

```text
Ward 14
```

appears as a high-demand hotspot.

---

### Step 7 — Hotspot Details

Show:

```text
Ward 14
Drinking Water

1,284 reports
+38% this month

Priority
92 / 100
```

---

### Step 8 — Evidence

Show:

```text
Demand
1,284 reports

Water Coverage
42%

Population
18,430

Active Projects
0

Infrastructure Condition
Low
```

---

### Step 9 — Explainable Score

Show components:

```text
Demand              30%
Severity            20%
Need Gap            20%
Infrastructure      15%
Population           10%
Plan Gap              5%
```

Display score = 92/100.

---

### Step 10 — Recommendation

Show:

```text
Recommended Intervention

Upgrade drinking-water infrastructure
and repair/replace existing handpumps.

Why?

• High recurring citizen demand
• Low service coverage
• High population need
• No matching active project
```

---

### Step 11 — Human Decision

Officer clicks:

```text
APPROVE
```

Require confirmation.

Create audit event.

Create government action.

---

### Step 12 — Citizen Update

Return to citizen.

Show:

```text
Your report has been reviewed.

Status:
Action Planned

The administration has initiated
a water infrastructure assessment
for your area.
```

---

## 4. WhatsApp Demo

Start WhatsApp conversation.

```text
Citizen:
Hamare yahan road bahut kharab hai.

JanDrishti:
I understood:

Issue: Road Condition
Location: Ward 7

Is this correct?

1. Yes
2. Edit
3. Cancel
```

Citizen:

```text
1
```

System:

```text
Report submitted.

JR-2026-001421

Reply STATUS to check progress.
```

---

## 5. Demo Dataset

Seed realistic synthetic data.

Recommended:

```text
50,000 reports
10+ districts
100+ wards
7–10 categories
multiple languages
demographic snapshots
infrastructure records
public projects
```

Create intentional hotspots:

```text
Ward 14 → Water
Ward 7  → Roads
Ward 3  → Healthcare
Ward 11 → Sanitation
```

---

## 6. Demo Environment

Use:

```text
development/staging
```

with a deterministic seed.

Do not depend on external government APIs during the live demo.

External sources should be represented by replaceable ingestion interfaces.

---

## 7. Demo Reliability

Before presentation:

- preload dashboard data;
- verify AI credentials;
- verify WhatsApp webhook;
- test mobile microphone permissions;
- have a text fallback;
- verify network;
- keep seeded reports available;
- ensure recommendation data is deterministic.

The live AI should enhance the demo, but the entire demo must not collapse if one external provider times out.

---

## 8. Demo Narrative

Use this story:

### Problem

Government sees thousands of disconnected complaints.

### Transformation

JanDrishti understands them in citizens' own languages.

### Intelligence

Similar complaints become collective demand hotspots.

### Evidence

Demand is combined with infrastructure, demographic and investment data.

### Decision

AI provides an explainable priority recommendation.

### Accountability

A government officer makes the final decision.

### Trust

The citizen receives an update.

---

## 9. Winning Moment

The strongest visual transition is:

```text
ONE CITIZEN VOICE
       ↓
1 report
       ↓
1,284 similar voices
       ↓
WARD 14 HOTSPOT
       ↓
92/100 PRIORITY
       ↓
EVIDENCE
       ↓
OFFICER ACTION
       ↓
CITIZEN UPDATE
```

This communicates the entire JanDrishti thesis in seconds.

---

## 10. Fallback Mode

If live AI fails:

- use pre-recorded audio;
- use deterministic transcript;
- run the same backend pipeline;
- retain the exact same UI;
- clearly mark demo mode internally.

Never replace the whole product with hardcoded UI screenshots.
