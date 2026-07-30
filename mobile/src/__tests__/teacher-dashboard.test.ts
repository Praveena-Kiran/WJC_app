import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('TeacherDashboard (Issue #161 / #028)', () => {
  it('TeacherDashboard component file exists and exports TeacherDashboard', () => {
    const filePath = path.resolve(__dirname, '../components/dashboard/TeacherDashboard.tsx');
    expect(fs.existsSync(filePath)).toBe(true);

    const code = fs.readFileSync(filePath, 'utf-8');
    expect(code).toContain('export function TeacherDashboard');
    expect(code).toContain('Teacher Portal');
  });
});
