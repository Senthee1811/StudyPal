# StudyPal 🇱🇰

> Multilingual (Sinhala, Tamil, English) AI Learning Platform for the Sri Lankan National Curriculum and Competitive Exams. Built with a distributed microservices architecture, strict database-per-service isolation, transactional outbox messaging, pgvector hybrid search, and native multilingual support.

---

## 🏛 System Architecture

```
                    ┌────────────────────────────────────────┐
                    │               Clients                  │
                    │   Web (Next.js)  │  Mobile (Expo / RN) │
                    └──────────────────┬─────────────────────┘
                                       │ REST /api/v1 (JWT)
                                       ▼
                    ┌────────────────────────────────────────┐
                    │        API Gateway (Port 8000)         │
                    │  Rate Limiting • JWT Auth • RBAC Check │
                    │  HMAC Token Signing (x-internal-auth)  │
                    └──────────────────┬─────────────────────┘
                                       │ Internal Typed HTTP + Correlation ID
          ┌────────────────┬───────────┼───────────┬────────────────┬──────────────┐
          ▼                ▼           ▼           ▼                ▼              ▼
   ┌─────────────┐  ┌─────────────┐  ┌───┴───────┐  ┌─────────────┐  ┌─────────────┐ ┌─────────────┐
   │  Identity   │  │   Content   │  │ Document  │  │  Knowledge  │  │ Assessment  │ │  Progress   │
   │ (Port 8001) │  │ (Port 8002) │  │(Port 8003)│  │ (Port 8004) │  │ (Port 8006) │ │ (Port 8007) │
   └──────┬──────┘  └──────┬──────┘  └───┬───────┘  └───┬──────┬──┘  └──────┬──────┘ └──────▲──────┘
          │                │             │              │      │           │             │
          ▼                ▼             ▼              ▼      ▼           ▼             │
     Postgres DB      Postgres DB   Postgres DB    Postgres  Worker    Postgres DB       │
     (identity)       (content)     (document)     +pgvector (RAG)    (assessment)       │
                                         │              ▲                  │             │
                                         │ Redis Stream │                  │ Redis Stream│
                                         └──────────────┘                  └─────────────┘
                                         (DocumentUploaded)              (AttemptSubmitted)
```

---

## 🚀 Services & Port Mapping

| Service | Port | Database | Primary Responsibility |
| :--- | :--- | :--- | :--- |
| **API Gateway** | `8000` | *None* | Public edge BFF, JWT auth, RBAC, Throttler rate limiting, Swagger OpenAPI docs, Internal HMAC token signing. |
| **identity-service** | `8001` | `studypal_identity` | Registration, login, rotating refresh tokens with SHA-256 reuse detection, student profiles, JWKS. |
| **content-service** | `8002` | `studypal_content` | Trilingual curriculum versions (Grade 9 Maths & Geography), shared concept IDs, official question bank, audit logs. |
| **document-service** | `8003` | `studypal_document` | S3 pre-signed upload URLs, `%PDF` magic bytes validation, transactional outbox emitting `DocumentUploaded`. |
| **knowledge-service** | `8004` | `studypal_knowledge` | Page-aware extraction, chunking, pgvector HNSW indexing, parameterized RAG user isolation, hierarchical summaries. |
| **ai-service** | `8005` | `studypal_ai` | Provider abstraction (OpenAI / Gemini / deterministic Mock), prompt templates in 3 languages, per-user token quotas. |
| **assessment-service** | `8006` | `studypal_assessment` | AI question generation pipeline, immutable exam snapshots, auto-marking, transactional outbox emitting `AttemptSubmitted`. |
| **progress-service** | `8007` | `studypal_progress` | Consumes `AttemptSubmitted`, records answer evidence, computes Bayesian smoothed mastery, rule-based recommendations. |
| **tutor-service** | `8008` | `studypal_tutor` | RAG-grounded tutor sessions, Vapi WebRTC voice session creation, signature-verified tool endpoints. |
| **PostgreSQL** | `5432` | `8 Isolated DBs` | PostgreSQL with `pgvector` enabled in `studypal_knowledge`. |
| **Redis** | `6379` | `Redis Streams` | Async event bus (`RedisStreamsEventBus`) with consumer groups, DLQ, and cache. |
| **MinIO (S3)** | `9000` / `9001` | `studypal-documents` | S3-compatible private storage with pre-signed PUT URLs. |
| **Web Client** | `3000` | *N/A* | Next.js 15 (App Router), TailwindCSS, Leaflet maps, trilingual switcher. |
| **Mobile Client** | `8081` | *N/A* | Expo 52, React Native, NativeWind, trilingual switcher, mobile tabs. |

---

## 🔒 Microservices Principles & Architecture Rules

