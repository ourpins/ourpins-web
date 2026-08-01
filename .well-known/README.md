# `.well-known/` — deep-link verification files

These two files let `https://ourpins.app/p/<groupId>/<pinId>` links open the
OurPins app directly (iOS Universal Links / Android App Links) instead of the
browser. They are served by GitHub Pages because the repo has a `.nojekyll`
file (without it, Pages hides dot-folders).

> **Before release, replace the two placeholders below.** Until then the links
> resolve to the website (they do not crash) but will not open the app.

## `apple-app-site-association` (iOS)

- Must be served at `https://ourpins.app/.well-known/apple-app-site-association`
  with **no `.json` extension** and **no redirect**.
- Replace `REPLACE_WITH_APPLE_TEAM_ID` with the Apple Developer **Team ID**
  (Apple Developer → Membership, or `eas credentials` → iOS). The value becomes
  `<TEAMID>.app.ourpins`.
- Note: GitHub Pages serves this extensionless file as `application/octet-stream`.
  Modern iOS (via Apple's CDN) accepts it, but if validation fails, host the
  file behind something that sets `Content-Type: application/json` (Netlify
  `_headers`, a Cloudflare Worker, etc.).

## `assetlinks.json` (Android)

- Served at `https://ourpins.app/.well-known/assetlinks.json`.
- The fingerprint currently in the file (`FA:C6:17:45:…:3B:9C`) is the **shared
  Android debug keystore** (`OurPins-app/android/app/debug.keystore`) so that
  local `expo run:android` builds can verify App Links during testing.
- **Before the Play release, ADD the production SHA-256** to the same
  `sha256_cert_fingerprints` array (keep the debug one during development,
  remove it once external testing is over):
  Google Play Console → **Setup → App signing → App signing key certificate →
  SHA-256**. Play re-signs the app, so this is the value that matters — NOT the
  EAS upload key. If you also distribute internal APKs signed by the EAS
  keystore, additionally add its SHA-256 (`eas credentials -p android`).
- Do not leave malformed placeholder strings in the array — Google's verifier
  rejects the whole statement.

## Test

```
# iOS
xcrun simctl openurl booted "https://ourpins.app/p/<group>/<pin>"
# Android
adb shell am start -a android.intent.action.VIEW -d "https://ourpins.app/p/<group>/<pin>" app.ourpins
```

See `OurPins-app/docs/deep-links.md` for the full deep-link design.
