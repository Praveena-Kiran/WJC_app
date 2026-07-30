import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('ZenDashboard (Issue #158 / #025)', () => {
  it('ZenDashboard component file exists and exports ZenDashboard', () => {
    const filePath = path.resolve(__dirname, '../components/dashboard/ZenDashboard.tsx');
    expect(fs.existsSync(filePath)).toBe(true);

    const code = fs.readFileSync(filePath, 'utf-8');
    expect(code).toContain('export function ZenDashboard');
    expect(code).toContain('Zen Student Dashboard');
  });
});
