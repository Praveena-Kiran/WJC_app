/**
 * api-url.ts — Resolves the correct API base URL for the current environment.
 *
 * Priority order:
 * 1. app.json extra.apiUrl (set at build time for production)
 * 2. EXPO_PUBLIC_API_URL env var (set in .env.development)
 * 3. Metro LAN IP from expo-constants (auto-detected in Expo Go dev mode)
 * 4. http://localhost:8081 (fallback for simulators)
 * 5. throws in production if none of the above are set
 *
 * Closes #009
 */
import Constants from 'expo-constants';

export function getApiUrl(): string {
  // 1. Build-time override from app.json extra.apiUrl
  const explicit =
    (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
    (typeof process !== 'undefined' && (process as NodeJS.Process & { env?: Record<string, string> }).env?.EXPO_PUBLIC_API_URL);

  if (explicit && explicit.length > 0) {
    return explicit.replace(/\/$/, '');
  }

  // 2. Expo Go dev mode: auto-detect LAN IP from debuggerHost
  if (__DEV__) {
    const lan = (Constants.expoGoConfig as { debuggerHost?: string } | null)?.debuggerHost?.split(':')[0];
    if (lan) return `http://${lan}:8081`;
    return 'http://localhost:8081';
  }

  // 3. Production: must have an explicit URL
  throw new Error(
    'Missing API URL: set EXPO_PUBLIC_API_URL in your environment or apiUrl in app.json extra.'
  );
}
