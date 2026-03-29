# Tester Role — FocusFlow AI

## Build Verification
```bash
npm run build   # must exit 0, 0 TypeScript errors
npm run dev     # landing renders at localhost:3000
```

## Manual QA Checklist
- [ ] Landing page loads, CTA links work
- [ ] Sign up with new email
- [ ] Log in / log out
- [ ] Create task (title, priority, category, estimated mins)
- [ ] Toggle task status: todo → in_progress → done
- [ ] Delete task
- [ ] Open timer, start 25-min focus session
- [ ] Pause / resume timer
- [ ] Select task in timer, complete session — focusSessions increments
- [ ] Short break / long break modes switch correctly
- [ ] Dashboard shows session count, AI coach loads
- [ ] Analytics chart renders 7-day data
- [ ] Achievement earned after first session

## API Tests
All routes require valid session cookie except signup/login.
