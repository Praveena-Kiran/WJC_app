import { describe, it, expect } from 'vitest';
import { PUZZLES } from '../components/radical-data';

describe('KanjiRadicalView (Issue #127 / #046)', () => {
  it('exports radical puzzle dataset', () => {
    expect(Array.isArray(PUZZLES)).toBe(true);
    expect(PUZZLES.length).toBeGreaterThan(0);
  });

  it('contains valid targetKanji, meaning, and radicals', () => {
    const p1 = PUZZLES[0];
    expect(p1.targetKanji).toBe('休');
    expect(p1.meaning).toBe('Rest');
    expect(p1.radicals).toContain('亻');
    expect(p1.radicals).toContain('木');
  });
});
