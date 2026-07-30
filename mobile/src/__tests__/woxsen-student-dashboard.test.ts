import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('WoxsenStudentDashboard (Issue #160 / #027)', () => {
  it('WoxsenStudentDashboard component file exists and exports WoxsenStudentDashboard', () => {
    const filePath = path.resolve(__dirname, '../components/dashboard/WoxsenStudentDashboard.tsx');
    expect(fs.existsSync(filePath)).toBe(true);

    const code = fs.readFileSync(filePath, 'utf-8');
    expect(code).toContain('export function WoxsenStudentDashboard');
    expect(code).toContain('Woxsen University Portal');
  });
});
