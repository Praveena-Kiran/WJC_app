export type ThemeMode = 'zen' | 'cyber-dark' | 'cyber-light';

export interface ThemeTokens {
  background: string;
  cardBg: string;
  cardBorder: string;
  textMain: string;
  textMuted: string;
  accent: string;
  accentSecondary: string;
  success: string;
}

export const THEME_TOKENS: Record<ThemeMode, ThemeTokens> = {
  zen: {
    background: '#f8fafc',
    cardBg: '#ffffff',
    cardBorder: '#e2e8f0',
    textMain: '#0f172a',
    textMuted: '#64748b',
    accent: '#5c60f5',
    accentSecondary: '#8b5cf6',
    success: '#10b981',
  },
  'cyber-dark': {
    background: '#0f172a',
    cardBg: '#1e293b',
    cardBorder: '#334155',
    textMain: '#f8fafc',
    textMuted: '#94a3b8',
    accent: '#38bdf8',
    accentSecondary: '#f43f5e',
    success: '#34d399',
  },
  'cyber-light': {
    background: '#f1f5f9',
    cardBg: '#ffffff',
    cardBorder: '#cbd5e1',
    textMain: '#0284c7',
    textMuted: '#64748b',
    accent: '#0284c7',
    accentSecondary: '#e11d48',
    success: '#059669',
  },
};

export function getThemeTokens(mode: ThemeMode = 'zen'): ThemeTokens {
  return THEME_TOKENS[mode] || THEME_TOKENS.zen;
}
