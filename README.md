# RENEN — Assessment Funnel Platform

A production-ready Next.js 16 (App Router) platform for building, publishing, and analyzing assessment funnels with deterministic scoring, segment routing, and lead capture.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in DATABASE_URL, JWT_SECRET, WEBHOOK_SECRET

# 3. Push schema to DB
npm run db:push

# 4. Seed with demo data
npm run db:seed

# 5. Start dev server
npm run dev
```

Visit `http://localhost:3000` and log in with `owner@renen.app` / `password123`.

## Architecture

```
app/
├── (dashboard)/          # Protected dashboard routes
│   ├── dashboard/        # Main dashboard
│   ├── funnels/          # Funnel list + detail
│   ├── leads/            # Leads table + CSV export
│   ├── analytics/        # Event-derived analytics
│   ├── builder/[id]/     # Funnel builder hub
│   ├── ai/               # AI copilot pages
│   └── integrations/     # Webhooks
├── f/[slug]/             # Public funnel runtime
│   ├── page.tsx          # Landing page
│   ├── assessment/       # Assessment flow
│   └── result/[id]/      # Result page + CTA + PDF
├── api/                  # API routes
│   ├── auth/             # login, logout, me
│   ├── funnels/          # CRUD + publish
│   ├── submissions/      # Create + PDF download
│   ├── leads/            # List + CSV + detail
│   ├── analytics/        # Event aggregation
│   ├── assessments/      # Public assessment data
│   └── ai/               # AI copilot endpoints
└── login/                # Login page

lib/
├── auth/                 # Auth system (swappable)
│   ├── types.ts          # AuthUser, SessionPayload, RBAC
│   ├── provider.ts       # IUserProvider interface
│   ├── json-provider.ts  # JSON file implementation
│   └── session.ts        # JWT httpOnly cookies
├── db.ts                 # Prisma singleton
└── services/
    ├── scoring-engine.ts  # Deterministic scoring
    ├── segment-router.ts  # Precedence-based routing
    ├── event-logger.ts    # Analytics event logging
    ├── email-stub.ts      # Email (swappable)
    ├── pdf-generator.ts   # PDF reports
    ├── webhook-sender.ts  # HMAC-signed webhooks
    ├── ab-testing.ts      # A/B variant assignment
    └── ai-copilot.ts      # AI copilot (swappable)
```

## Auth System

The auth system uses **httpOnly JWT cookies** with a swappable provider pattern.

**Current:** JSON file (`data/users.json`) with bcrypt passwords  
**To swap to DB auth:** Implement `IUserProvider` and replace the export in `lib/auth/json-provider.ts`

```typescript
// lib/auth/db-provider.ts
export class DbUserProvider implements IUserProvider {
  async findByEmail(email: string) { /* query DB */ }
  async verifyPassword(user, password) { /* bcrypt.compare */ }
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing session JWTs (min 32 chars) |
| `WEBHOOK_SECRET` | Default HMAC secret for webhook signing |
| `NEXT_PUBLIC_APP_URL` | Public app URL (e.g. `https://renen.app`) |

## Database Scripts

```bash
npm run db:push      # Push schema to DB (no migration files)
npm run db:migrate   # Create migration files + push
npm run db:seed      # Seed with demo data
npm run db:studio    # Open Prisma Studio
npm run db:generate  # Regenerate Prisma client
```

## Public Funnel URL

Published funnels are accessible at `/f/[slug]`. The demo funnel is at:
```
http://localhost:3000/f/business-growth-assessment
```

## Scoring Engine

The scoring engine is **deterministic** — same answers always produce the same scores.

- Category scores are capped at `maxScore`
- Weighted sum determines `totalScore`
- Tiers are assigned by score range

## Segment Router

Segments are assigned by **precedence**:
1. `answer_match` (highest)
2. `category_threshold`
3. `total_score` (lowest)

Within the same precedence, lower `priority` number wins. All rules within a segment use **AND logic**.

## Services (Swappable)

| Service | Current | Swap To |
|---------|---------|---------|
| Email | Console stub | Resend / SendGrid |
| AI Copilot | Mock heuristics | OpenAI / Claude |
| Auth | JSON file | Database |

## Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| owner@renen.app | password123 | Owner |
| admin@renen.app | password123 | Admin |
| editor@renen.app | password123 | Editor |
| viewer@renen.app | password123 | Viewer |
