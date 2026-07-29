/**
 * query-client.ts — TanStack Query singleton + AsyncStorage persister.
 *
 * queryClient: global QueryClient with sensible defaults for a mobile app.
 *   - staleTime: 60s — data is considered fresh for 1 minute
 *   - gcTime: 7 days — cached data lives on-disk for 7 days
 *   - retry: 1 — one automatic retry on failure
 *   - refetchOnWindowFocus: false — mobile has no "window focus"
 *
 * persister: AsyncStorage-backed cache that survives app restarts.
 *   Reference data (kana, kanji, vocabulary) stays cached for up to 7 days,
 *   making subsequent cold boots feel instant.
 *
 * Closes #009c
 */
import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/react-query-persist-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,              // 1 minute before background refetch
      gcTime: 7 * 24 * 60 * 60 * 1000,  // 7 days garbage-collection interval
      retry: 1,                           // one automatic retry on network failure
      refetchOnWindowFocus: false,        // no window focus concept on mobile
    },
    mutations: {
      retry: 0,                           // don't retry mutations automatically
    },
  },
});

export const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'zengo_query_cache',
  throttleTime: 1000,                    // debounce writes to AsyncStorage by 1s
});
