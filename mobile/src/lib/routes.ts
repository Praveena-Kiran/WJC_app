export const VIEW_ROUTE_MAP: Record<string, string> = {
  dashboard: '/(tabs)/',
  'kana-trainer': '/(tabs)/kana',
  dictionary: '/(tabs)/dictionary',
  'kanji-board': '/(tabs)/kanji',
  quiz: '/(tabs)/quiz',
  kaiwa: '/more/kaiwa',
  'n5-roadmap': '/more/planner',
  'kanji-radicals': '/more/radicals',
  settings: '/more/settings',
};

export function resolveViewRoute(viewName: string): string {
  return VIEW_ROUTE_MAP[viewName] ?? '/(tabs)/';
}
