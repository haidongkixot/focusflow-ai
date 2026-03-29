# Builder Role — FocusFlow AI

## Vercel Deployment

### Required Environment Variables
```
DATABASE_URL=postgresql://...neon.tech/focusflow
NEXTAUTH_URL=https://focusflow-ai.vercel.app
NEXTAUTH_SECRET=<32-char random string>
OPENAI_API_KEY=sk-...
```

### Deploy Steps
1. `vercel --prod` from project root
2. Set env vars in Vercel dashboard
3. `npx prisma db push` against Neon DB
4. Run seed script

### GitHub
- Repo: haidongkixot/focusflow-ai (create if not exists)
- `git init && git add . && git commit -m "Initial commit" && git remote add origin ... && git push -u origin main`

### Build Command
`npm run build` — Next.js 14 static + SSR
