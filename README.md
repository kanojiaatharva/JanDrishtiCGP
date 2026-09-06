# JanDrishti

JanDrishti is a Digital Public Good / AI-powered civic intelligence platform for India.

## Setup Instructions

### Prerequisites
- Node.js (v24.16+)
- pnpm (v8.15+)
- Docker

### Initialization
1. Clone the repository.
2. Run `pnpm install` in the root.
3. Copy `.env.example` to `.env` and configure it.
4. Run `docker-compose up -d` to start the MySQL and Redis services.
5. Run `pnpm db:generate` to generate Prisma client.
6. Run `pnpm dev` to start all applications and services.

### Scripts
- `pnpm build`: Build all apps and packages
- `pnpm dev`: Start all apps in development mode
- `pnpm lint`: Lint the codebase
- `pnpm typecheck`: Run TypeScript compiler check
- `pnpm test`: Run the test suites
