# Deploy CODE FATALITY (Neon + Railway + Vercel)

This is the production path.

## 1) Neon (Database) — 5 minutes

1. Go to https://console.neon.tech and create a project: `codefatality`
2. Copy the connection string (use the **pooled** URL if shown)
3. Keep it ready as `DATABASE_URL`

Example shape:
```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST/neondb?sslmode=require
```

## 2) Railway (API) — 10 minutes

1. Go to https://railway.app → **New Project** → **Deploy from GitHub repo**
2. Select this repo
3. Set **Root Directory** to: `apps/api`
4. Railway will use `apps/api/railway.toml`
5. Add variables:

```env
DATABASE_URL=<paste Neon URL>
JWT_SECRET=<generate a long random string, 32+ chars>
JWT_EXPIRES_IN=30d
CORS_ORIGIN=https://YOUR-VERCEL-DOMAIN
NODE_ENV=production
PORT=4000
RATE_LIMIT_MAX=120
RATE_LIMIT_WINDOW=1 minute
```

6. Deploy, then open the Railway public URL and test:
   - `https://YOUR-API.up.railway.app/health`
   - should return `{ "ok": true, ... }`

## 3) Vercel (Web) — 8 minutes

1. Go to https://vercel.com → **Add New Project** → import same GitHub repo
2. Set:
   - Framework Preset: **Vite**
   - Root Directory: `apps/web`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add env:

```env
VITE_API_URL=https://YOUR-API.up.railway.app
```

4. Deploy
5. Copy your Vercel domain (example: `https://code-fatality.vercel.app`)
6. Go back to Railway and set:

```env
CORS_ORIGIN=https://code-fatality.vercel.app
```

7. Redeploy API once so CORS updates

## 4) Smoke test (must pass)

1. Open Vercel site
2. Click **SIGN IN / SAVE ACCOUNT**
3. Create account
4. Complete one chapter + LOCK IN
5. Refresh page → progress still there
6. In Neon SQL editor, confirm rows in `User`, `Progress`, `QuestCompletion`

## Generate JWT_SECRET quickly (PowerShell)

```powershell
-join ((48..57 + 65..90 + 97..122) | Get-Random -Count 48 | ForEach-Object {[char]$_})
```

## If something fails

- API 500 on boot: check `DATABASE_URL` + Prisma migrate logs on Railway
- Browser CORS errors: `CORS_ORIGIN` must exactly match Vercel URL (no trailing slash)
- Frontend calls localhost: `VITE_API_URL` missing/wrong on Vercel (rebuild after changing it)
