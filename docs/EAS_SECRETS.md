# EAS Build Secrets & Store Credentials Guide (`Issue #070 / #177`)

This document details the configuration required for building standalone binaries (`.ipa` and `.aab`) via Expo Application Services (EAS Build) and submitting to the App Store and Google Play.

---

## 🔐 Required EAS Environment Secrets

The following variables must be configured as EAS Secrets via the CLI or Expo Dashboard before running production builds:

```bash
# Database & Auth Secrets
eas secret:create --name DATABASE_URL --value "postgresql://..." --scope project
eas secret:create --name BETTER_AUTH_SECRET --value "..." --scope project

# S3 File Storage Secrets
eas secret:create --name AWS_ACCESS_KEY_ID --value "..." --scope project
eas secret:create --name AWS_SECRET_ACCESS_KEY --value "..." --scope project
eas secret:create --name AWS_S3_BUCKET_NAME --value "zengo-study-files" --scope project
eas secret:create --name AWS_REGION --value "us-east-1" --scope project

# Sentry DSN
eas secret:create --name EXPO_PUBLIC_SENTRY_DSN --value "https://..." --scope project
```

---

## 📱 Build Commands Summary

| Target Platform & Environment | Command |
| :--- | :--- |
| **iOS Development (Simulator)** | `npm run build:ios:dev` |
| **iOS Preview (TestFlight / Internal)** | `npm run build:ios:preview` |
| **iOS Production (.ipa)** | `npm run build:ios:prod` |
| **Android Development (.apk)** | `npm run build:android:dev` |
| **Android Preview (.apk)** | `npm run build:android:preview` |
| **Android Production (.aab)** | `npm run build:android:prod` |

---

## 🚀 Submission Commands

- **iOS Submission**: `npm run submit:ios`
- **Android Submission**: `npm run submit:android`
