# Over-The-Air (OTA) Updates Guide (`Issue #072 / #179`)

This guide explains how `expo-updates` and EAS Update channels are configured for Zengo Mobile to deliver instant JS bundle updates without full App Store / Play Store re-submissions.

---

## ⚙️ Configuration Overview

1. **Runtime Version Policy**: Set to `appVersion` in `mobile/app.json`. Bumping `version` in `app.json` automatically isolates updates to compatible native builds.
2. **Automatic Checks**: Configured with `checkAutomatically: "ON_LOAD"` and `fallbackToCacheTimeout: 3000` to prevent load delays on poor networks.
3. **In-App Notification Hook**: [`useOtaUpdate()`](file:///C:/Users/krishna%20chaithanya/.gemini/antigravity-ide/scratch/WJC_app/mobile/src/hooks/useOtaUpdate.ts) silently checks and downloads updates in production builds, prompting the user with a restart alert when ready.

---

## 🚀 Publishing OTA Updates

### Publish to Preview Branch
```bash
npx eas-cli update --branch preview --message "Preview update"
```

### Publish to Production Branch
```bash
npx eas-cli update --branch production --message "Production bugfix update"
```

---

## 🛑 When to Use OTA vs New Store Build

- **Use OTA for**: Bug fixes in React components, UI tweaks, JS business logic updates, copy changes.
- **Use New Store Build for**: Adding new native modules, modifying `app.json` native configurations, or updating native SDKs.
