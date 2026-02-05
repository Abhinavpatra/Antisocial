# Publishing Guide

## Option B: Standalone Install on Android (EAS Build "Internal Distribution")

This gives you an APK you can install directly on your phone.

### 1. Install EAS CLI and Login

```bash
npm i -g eas-cli
eas login
```

### 2. Add App Identifiers (Required for Builds)

In `application/app.json`, set:
- `expo.android.package` (example: `com.patra.timerapp`)
- `expo.ios.bundleIdentifier` (same style)

### 3. Create Build Config

```bash
eas build:configure
```

This creates `eas.json`.

### 4. Set Your Backend URL for Builds

Set the backend URL so it works off your PC:

```bash
eas secret:create --name EXPO_PUBLIC_BACKEND_URL --value "https://your-backend.com"
```

### 5. Build and Install

```bash
eas build -p android --profile preview
```

Download the APK from the link EAS outputs and install it on your phone.

---

## Option C: iPhone Standalone (TestFlight)

You need an Apple Developer account:

1. Build for iOS:
   ```bash
   eas build -p ios
   ```

2. Submit to App Store:
   ```bash
   eas submit -p ios
   ```
   (or upload via Transporter)

3. Invite yourself via TestFlight

---

## Publishing to Play Store / App Store (What's Still Missing)

Before store release, the big blockers are:

1. **Real screen-time tracking implementation**
   - Android needs native bridge + special permission handling
   - iOS generally cannot provide app-by-app screen time like Android without Apple's Screen Time APIs + entitlements, and even then it's constrained

2. **Real authentication**
   - Email/OTP/OAuth instead of dev user IDs

3. **Privacy policy + data handling**
   - You're dealing with usage data; stores will ask
