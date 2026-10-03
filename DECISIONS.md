# StudyPal Architectural Decision Records (ADRs)

## ADR-001: Monorepo Structure and Package Management
- **Status:** Accepted
- **Decision:** Use `pnpm` workspaces combined with `Turborepo` for orchestrating tasks (`build`, `lint`, `test`, `typecheck`).
- **Rationale:** Fast, disk-efficient symlink-based package management with caching for monorepos containing multiple services, shared libraries, and client applications.

## ADR-002: Service-to-Service Synchronous Communication
- **Status:** Accepted
- **Decision:** Use typed HTTP with structured JSON schemas and internal signed security tokens (HMAC/JWT with timestamp and correlation ID) for synchronous inter-service communication.
- **Rationale:** gRPC adds native protoc build toolchain dependencies and complex cross-compilation requirements in heterogeneous environments (Windows dev, Alpine/Debian Docker containers, etc.). Typed HTTP with shared DTO contracts in `packages/contracts` and a standardized resilient HTTP client (`service-kit`) provides end-to-end type safety, circuit breaking, retry with exponential backoff and jitter, with zero native dependency issues.

## ADR-003: Asynchronous Event Bus & Transactional Outbox
- **Status:** Accepted
- **Decision:** Redis Streams abstracted behind a typed `EventBus` interface in `packages/messaging`. Services persist domain events to an `outbox` table within the same ACID transaction as the business state mutation, and an outbox relay worker publishes them to Redis Streams with consumer group acknowledgment and idempotent deduplication via `eventId`.
- **Rationale:** Redis is already required for caching, rate limiting, and BullMQ queues, minimizing operational infrastructure overhead while ensuring at-least-once delivery with DLQ (Dead Letter Queue) support.

## ADR-004: Database Per Service & Storage Isolation
- **Status:** Accepted
- **Decision:** PostgreSQL with an isolated database per microservice (`studypal_identity`, `studypal_content`, `studypal_document`, `studypal_knowledge`, `studypal_assessment`, `studypal_progress`, `studypal_tutor`, `studypal_ai`). Each service has its own Prisma client and migration history.
- **Rationale:** Strictly prevents cross-boundary data leakage and guarantees service autonomy. Cross-service references use plain UUIDs without foreign key constraints.

## ADR-005: Vector Storage and Hybrid Search
- **Status:** Accepted
- **Decision:** `pgvector` with HNSW cosine distance indexing (`vector_cosine_ops`) hosted exclusively in `knowledge-service` database.
- **Rationale:** Native PostgreSQL vector indexing avoids external vector DB operational complexity while allowing strict transactional RAG filtering on document ownership, visibility, and curriculum tags directly within parameterized SQL queries.

## ADR-006: S3-Compatible Storage & Local Emulation
- **Status:** Accepted
- **Decision:** Use S3 API with MinIO for local development and Docker Compose, generating pre-signed PUT URLs for direct client uploads with server-side validation upon completion.
- **Rationale:** Direct-to-storage uploads reduce gateway memory and bandwidth pressure. Documents are validated for magic numbers (PDF `%PDF`), size thresholds (default 25MB max), and encrypted at rest.

## ADR-007: AI Provider Abstraction & Offline Determinism
- **Status:** Accepted
- **Decision:** `ai-service` acts as a unified proxy with pluggable provider adapters (OpenAI, Google Gemini, and a deterministic Local Mock Provider).
- **Rationale:** Guarantees offline local development and test suite stability without incurring external API costs, while permitting runtime provider switching with Zod-validated structured outputs.

## ADR-008: Auth Model & Gateway Token Propagation
- **Status:** Accepted
- **Decision:** Gateway validates the public user access token (asymmetric RS256/EdDSA or signed HS256 secret) and attaches a signed internal token (`x-internal-auth`) containing `userId`, `role`, `studentProfileId`, and `correlationId`. Downstream services verify the internal signature and enforce resource ownership checks.
- **Rationale:** Enforces zero-trust defense-in-depth: downstream services never blindly trust raw HTTP headers without signature verification.

## ADR-009: Multilingual Support (Sinhala, Tamil, English)
- **Status:** Accepted
- **Decision:** Content items (subjects, topics, competencies, questions) use a shared canonical `conceptId` referencing language variants (`si`, `ta`, `en`). The UI uses a shared type-safe dictionary (`packages/i18n`) with Noto Sans Sinhala, Noto Sans Tamil, and Inter typography tailored for ~30% text length expansion.

## ADR-010: Student Privacy & Minor Protection
- **Status:** Accepted
- **Decision:** Minimal personal data collection (no full real names required, pseudonymized usernames/display names, grade level, and language preference). Consent and age verification gate is required before onboarding.

## ADR-011: Interactive Map System (Web vs Mobile)
- **Status:** Accepted
- **Decision:** Leaflet.js with OpenStreetMap tiles for Web (`apps/web/src/app/geography/page.tsx`), paired with Haversine distance scoring (0-100% precision threshold). On mobile (`apps/mobile/app/(tabs)/geography.tsx`), provide a coordinates-based feature selection stub marked `TODO(phase-2)` pending react-native-maps integration.
- **Rationale:** Minimizes mobile bundle size and native build friction during development while ensuring full geography curriculum interactive testability on web.

## ADR-012: Voice Integration (Vapi Abstraction)
- **Status:** Accepted
- **Decision:** `tutor-service` exposes `/voice/sessions` creating authenticated Vapi web-call configurations with server-side HMAC signature verification for incoming webhooks (`/tutor/vapi/webhook`). Real audio calls fallback to deterministic mock sessions in offline/dev environments. Full telephony PSTN dispatch is marked `TODO(phase-2)`.
- **Rationale:** Ensures complete security (tool endpoints reject unauthorized payloads) without requiring live external Vapi credits during automated testing or local evaluation.
