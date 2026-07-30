import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('CyberZenDashboard (Issue #159 / #026)', () => {
  it('CyberZenDashboard component file exists and exports CyberZenDashboard', () => {
    const filePath = path.resolve(__dirname, '../components/dashboard/CyberZenDashboard.tsx');
    expect(fs.existsSync(filePath)).toBe(true);

    const code = fs.readFileSync(filePath, 'utf-8');
    expect(code).toContain('export function CyberZenDashboard');
    expect(code).toContain('CYBER ZEN SYSTEM');
  });
});
