import { describe, it, expect } from 'vitest';
import { getThemeTokens, THEME_TOKENS } from '../theme/tokens';

describe('Theme Tokens System (Issue #147 / #016)', () => {
  it('provides tokens for zen, cyber-dark, and cyber-light modes', () => {
    const zen = getThemeTokens('zen');
    const dark = getThemeTokens('cyber-dark');
    const light = getThemeTokens('cyber-light');

    expect(zen.background).toBe('#f8fafc');
    expect(dark.background).toBe('#0f172a');
    expect(light.background).toBe('#f1f5f9');
  });
});
