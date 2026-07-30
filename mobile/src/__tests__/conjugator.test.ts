import { describe, it, expect } from 'vitest';
import { conjugateVerb } from '../lib/conjugator';

describe('conjugateVerb() pure TS utility (Issue #171 / #039)', () => {
  it('conjugates ru-verb (Ichidan): 食べる', () => {
    const res = conjugateVerb({ word: '食べる', reading: 'たべる', type: 'ru' });
    expect(res).not.toBeNull();
    expect(res?.polite).toContain('食べます');
    expect(res?.negative).toContain('食べない');
    expect(res?.past).toContain('食べた');
    expect(res?.te).toContain('食べて');
  });

  it('conjugates u-verb ending in む (Godan): 飲む', () => {
    const res = conjugateVerb({ word: '飲む', reading: 'のむ', type: 'u' });
    expect(res).not.toBeNull();
    expect(res?.polite).toContain('飲みます');
    expect(res?.negative).toContain('飲まない');
    expect(res?.past).toContain('飲んだ');
    expect(res?.te).toContain('飲んで');
  });

  it('conjugates irregular verb: 来る', () => {
    const res = conjugateVerb({ word: '来る', reading: 'くる', type: 'irr' });
    expect(res).not.toBeNull();
    expect(res?.polite).toContain('来ます');
    expect(res?.negative).toContain('来ない');
    expect(res?.past).toContain('来た');
    expect(res?.te).toContain('来て');
  });

  it('conjugates irregular verb: する', () => {
    const res = conjugateVerb({ word: 'する', reading: 'する', type: 'irr' });
    expect(res).not.toBeNull();
    expect(res?.polite).toBe('します');
    expect(res?.negative).toBe('しない');
    expect(res?.past).toBe('した');
    expect(res?.te).toBe('して');
  });

  it('conjugates special u-verb case: 行く', () => {
    const res = conjugateVerb({ word: '行く', reading: 'いく', type: 'u' });
    expect(res).not.toBeNull();
    expect(res?.past).toContain('行った');
    expect(res?.te).toContain('行って');
  });

  it('conjugates u-verb ending in う: 買う', () => {
    const res = conjugateVerb({ word: '買う', reading: 'かう', type: 'u' });
    expect(res).not.toBeNull();
    expect(res?.polite).toContain('買います');
    expect(res?.negative).toContain('買わない');
    expect(res?.past).toContain('買った');
    expect(res?.te).toContain('買って');
  });

  it('conjugates u-verb ending in む: 読む', () => {
    const res = conjugateVerb({ word: '読む', reading: 'よむ', type: 'u' });
    expect(res).not.toBeNull();
    expect(res?.polite).toContain('読みます');
    expect(res?.negative).toContain('読まない');
    expect(res?.past).toContain('読んだ');
    expect(res?.te).toContain('読んで');
  });

  it('conjugates u-verb ending in す: 話す', () => {
    const res = conjugateVerb({ word: '話す', reading: 'はなす', type: 'u' });
    expect(res).not.toBeNull();
    expect(res?.polite).toContain('話します');
    expect(res?.negative).toContain('話さない');
    expect(res?.past).toContain('話した');
    expect(res?.te).toContain('話して');
  });
});
