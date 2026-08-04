import { describe, it, expect } from 'vitest';
import { getThemeTokens, THEME_TOKENS } from '../theme/tokens';

describe('Theme Tokens System (Issue #147 / #016)', () => {
  it('provides tokens for light and dark modes', () => {
    const light = getThemeTokens('light');
    const dark = getThemeTokens('dark');

    expect(light.background).toBe('#FAF9F6');
    expect(dark.background).toBe('#131211');
    expect(light.accent).toBe('#C13B22');
    expect(dark.accent).toBe('#E0603F');
  });
});
