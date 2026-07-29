# Deep Links Setup & Testing Guide (`Issue #068 / #175`)

This document outlines the URI scheme configuration for Zengo Mobile and provides instructions for testing deep links on iOS, Android, and Expo Go.

---

## 🔗 Custom URI Scheme Configuration

The mobile app registers the custom URI scheme `zengo://` in `mobile/app.json`:

```json
{
  "expo": {
    "name": "Zengo",
    "slug": "zengo",
    "scheme": "zengo"
  }
}
```

With Expo Router file-based navigation, deep links map directly to file paths under `mobile/app/`:

| Deep Link URL | Expo Router Route | Description |
| :--- | :--- | :--- |
| `zengo:///reset-password?token=XYZ` | `app/(auth)/reset-password.tsx` | Password reset landing with token parameter |
| `zengo:///(tabs)` | `app/(tabs)/index.tsx` | Main application dashboard |
| `zengo:///modal` | `app/modal.tsx` | Modal screen |

---

## 🧪 Testing Deep Links in Development

### 1. iOS Simulator (Dev Build / Standalone)
```bash
npx uri-scheme open "zengo:///reset-password?token=test123" --ios
```

### 2. Android Emulator (Dev Build / Standalone)
```bash
npx uri-scheme open "zengo:///reset-password?token=test123" --android
```

### 3. Physical Device (Expo Go Fallback)
In Expo Go, custom schemes are prefixed with `exp://<local-ip>:8081/--/`:
```bash
npx uri-scheme open "exp://192.168.1.100:8081/--/reset-password?token=test123"
```
