# QueryFlow

QueryFlow is a TypeScript monorepo for an AI-assisted business intelligence platform. The repository combines a Next.js frontend, multiple Express backend services, shared workspace packages, Prisma database models, and Docker Compose support for PostgreSQL.

## Monorepo Structure

- `apps/web` - Next.js 15 frontend
- `apps/auth-service` - authentication API service
- `apps/connection-service` - database connection and metadata API service
- `apps/query-service` - query orchestration, metadata, and conversation API service
- `apps/conversation-service` - conversation persistence and messaging API service
- `packages/api-client` - typed API client package
- `packages/config` - environment loading and validation utilities
- `packages/database` - Prisma client and database access utilities
- `packages/prompts` - prompt template contracts
- `packages/types` - shared types and DTOs
- `packages/utils` - reusable helper utilities
- `packages/validation` - shared validation schemas

## Tech Stack

- pnpm workspaces
- Turborepo
- Next.js 15 / React 19 / Tailwind CSS
- Express 5 services
- Prisma + PostgreSQL
- Zod validation
- Pino logging
- Swagger UI for API docs
- Vitest + Supertest for tests

## Service Overview

### apps/web

Next.js frontend served on `http://localhost:3000` by default. It uses these public environment variables:

- `NEXT_PUBLIC_AUTH_API_URL`
- `NEXT_PUBLIC_CONNECTION_API_URL`
- `NEXT_PUBLIC_QUERY_API_URL`

The frontend includes Axios-based API clients with bearer token attachment and refresh-token handling in `apps/web/src/services/api.ts`.

### apps/auth-service

Authentication service running on `http://localhost:4001` by default.

Routes:

- `POST /register`
- `POST /verify-email`
- `POST /resend-verification`
- `POST /login`
- `POST /refresh`
- `POST /logout`
- `GET /me`
- `PATCH /update-profile`
- `POST /avatar`
- `POST /forgot-password`
- `POST /reset-password`
- `GET /health`

### apps/connection-service

Connection management and database metadata service on `http://localhost:4002`.

Routes:

- `POST /connections`
- `GET /connections`
- `GET /connections/:id`
- `PATCH /connections/:id`
- `DELETE /connections/:id`
- `POST /connections/:id/test`
- `GET /connections/:id/tables`
- `GET /connections/:id/tables/:table/columns`
- `GET /connections/:id/tables/:table/primary-key`
- `GET /connections/:id/relations`
- `GET /connections/:id/indexes`
- `GET /connections/:id/views`
- `GET /connections/:id/functions`
- `GET /connections/:id/info`
- `GET /connections/:id/schemas`
- `POST /connections/:id/execute`
- `GET /health`
- `GET /docs`

### apps/query-service

Query orchestration, metadata, and conversation APIs on `http://localhost:4003`.

Routes:

- `GET /health`
- `GET /docs`
- `POST /query`
- `POST /query/execute`
- `GET /query/conversations`
- `GET /query/conversations/:id/messages`
- `PATCH /query/conversations/:id`
- `DELETE /query/conversations/:id`
- `GET /metadata/:connectionId/tables`
- `GET /metadata/:connectionId/tables/:tableName/columns`
- `GET /metadata/:connectionId/relations`
- `GET /metadata/:connectionId/schemas`
- `GET /metadata/:connectionId/database-info`
- `GET /metadata/:connectionId`

The service generates SQL from natural language queries and will execute read queries automatically. Queries that require confirmation are returned with analysis and must be run explicitly through `POST /query/execute`.

### apps/conversation-service

Conversation persistence service on `http://localhost:4004`.

Routes:

- `POST /conversations`
- `GET /conversations`
- `GET /conversations/:id/messages`
- `PATCH /conversations/:id`
- `DELETE /conversations/:id`
- `POST /conversations/:id/messages/user`
- `POST /conversations/:id/messages/assistant`
- `GET /health`
- `GET /docs`

## Database

The Prisma schema is defined in `packages/database/prisma/schema.prisma` and includes:

- `User`, `RefreshToken`, `PasswordResetToken`
- `DatabaseConnection` and supported database types
- `Conversation`, `Message`, and message roles

## Environment

Copy the example environment file and update values as needed:

```bash
cp .env.example .env
```

The `.env.example` file defines service ports and public service URLs for local development, including:

- `WEB_PORT`
- `AUTH_SERVICE_PORT`
- `CONNECTION_SERVICE_PORT`
- `QUERY_SERVICE_PORT`
- `CONVERSATION_SERVICE_PORT`
- `NEXT_PUBLIC_AUTH_API_URL`
- `NEXT_PUBLIC_CONNECTION_API_URL`
- `NEXT_PUBLIC_QUERY_API_URL`

`docker-compose.yml` provisions a local PostgreSQL container only and uses `POSTGRES_PORT` to map the host port.

## Development

Install dependencies and start the repo:

```bash
pnpm install
cp .env.example .env
docker compose up -d
pnpm dev
```

Run common workspace commands:

```bash
pnpm build
pnpm lint
pnpm test
pnpm typecheck
pnpm format
```

## Notes

- The repo uses `pnpm` workspaces configured in `pnpm-workspace.yaml`.
- `apps/web` does not use an API gateway service; it communicates directly with the backend service URLs defined in environment variables.
- Swagger UI is available for services that mount `/docs`, including `connection-service`, `query-service`, and `conversation-service`.
