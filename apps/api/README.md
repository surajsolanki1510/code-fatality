# CODE FATALITY — Production readiness

This stack is built for real users (auth + Postgres + secured APIs).

## Local run

1. Postgres running on `localhost:5432`
2. `apps/api/.env` configured (`DATABASE_URL`, `JWT_SECRET`)
3. Terminal A:
   ```bash
   cd apps/api
   npm install
   npx prisma generate
   npx prisma migrate deploy   # or apply prisma/manual_auth_migrate.sql once
   npm run dev
   ```
4. Terminal B:
   ```bash
   cd apps/web
   npm install
   npm run dev
   ```

## What is production-ready now

- Email/password auth + guest mode
- JWT-protected progress endpoints
- Rate limiting + Helmet security headers
- Quest completions in indexed table (scales far beyond 50k)
- Connection pool params on `DATABASE_URL`
- Frontend Sign in / Create account / Save guest progress

## Cloud deploy (required for public 50k)

1. Create managed Postgres (Neon / Supabase / Railway)
2. Put connection string in API `DATABASE_URL`
3. Set strong `JWT_SECRET` (32+ random chars)
4. Set `CORS_ORIGIN` to your real web domain only
5. Deploy API (Railway / Render / Fly)
6. Deploy web (Vercel / Netlify / Cloudflare Pages)
7. Set web `VITE_API_URL` to your API URL
8. Enable automated DB backups on the Postgres host

## Hardening still recommended before huge traffic

- OAuth (Google) for easier signup
- Redis for rate-limit store across multiple API instances
- Observability (Sentry + uptime checks)
- CDN for static assets
