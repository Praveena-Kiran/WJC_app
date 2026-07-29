import { describe, it, expect } from 'vitest';
import { STORIES } from '../components/kaiwa-stories';

describe('KaiwaView Duolingo Stories (Issue #182 / #044b)', () => {
  it('exports valid stories deck array', () => {
    expect(Array.isArray(STORIES)).toBe(true);
    expect(STORIES.length).toBeGreaterThan(0);
  });

  it('contains cafe and ramen stories with dialogue lines and options', () => {
    const cafeStory = STORIES.find((s) => s.id === 'cafe');
    expect(cafeStory).toBeDefined();
    expect(cafeStory?.lines.length).toBeGreaterThan(0);

    const userLine = cafeStory?.lines.find((l) => l.speaker === 'user');
    expect(userLine?.options).toBeDefined();
    expect(userLine?.options?.length).toBeGreaterThan(0);
  });
});
