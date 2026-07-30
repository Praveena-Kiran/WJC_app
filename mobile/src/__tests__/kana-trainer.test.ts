import { describe, it, expect } from 'vitest';
import { KANA_DATA } from '../components/kana/kana-data';

describe('KanaTrainer & Kana Module (Issues #165, #166, #167)', () => {
  it('exports valid hiragana and katakana dataset', () => {
    expect(Array.isArray(KANA_DATA)).toBe(true);
    expect(KANA_DATA.length).toBeGreaterThan(0);

    const hiragana = KANA_DATA.filter((k) => k.type === 'hiragana');
    const katakana = KANA_DATA.filter((k) => k.type === 'katakana');

    expect(hiragana.length).toBeGreaterThan(0);
    expect(katakana.length).toBeGreaterThan(0);
  });
});