1. **Database Per Service:** No service ever queries another service's tables directly. Cross-service references use plain UUIDs without DB foreign key constraints.
2. **Zero-Trust Auth Propagation:** The Gateway verifies the client's JWT and mints a short-lived, HMAC-signed internal token (`x-internal-auth`). Downstream services verify this token using `@studypal/service-kit` and re-verify tenant and resource ownership.
3. **Transactional Outbox & Event Bus:** State mutations and domain events are persisted in the same ACID transaction. An outbox relay worker publishes events to Redis Streams. Consumers are strictly idempotent and deduplicate via `eventId` with DLQ retries.
4. **Parameterized RAG Isolation:** `knowledge-service` filters documents by `owner_id` or `is_public` directly inside parameterized SQL vector queries. Student PDFs never leak across tenants or contaminate the official question bank.
5. **Bayesian Mastery Calculation:** `progress-service` updates mastery scores using Bayesian smoothing `(correct + α) / (total + α + β)` with confidence scaling `min(1.0, total / 10)` and generates rule-based curriculum recommendations.
6. **Resilient Inter-Service HTTP:** Service-to-service calls use `ResilientHttpClient` from `@studypal/service-kit` with circuit breaker (CLOSED, OPEN, HALF_OPEN) and jittered exponential backoff retries.
7. **Trilingual First (si, ta, en):** UI strings and curriculum concepts use authentic Sinhala, Tamil, and English definitions from `@studypal/i18n` with support for ~30% text expansion.

---

## 🛠 Local Setup & Development

### 1. Prerequisites
- **Node.js** `>= 20.0.0`
- **pnpm** `>= 9.0.0`
- **Docker** & **Docker Compose**

### 2. Environment Configuration
Copy the template `.env.example` into `.env`:
```bash
cp .env.example .env
```

### 3. Start Infrastructure via Docker Compose
Start PostgreSQL (with pgvector), Redis, MinIO, and internal services:
```bash
docker compose -f infrastructure/docker/docker-compose.yml up -d postgres redis minio
```

### 4. Install Dependencies & Generate Prisma Clients
```bash
pnpm install
pnpm db:generate
```

### 5. Seed Initial Data
Seed the curriculum (Grade 9 Mathematics and Geography in Sinhala, Tamil, and English), official questions, and admin/student accounts:
```bash
pnpm --filter @studypal/content seed
```

### 6. Run Microservices & Frontends
Run all services and clients in development mode:
```bash
pnpm dev
```
- Web Portal: [http://localhost:3000](http://localhost:3000)
- API Gateway & Swagger Docs: [http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs)
- MinIO Console: [http://localhost:9001](http://localhost:9001) (`admin` / `password123`)

---

## 🧪 Testing

Run all unit tests, contract tests, and domain verification suites across the monorepo:
```bash
pnpm test
```

### Verified Test Suites:
1. **Token Rotation & Reuse Detection** (`services/identity/dist/auth.service.spec.js`):
   - Generates and rotates refresh tokens.
   - Detects token reuse attacks and invalidates the entire token family.
2. **Cross-User Document Isolation** (`services/knowledge/dist/isolation.spec.js`):
   - Parameterized SQL RAG filtering guarantees User A cannot retrieve User B's uploaded notes.
3. **Objective Exam Marking & Outbox Idempotency** (`services/assessment/dist/marking.spec.js`):
   - Computes marks against immutable snapshots.
   - Ensures outbox deduplication via idempotent keys.
4. **Bayesian Topic Mastery & Confidence Scaling** (`services/progress/dist/mastery.spec.js`):
   - Verifies Bayesian smoothed probability calculations and rule-based priority recommendations.

---

## 📱 Client Screens

### Web (`apps/web`):
- `/login`: Trilingual authentication with Minor Consent Protection notice.
- `/`: Dashboard showing Grade 9 Mathematics and Geography curriculum units.
- `/library`: PDF upload simulator, status lifecycle (`UPLOADED` → `PROCESSING` → `READY`), hierarchical summaries, and page citations.
- `/tutor`: AI Chat companion with page citations and Vapi voice call launcher.
- `/exams`: Timed mock exam runner with countdown timer, autosave, and score review.
- `/progress`: Bayesian mastery percentage bars and rule-based study recommendations.
- `/geography`: Interactive Leaflet map of Sri Lanka with OpenStreetMap tiles and Haversine distance scoring.
- `/admin`: Review queue for moderation of generated and official question items.

### Mobile (`apps/mobile`):
- `(tabs)/index`: Trilingual home screen with Grade 9 subjects and language switcher (`si`, `ta`, `en`).
- `(tabs)/library`: Document status inspector and textbook summaries with citations.
- `(tabs)/tutor`: RAG-grounded chat and Vapi voice session trigger.
- `(tabs)/exams`: Mobile mock exam question runner with radio selections and instant marking.
- `(tabs)/progress`: Mastery progress metrics and high-priority study recommendations.
- `(tabs)/geography`: Sri Lanka relief and topography feature selector (`TODO(phase-2)` native map stub).

---

## 📄 License
MIT
