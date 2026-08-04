export type ThemeName = 'light' | 'dark';

export interface ThemeTokens {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
  accentMuted: string;
  onAccent: string;
  success: string;
  successMuted: string;
  warning: string;
  warningMuted: string;
  error: string;
  errorMuted: string;
}

export const THEME_TOKENS: Record<ThemeName, ThemeTokens> = {
  light: {
    background: '#FAF9F6',
    surface: '#FFFFFF',
    surfaceAlt: '#F1EFEA',
    border: '#E6E3DC',
    text: '#1C1B18',
    textMuted: '#73706A',
    accent: '#C13B22',
    accentMuted: 'rgba(193,59,34,0.08)',
    onAccent: '#FFFFFF',
    success: '#3E7A4E',
    successMuted: 'rgba(62,122,78,0.10)',
    warning: '#A8761F',
    warningMuted: 'rgba(168,118,31,0.10)',
    error: '#A02B21',
    errorMuted: 'rgba(160,43,33,0.08)',
  },
  dark: {
    background: '#131211',
    surface: '#1D1C1A',
    surfaceAlt: '#262422',
    border: '#33302B',
    text: '#F0EDE7',
    textMuted: '#A09A90',
    accent: '#E0603F',
    accentMuted: 'rgba(224,96,63,0.16)',
    onAccent: '#131211',
    success: '#7FA98C',
    successMuted: 'rgba(127,169,140,0.14)',
    warning: '#C9A45C',
    warningMuted: 'rgba(201,164,92,0.14)',
    error: '#D4726A',
    errorMuted: 'rgba(212,114,106,0.14)',
  },
};

export function getThemeTokens(name: ThemeName = 'light'): ThemeTokens {
  return THEME_TOKENS[name] ?? THEME_TOKENS.light;
}

export const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, xxxxl: 48 } as const;

export const RADIUS = { sm: 8, md: 12, lg: 16, xl: 24, full: 999 } as const;

export const TYPE = {
  caption: { fontSize: 12, fontWeight: '500' as const },
  body: { fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontSize: 15, fontWeight: '600' as const },
  title: { fontSize: 20, fontWeight: '700' as const },
  display: { fontSize: 28, fontWeight: '700' as const },
  glyph: { fontSize: 48, fontWeight: '700' as const },
} as const;

export const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 6,
  elevation: 1,
} as const;
