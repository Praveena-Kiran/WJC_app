import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Root Layout Providers & Auth Guard (Issue #148 / #017)', () => {
  it('root _layout.tsx contains PersistQueryClientProvider, ThemeProvider, and Stack screens', () => {
    const layoutPath = path.resolve(__dirname, '../../app/_layout.tsx');
    expect(fs.existsSync(layoutPath)).toBe(true);

    const code = fs.readFileSync(layoutPath, 'utf-8');
    expect(code).toContain('PersistQueryClientProvider');
    expect(code).toContain('ThemeProvider');
    expect(code).toContain('name="(tabs)"');
    expect(code).toContain('name="(auth)"');
  });
});
