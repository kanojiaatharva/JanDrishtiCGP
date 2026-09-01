# JanDrishti Engineering Documentation

This folder contains the engineering source of truth for the JanDrishti platform.

## Documents

- `PRD.md` — product requirements and scope
- `ARCHITECTURE.md` — system and deployment architecture
- `DATABASE.md` — MySQL data model
- `AI_PIPELINE.md` — AI, clustering and prioritization pipeline
- `SECURITY.md` — authentication, authorization, privacy and security
- `API.md` — API contracts
- `DEMO.md` — end-to-end hackathon demo
- `../AGENTS.md` — Codex engineering rules

## Database Decision

JanDrishti uses **MySQL 8.x + Prisma** for transactional application data.

BigQuery remains the analytical warehouse.

## Build Philosophy

Build the smallest genuinely functional end-to-end loop first:

Citizen → AI → Report → Cluster → Evidence → Priority → Officer → Action → Citizen.
