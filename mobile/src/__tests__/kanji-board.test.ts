import { describe, it, expect } from 'vitest';
import { KANJI_DATA } from '../components/kanji-data';

describe('KanjiBoard & Kanji Drawing Module (Issues #155, #156, #172)', () => {
  it('exports N5 and N4 kanji datasets', () => {
    expect(Array.isArray(KANJI_DATA)).toBe(true);
    expect(KANJI_DATA.length).toBeGreaterThan(0);

    const n5 = KANJI_DATA.filter((k) => k.level === 'N5');
    const n4 = KANJI_DATA.filter((k) => k.level === 'N4');

    expect(n5.length).toBeGreaterThan(0);
    expect(n4.length).toBeGreaterThan(0);
  });
});
