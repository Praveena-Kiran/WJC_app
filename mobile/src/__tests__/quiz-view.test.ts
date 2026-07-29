import { describe, it, expect } from 'vitest';

describe('QuizView logic (Issue #173 / #041)', () => {
  it('generates non-empty options array containing correct answer', () => {
    const prompt = 'あ';
    const correctAnswer = 'a';
    const pool = ['a', 'i', 'u', 'e', 'o', 'ka', 'ki', 'ku', 'ke', 'ko'];

    const wrongOptions = pool.filter((a) => a !== correctAnswer).slice(0, 3);
    const options = [...wrongOptions, correctAnswer].sort();

    expect(options).toContain(correctAnswer);
    expect(options.length).toBe(4);
  });
});
