import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('PronunciationCoach (Issue #126 / #045)', () => {
  it('PronunciationCoach component and route exist and contain exports', () => {
    const componentPath = path.resolve(__dirname, '../components/PronunciationCoach.tsx');
    const routePath = path.resolve(__dirname, '../../app/more/pronunciation.tsx');

    expect(fs.existsSync(componentPath)).toBe(true);
    expect(fs.existsSync(routePath)).toBe(true);

    const code = fs.readFileSync(componentPath, 'utf-8');
    expect(code).toContain('export function PronunciationCoach');
    expect(code).toContain('Pronunciation & Pitch Coach');
  });
});
