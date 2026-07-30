import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Loading, Empty & Error States (Issue #136 / #061)', () => {
  it('StateViews component file exists and exports components', () => {
    const filePath = path.resolve(__dirname, '../components/common/StateViews.tsx');
    expect(fs.existsSync(filePath)).toBe(true);

    const code = fs.readFileSync(filePath, 'utf-8');
    expect(code).toContain('export function LoadingSkeleton');
    expect(code).toContain('export function EmptyState');
    expect(code).toContain('export function ErrorBanner');
  });
});
