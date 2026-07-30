import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Splash Gate & Root Layout (Issue #154 / #033b)', () => {
  it('implements isAuthResolving splash gate in app/_layout.tsx', () => {
    const layoutPath = path.resolve(__dirname, '../../app/_layout.tsx');
    expect(fs.existsSync(layoutPath)).toBe(true);

    const code = fs.readFileSync(layoutPath, 'utf-8');
    expect(code).toContain('isAuthResolving');
    expect(code).toContain('SplashScreen.preventAutoHideAsync()');
    expect(code).toContain('SplashScreen.hideAsync()');
    expect(code).toContain('if (!loaded || isAuthResolving)');
  });
});
