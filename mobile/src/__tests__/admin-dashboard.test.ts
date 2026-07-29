import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('AdminDashboard Component (Issue #180 / #028b)', () => {
  it('AdminDashboard component file and route exist and contain expected exports', () => {
    const componentPath = path.resolve(__dirname, '../components/dashboard/AdminDashboard.tsx');
    const routePath = path.resolve(__dirname, '../../app/more/admin.tsx');

    expect(fs.existsSync(componentPath)).toBe(true);
    expect(fs.existsSync(routePath)).toBe(true);

    const code = fs.readFileSync(componentPath, 'utf-8');
    expect(code).toContain('export function AdminDashboard');
    expect(code).toContain('Super Admin Portal');
  });
});
