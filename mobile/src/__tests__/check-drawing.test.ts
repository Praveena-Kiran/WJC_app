import { describe, it, expect } from 'vitest';
import { checkDrawing } from '../lib/drawing/check-drawing';

describe('checkDrawing() accuracy calculation (Issue #156 / #023)', () => {
  it('returns 0 for empty user strokes', () => {
    const score = checkDrawing({ userStrokes: [] });
    expect(score).toBe(0);
  });

  it('returns >0 score when user draws strokes', () => {
    const userStrokes = [
      [
        { x: 10, y: 54 },
        { x: 50, y: 54 },
        { x: 100, y: 54 },
      ],
    ];
    const score = checkDrawing({ guidePaths: ['M10,54 L100,54'], userStrokes });
    expect(score).toBeGreaterThan(0);
  });
});
