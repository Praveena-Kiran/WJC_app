import { describe, it, expect } from 'vitest';
import { getThemeTokens } from '../theme/tokens';
import * as fs from 'fs';
import * as path from 'path';

describe('Theme Tokens System (Issue #147 / #016)', () => {
  it('provides tokens for light and dark modes', () => {
    const light = getThemeTokens('light');
    const dark = getThemeTokens('dark');

    expect(light.background).toBe('#FAF9F6');
    expect(dark.background).toBe('#131211');
    expect(light.accent).toBe('#C13B22');
    expect(dark.accent).toBe('#E0603F');
  });

  it('ensures ThemeContext provides context unconditionally to prevent unmounted provider errors', () => {
    const themeContextPath = path.resolve(__dirname, '../theme/ThemeContext.tsx');
    expect(fs.existsSync(themeContextPath)).toBe(true);

    const code = fs.readFileSync(themeContextPath, 'utf-8');
    expect(code).toContain('export function ThemeProvider');
    expect(code).toContain('export function useTheme');
    expect(code).toContain('if (!ctx) throw new Error');
    // Ensure early return without provider was removed
    expect(code).not.toContain('if (!loaded)');
    expect(code).toContain('<ThemeContext.Provider value={value}>');
  });
});


