/**
 * storage.ts — AsyncStorage helper for Zengo app state cache
 *
 * Provides a simple key/value cache backed by AsyncStorage.
 * Used by AppContext to persist state locally for instant load on app restart.
 *
 * Key: zengo_app_state_v1
 *
 * Closes #013
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'zengo_app_state_v1';

/** Load the cached app state. Returns null if no cache exists or on parse error. */
export async function loadCache(): Promise<Record<string, unknown> | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Save the current app state to AsyncStorage. Silently drops errors. */
export async function saveCache(data: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable — state is still live in memory.
  }
}

/** Clear the cached app state (e.g., on sign-out). */
export async function clearCache(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CACHE_KEY);
  } catch {
    // Ignore errors on clear.
  }
}
