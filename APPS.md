# CODE FATALITY — Free Apps + Free Hosting

## Free downloads (GitHub Actions)

1. Open: https://github.com/surajsolanki1510/code-fatality/actions
2. Workflow: **Build Free App Downloads**
3. Click **Run workflow** → **Run workflow**
4. Wait ~10–20 minutes
5. Open Releases: https://github.com/surajsolanki1510/code-fatality/releases
6. Download:
   - `CODE-FATALITY-android.apk`
   - `CODE-FATALITY-windows-setup.exe`

Landing page **GET APP** also links to Releases.

## 1) Free API on Render (replace Railway trial)

1. Go to https://render.com → New → Web Service
2. Connect GitHub repo `surajsolanki1510/code-fatality`
3. Settings:
   - Root Directory: `apps/api`
   - Runtime: Docker
   - Instance: Free
4. Environment variables:
   - `DATABASE_URL` = your Neon URL
   - `JWT_SECRET` = long random 32+ chars
   - `CORS_ORIGIN` = `https://code-fatality.vercel.app`
   - `NODE_ENV` = `production`
5. Deploy → open `https://YOUR-SERVICE.onrender.com/health`
6. In Vercel → set `VITE_API_URL` to that Render URL → Redeploy web

Note: Render free sleeps when idle (first request can be slow).

## 2) Android APK (downloadable, free)

### Prerequisites
- Android Studio + JDK 17

### Build
```bash
cd apps/web
npm install
npm run build
npx cap sync android
npm run cap:android
```

In Android Studio:
- Build → Build Bundle(s) / APK(s) → Build APK(s)
- Copy APK from `android/app/build/outputs/apk/`

### Publish free download
Upload APK to GitHub Releases:
https://github.com/surajsolanki1510/code-fatality/releases

Users install with “Allow unknown apps”.

## 3) Windows EXE (downloadable, free)

### Prerequisites
- Rust: https://rustup.rs
- WebView2 (usually already on Win10/11)

### Build
```bash
cd apps/web
npm install
npm run tauri:build
```

Installer output is under `src-tauri/target/release/bundle/`.

Upload `.msi` / `.exe` to the same GitHub Release.

## 4) iOS (not free-store / needs Mac)
- Capacitor iOS project can be generated later on a Mac
- App Store requires Apple Developer ($99/year)

## Download page
Landing page links to GitHub Releases for Android/Windows builds once uploaded.
