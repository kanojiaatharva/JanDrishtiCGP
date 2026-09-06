# Database Architecture

## Overview

JanDrishti uses MySQL managed by Prisma ORM. The database is highly normalized to support robust querying, reporting, and AI interactions.

## Schema Structure

### Identity and Access Management
- **User**: The base authentication entity. Stores phone (Citizen) or email (Officer) alongside their Argon2 password hash.
- **Role**: Determines the scope of access (`CITIZEN`, `OFFICER`, `DISTRICT_ADMIN`, `SUPER_ADMIN`).
- **Permission**: Granular permissions (managed via `RolePermission`).
- **RefreshToken**: Stores hashed refresh tokens for secure session rotation.

### Profiles
- **CitizenProfile**: Demographic and language preferences (e.g. Hindi).
- **OfficerProfile**: First Name, Last Name, Designation, and District affiliation.

### Geography
- **State -> District -> Ward -> Location**. 
- Locations are isolated and connected to Wards to allow for pinpoint geospatial analysis without coupling the reports directly to the rigid Ward hierarchy, though they roll up naturally.

### Civic Data
- **CitizenReport**: The central entity recording grievances. Contains original multi-lingual input, English transcriptions, status, urgency, and severity.
- **ReportStatusHistory**: Auditable trail of status changes.

### AI Processing
- **AIAnalysis**: Metadata output from the AI models (confidence, extracted entities, processing time).
- **DemandCluster & DemandHotspot**: Groupings of CitizenReports that represent systemic issues.
- **PriorityScore**: Calculated scores based on demand, severity, need gap, infrastructure, population, and plan gap.

### Action & Decision
- **Recommendation**: AI-generated suggestions for hotspots.
- **OfficerDecision**: The human-in-the-loop audit trail approving or rejecting AI recommendations.

## Soft Deletes
Models such as `User` and `CitizenReport` implement soft deletion (`deletedAt`) to preserve historical data context even when active access is removed.
