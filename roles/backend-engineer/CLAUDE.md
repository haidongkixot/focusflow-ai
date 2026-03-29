# Backend Engineer Role — FocusFlow AI

## Stack
- Next.js 14 App Router, TypeScript, Prisma 6 (MUST pin v6), PostgreSQL (Neon)
- NextAuth v4, bcryptjs, zod, openai@4

## Auth Pattern
- `src/lib/auth.ts` — CredentialsProvider with bcrypt verify, session strategy jwt
- `src/lib/prisma.ts` — singleton PrismaClient
- `src/lib/rate-limit.ts` — in-memory Map, window-based

## API Conventions
- All protected routes: `getServerSession(authOptions)` → 401 if no session
- Zod validation on all POST/PATCH bodies
- Return `{ error: string }` on failure, data directly on success

## Key Routes
- `POST /api/auth/signup` — rate-limited (5/60s per IP), returns 201
- `GET/POST/PATCH/DELETE /api/tasks` — full CRUD with userId scoping
- `GET/POST /api/sessions` — focus session tracking, achievement checks
- `POST /api/ai/coach` — GPT-4o-mini insights with fallback
- `GET /api/progress` — stats + 7-day chart + achievements

## Prisma Models
Task, FocusSession, UserAchievement (unique: userId+type+name)
