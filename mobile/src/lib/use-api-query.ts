/**
 * use-api-query.ts — TanStack Query wrapper with automatic cookie injection.
 *
 * Combines apiFetch (session cookies) with TanStack Query (caching, retries,
 * background refetch). Modules use this hook to GET server data with one line.
 *
 * Usage:
 *   const { data, isLoading, error } = useApiQuery<UserProgress>('/api/progress');
 *   const { data } = useApiQuery('/api/reference?type=kana', { staleTime: Infinity });
 *
 * Closes #009b
 */
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiFetch } from '@/src/lib/api-fetch';

export function useApiQuery<T = unknown>(
  path: string,
  opts?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, Error>({
    queryKey: [path],
    queryFn: ({ signal }) => apiFetch<T>(path, { signal }),
    ...opts,
  });
}
