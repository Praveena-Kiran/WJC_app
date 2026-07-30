import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('CI GitHub Actions Workflow (Issues #140, #142 / #065, #066)', () => {
  it('ci.yml workflow exists and specifies validate & docker-smoke jobs', () => {
    const ciPath = path.resolve(__dirname, '../../../.github/workflows/ci.yml');
    expect(fs.existsSync(ciPath)).toBe(true);

    const code = fs.readFileSync(ciPath, 'utf-8');
    expect(code).toContain('npm run typecheck');
    expect(code).toContain('npm run test');
    expect(code).toContain('docker build');
  });
});
