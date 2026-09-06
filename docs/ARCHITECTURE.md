# Architecture

## Overview
JanDrishti is designed as a modular, scalable monorepo using `pnpm` and `Turborepo`.

## Repositories & Modules
- **`apps/web`**: Next.js application for the Officer Dashboard.
- **`apps/mobile`**: Expo / React Native application for the Citizen App.
- **`apps/api`**: NestJS backend API.
- **`packages/*`**: Shared modules for UI, Validation, Types, and API Client.
- **`services/*`**: Asynchronous workers for AI processing, Speech-to-text, WhatsApp webhook processing, and Notifications.

## Database
- MySQL (via Prisma ORM).
- Redis (for caching and Pub/Sub).
