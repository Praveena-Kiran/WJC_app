import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('N5PlannerView (Issue #124 / #043)', () => {
  it('N5PlannerView component and route exist and contain exports', () => {
    const componentPath = path.resolve(__dirname, '../components/N5PlannerView.tsx');
    const routePath = path.resolve(__dirname, '../../app/more/planner.tsx');

    expect(fs.existsSync(componentPath)).toBe(true);
    expect(fs.existsSync(routePath)).toBe(true);

    const code = fs.readFileSync(componentPath, 'utf-8');
    expect(code).toContain('export function N5PlannerView');
    expect(code).toContain('N5 Exam & Learning Roadmap');
  });
});
