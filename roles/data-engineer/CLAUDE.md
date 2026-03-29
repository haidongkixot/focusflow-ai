# Data Engineer Role — FocusFlow AI

## Seed Data
- `prisma/seed.ts` — admin@focusflow.ai + demo@focusflow.ai + 3 tasks + 5 sessions + 1 achievement
- `scripts/create-admin.ts` — CLI to promote/create admin users

## Run Seed
```bash
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

## DB Setup
1. Get DATABASE_URL from Neon dashboard
2. Add to `.env` (never commit)
3. `npx prisma db push`
4. `npx ts-node prisma/seed.ts`

## Schema Location
`prisma/schema.prisma` — User, Account, AuthSession, VerificationToken, Task, FocusSession, UserAchievement
