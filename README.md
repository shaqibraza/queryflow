# QueryFlow

QueryFlow is an AI-powered business intelligence platform scaffolded as a production-ready TypeScript monorepo.

This repository contains architecture, tooling, service boundaries, shared packages, health endpoints, Swagger setup, Prisma base configuration, and Docker infrastructure. Business logic and feature endpoints are intentionally excluded.

## Stack

- pnpm workspaces
- TurboRepo
- Next.js 15, React 19, Tailwind CSS
- Express 5 services
- Prisma with PostgreSQL
- Zod, Pino, Swagger
- Vitest and Supertest

## Apps

- `apps/web`: Next.js frontend
- `apps/gateway`: API gateway and shared middleware boundary
- `apps/auth-service`: authentication service boundary
- `apps/dataset-service`: dataset and connector service boundary
- `apps/query-service`: query validation and execution service boundary
- `apps/ai-orchestrator`: Gemini orchestration service boundary

## Packages

- `packages/api-client`: typed API client foundations
- `packages/config`: environment loading and Zod validation
- `packages/database`: Prisma client, database utilities, and connector interfaces
- `packages/prompts`: prompt template contracts
- `packages/types`: shared DTOs, enums, and response types
- `packages/utils`: reusable utilities
- `packages/validation`: shared Zod schemas

## Getting Started

```bash
pnpm install
cp .env.example .env
docker compose up -d
pnpm dev
```

## Common Commands

```bash
pnpm build
pnpm lint
pnpm test
pnpm typecheck
```

## Service Endpoints

Every backend service exposes:

- `GET /health`
- `GET /docs`

No business APIs are included in this scaffold.
