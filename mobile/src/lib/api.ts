/**
 * api.ts — Re-export apiFetch for backward compatibility.
 * All requests delegate to api-fetch.ts which includes better-auth cookie injection.
 */
export { apiFetch, ApiError } from './api-fetch';
