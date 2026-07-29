/**
 * routes.ts — View name → Expo Router path mapping
 *
 * In the web app, setActiveView(viewName) updates a string in AppContext
 * and the UI re-renders to show a different "panel". In the mobile app,
 * navigation is handled by Expo Router, so setActiveView maps view names
 * to routes and calls router.push().
 *
 * Closes #013
 */

export const VIEW_ROUTE_MAP: Record<string, string> = {
  // ── Tab screens ──────────────────────────────────────────────────
  dashboard: '/(tabs)/',
  'kana-trainer': '/(tabs)/kana',
  dictionary: '/(tabs)/dictionary',
  'kanji-board': '/(tabs)/kanji',
  quiz: '/(tabs)/quiz',

  // ── More / Drawer screens ────────────────────────────────────────
  'n5-roadmap': '/more/roadmap',
  kaiwa: '/(tabs)/kaiwa',       // currently in tabs; will move to /more after #016
  'voice-coach': '/more/voice',
  'kanji-radicals': '/more/radicals',
  settings: '/more/settings',

  // ── Teacher-only ─────────────────────────────────────────────────
  'teacher-dashboard': '/more/teacher',
  attendance: '/more/attendance',
  'file-manager': '/more/files',
  announcements: '/more/announcements',
};

/**
 * Resolves a view name to its Expo Router path.
 * Falls back to '/(tabs)/' for unknown views.
 */
export function resolveViewRoute(viewName: string): string {
  return VIEW_ROUTE_MAP[viewName] ?? '/(tabs)/';
}
