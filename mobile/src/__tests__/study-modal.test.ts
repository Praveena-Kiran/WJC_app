import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('StudyModal Component (Issue #169 / #036)', () => {
  it('StudyModal component file exists and exports StudyModal', () => {
    const filePath = path.resolve(__dirname, '../components/kana/StudyModal.tsx');
    expect(fs.existsSync(filePath)).toBe(true);

    const code = fs.readFileSync(filePath, 'utf-8');
    expect(code).toContain('export function StudyModal');
    expect(code).toContain('Finish Lesson');
  });
});
