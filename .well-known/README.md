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
- Replace `REPLACE_WITH_ANDROID_SIGNING_SHA256` with the **SHA-256** fingerprint
  of the production signing certificate: `eas credentials` → Android →
  production keystore, or Google Play Console → Release → Setup → App integrity
  → App signing key certificate (SHA-256). Add multiple fingerprints (upload +
  Play-managed key) if both are in use.

## Test

```
# iOS
xcrun simctl openurl booted "https://ourpins.app/p/<group>/<pin>"
# Android
adb shell am start -a android.intent.action.VIEW -d "https://ourpins.app/p/<group>/<pin>" app.ourpins
```

See `OurPins-app/docs/deep-links.md` for the full deep-link design.
