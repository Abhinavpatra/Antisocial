# TimerApp – Android Build & Release Guide

## Prerequisites

| Tool | Install |
|------|---------|
| Node.js 18+ | https://nodejs.org |
| Bun | `npm i -g bun` |
| EAS CLI | `npm i -g eas-cli` |
| Expo account | `eas login` |
| Google Play Console | https://play.google.com/console |

---

## 1. Install on your phone (development APK)

This builds a **development client** APK you can sideload directly onto your Android device.
It includes the native `UsageStatsModule` (not available in Expo Go).

```bash
cd application

# First time only – link Expo project
eas build:configure

# Build the dev client APK
eas build -p android --profile development
```

EAS will print a download URL when the build finishes.
Transfer the `.apk` to your phone and install it (enable "Install from unknown sources" if prompted).

To start the JS bundler while developing:

```bash
bunx expo start --dev-client
```

---

## 2. Preview build (release-mode APK, no dev tools)

```bash
eas build -p android --profile preview
```

This produces a release-signed APK suitable for personal use or sharing with testers.

---

## 3. Production build (Play Store AAB)

```bash
eas build -p android --profile production
```

This produces a signed `.aab` (Android App Bundle) for upload to Google Play.

---

## 4. Submit to Google Play

### 4a. One-time setup

1. **Create your app** in [Google Play Console](https://play.google.com/console).
2. **Create a Google Cloud service account** with Play Console access:
   - Google Cloud Console → IAM → Service Accounts → Create
   - Grant "Service Account User" role
   - Create a JSON key and save it as `application/google-services-key.json`
   - In Play Console → Setup → API Access → link the service account
3. **App signing**: Let Google manage signing (recommended). Upload your first AAB manually.

### 4b. Automated submission

```bash
eas submit -p android --profile production
```

Or combine build + submit:

```bash
eas build -p android --profile production --auto-submit
```

---

## 5. Play Store checklist

### Store listing
- [ ] App title: **TimerApp**
- [ ] Short description (80 chars)
- [ ] Full description (4000 chars)
- [ ] Feature graphic (1024x500)
- [ ] App icon (512x512) – already in `assets/images/`
- [ ] Screenshots: at least 2 phone screenshots (min 320px, max 3840px per side)

### Content rating
- [ ] Complete the IARC questionnaire (no violence, no user-generated content shared publicly)

### Data Safety
- [ ] **Data collected**: Device usage statistics (app names, foreground durations)
- [ ] **Purpose**: App functionality (screen-time tracking)
- [ ] **Data shared**: Not shared with third parties
- [ ] **Data encrypted in transit**: Yes (HTTPS)
- [ ] **User can request deletion**: Yes (local data cleared on uninstall)
- [ ] **Account optional**: No account required (single-device identity)

### Privacy policy
- [ ] Host a privacy policy page (can be a simple GitHub Pages / Notion page)
- [ ] Must disclose: what data is collected (usage stats), how it's used, that it's stored locally
- [ ] Add the URL in Play Console → Policy → Privacy policy

### Target audience
- [ ] Target age: 13+ (or "Everyone" if no social features are exposed)
- [ ] Ads: None

### Pricing
- [ ] Free

### Release track
- [ ] Start with **Internal testing** (up to 100 testers, no review)
- [ ] Then **Closed testing** → **Open testing** → **Production**

---

## 6. Backend URL for production

If you deploy your backend (e.g., to Vercel, Railway, Fly.io), set the URL:

```bash
# Option A: In eas.json (already has the env placeholder)
# Edit eas.json → build.production.env.EXPO_PUBLIC_BACKEND_URL

# Option B: Using EAS Secrets (recommended for CI)
eas secret:create --name EXPO_PUBLIC_BACKEND_URL --value "https://your-backend.example.com"
```

If left empty, the app runs fully offline – local usage tracking works,
but social features (leaderboard, friends, challenges) show "Unable to connect".

---

## 7. Permissions used

| Permission | Purpose | Type |
|------------|---------|------|
| `PACKAGE_USAGE_STATS` | Read per-app screen time | Special (user must manually grant in Settings) |
| `POST_NOTIFICATIONS` | Local notification alerts | Runtime (Android 13+) |

---

## Key files

| File | Purpose |
|------|---------|
| `app.json` | Expo config, Android package name, version |
| `eas.json` | EAS Build profiles (dev/preview/production) |
| `modules/usage-stats/` | Native Kotlin module for UsageStatsManager |
| `google-services-key.json` | (You create) Service account key for Play Store submission |
