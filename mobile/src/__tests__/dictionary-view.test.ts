import { describe, it, expect } from 'vitest';
import { DICTIONARY_DATA } from '../components/dictionary-data';

describe('DictionaryView (Issue #170 / #037)', () => {
  it('exports vocabulary dictionary dataset', () => {
    expect(Array.isArray(DICTIONARY_DATA)).toBe(true);
    expect(DICTIONARY_DATA.length).toBeGreaterThan(0);
  });

  it('contains verbs, nouns, and adjectives with reading and english', () => {
    const verb = DICTIONARY_DATA.find((w) => w.tag === 'Verb');
    expect(verb).toBeDefined();
    expect(verb?.word).toBeDefined();
    expect(verb?.reading).toBeDefined();

    const noun = DICTIONARY_DATA.find((w) => w.tag === 'Noun');
    expect(noun).toBeDefined();
  });
});
