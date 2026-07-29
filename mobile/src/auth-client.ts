/**
 * auth-client.ts — Better Auth Expo client
 *
 * Creates the mobile-side auth client with:
 *   - expoClient plugin for deep-link support + SecureStore session storage
 *   - Cookie-based session (stored in expo-secure-store, NOT AsyncStorage)
 *   - Exports useSession hook for accessing current session in components
 *
 * Client-only — this file is safe to import from any component.
 * Do NOT import better-auth/server or src/server/* here.
 *
 * Closes #009
 */
import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';
import { getApiUrl } from '@/src/lib/api-url';

export const authClient = createAuthClient({
  baseURL: getApiUrl(),
  plugins: [
    expoClient({
      scheme: 'zengo',            // must match app.json "scheme"
      storagePrefix: 'zengo',     // prefix for SecureStore keys
      storage: SecureStore,       // secure, encrypted session storage
    }),
  ],
});

// Export the session hook directly so components don't need to import authClient.
export const { useSession } = authClient;
