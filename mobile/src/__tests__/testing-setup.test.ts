import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Testing Framework Setup (Issue #141 / #065b)', () => {
  it('vitest.config.ts exists and specifies test runner config', () => {
    const configPath = path.resolve(__dirname, '../../vitest.config.ts');
    expect(fs.existsSync(configPath)).toBe(true);

    const code = fs.readFileSync(configPath, 'utf-8');
    expect(code).toContain('defineConfig');
    expect(code).toContain('globals: true');
  });
});
