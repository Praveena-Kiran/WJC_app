import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme as useSystemScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getThemeTokens, type ThemeName, type ThemeTokens } from './tokens';

export type ThemePreference = 'system' | 'light' | 'dark';

const PREF_KEY = 'zengo_theme_preference';

interface ThemeContextValue {
  theme: ThemeTokens;
  themeName: ThemeName;
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function resolveThemeName(preference: ThemePreference, systemScheme: ThemeName): ThemeName {
  if (preference === 'light' || preference === 'dark') return preference;
  return systemScheme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemScheme() ?? 'light';
  const [preference, setPreferenceRaw] = useState<ThemePreference>('system');

  useEffect(() => {
    AsyncStorage.getItem(PREF_KEY)
      .then((v) => {
        if (v === 'light' || v === 'dark' || v === 'system') {
          setPreferenceRaw(v);
        }
      })
      .catch(() => null);
  }, []);

  const setPreference = useCallback((p: ThemePreference) => {
    setPreferenceRaw(p);
    AsyncStorage.setItem(PREF_KEY, p).catch(() => null);
  }, []);

  const themeName = resolveThemeName(preference, systemScheme as ThemeName);
  const theme = useMemo(() => getThemeTokens(themeName), [themeName]);

  const value = useMemo(
    () => ({ theme, themeName, preference, setPreference }),
    [theme, themeName, preference, setPreference]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
