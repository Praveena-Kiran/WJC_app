import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Dashboard Dispatcher (Issue #162 / #029)', () => {
  it('app/(tabs)/index.tsx imports and dispatches all 4 dashboards based on role & mode', () => {
    const filePath = path.resolve(__dirname, '../../app/(tabs)/index.tsx');
    expect(fs.existsSync(filePath)).toBe(true);

    const code = fs.readFileSync(filePath, 'utf-8');
    expect(code).toContain('ZenDashboard');
    expect(code).toContain('CyberZenDashboard');
    expect(code).toContain('WoxsenStudentDashboard');
    expect(code).toContain('TeacherDashboard');
  });
});
