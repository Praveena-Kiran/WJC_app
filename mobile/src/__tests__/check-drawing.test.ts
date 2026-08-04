import { describe, it, expect } from 'vitest';
import { checkDrawing, Point } from '../lib/drawing/check-drawing';

function makeLine(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  denseness = 50,
): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i <= denseness; i++) {
    const t = i / denseness;
    pts.push({
      x: x0 + (x1 - x0) * t,
      y: y0 + (y1 - y0) * t,
    });
  }
  return pts;
}

const ICHI_STROKE = ['M10,54 L100,54'];

describe('checkDrawing() accuracy calculation', () => {
  it('returns 0 for empty user strokes', () => {
    expect(checkDrawing({ guidePaths: ICHI_STROKE, userStrokes: [] })).toBe(0);
  });

  it('returns 0 for empty guide paths', () => {
    const strokes = [makeLine(10, 54, 100, 54)];
    expect(checkDrawing({ guidePaths: [], userStrokes: strokes })).toBe(0);
  });

  it('returns 0 for undefined guide paths with user strokes', () => {
    const strokes = [makeLine(10, 54, 100, 54)];
    expect(checkDrawing({ userStrokes: strokes })).toBe(0);
  });

  it('scores >= 85% for exact horizontal match (一)', () => {
    const accurate = [makeLine(10, 54, 100, 54)];
    const score = checkDrawing({ guidePaths: ICHI_STROKE, userStrokes: accurate });
    expect(score).toBeGreaterThanOrEqual(85);
  });

  it('scores <= 10% for vertical stroke when guide is horizontal', () => {
    const vertical = [makeLine(54, 10, 54, 100)];
    const score = checkDrawing({ guidePaths: ICHI_STROKE, userStrokes: vertical });
    expect(score).toBeLessThanOrEqual(10);
  });

  it('scores < 30% for diagonal stroke when guide is horizontal', () => {
    const diagonal = [makeLine(10, 10, 100, 100)];
    const score = checkDrawing({ guidePaths: ICHI_STROKE, userStrokes: diagonal });
    expect(score).toBeLessThan(30);
  });

  it('handles multi-stroke kanji (二)', () => {
    const ni = ['M25,35 L85,35', 'M10,75 L100,75'];
    const accurate = [
      makeLine(25, 35, 85, 35),
      makeLine(10, 75, 100, 75),
    ];
    const score = checkDrawing({ guidePaths: ni, userStrokes: accurate });
    expect(score).toBeGreaterThanOrEqual(85);
  });

  it('handles multi-stroke kanji (三)', () => {
    const san = ['M25,25 L85,25', 'M30,54 L80,54', 'M10,85 L100,85'];
    const accurate = [
      makeLine(25, 25, 85, 25),
      makeLine(30, 54, 80, 54),
      makeLine(10, 85, 100, 85),
    ];
    const score = checkDrawing({ guidePaths: san, userStrokes: accurate });
    expect(score).toBeGreaterThanOrEqual(85);
  });

  it('single-point stroke still gets some score if near guide', () => {
    const singlePoint = [[{ x: 55, y: 54 }]];
    const score = checkDrawing({ guidePaths: ICHI_STROKE, userStrokes: singlePoint });
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(50);
  });

  it('tolerance parameter: higher tolerance yields higher scores', () => {
    const offSlightly = [makeLine(10, 58, 100, 58)];
    const strict = checkDrawing({
      guidePaths: ICHI_STROKE,
      userStrokes: offSlightly,
      tolerance: 0,
    });
    const forgiving = checkDrawing({
      guidePaths: ICHI_STROKE,
      userStrokes: offSlightly,
      tolerance: 3,
    });
    expect(forgiving).toBeGreaterThan(strict);
  });

  it('scores higher with more samples per path', () => {
    const accurate = [makeLine(10, 54, 100, 54)];
    const lowSamples = checkDrawing({
      guidePaths: ICHI_STROKE,
      userStrokes: accurate,
      samplesPerPath: 10,
    });
    const highSamples = checkDrawing({
      guidePaths: ICHI_STROKE,
      userStrokes: accurate,
      samplesPerPath: 200,
    });
    expect(highSamples).toBeGreaterThanOrEqual(lowSamples);
  });

  it('handles 100x100 viewBox (kana) correctly', () => {
    const kanaGuide = ['M31,33 C31.88,33.88 33.75,34.82 36.26,34.75'];
    const accurate = [makeLine(31, 33, 37, 34)];
    const score = checkDrawing({
      guidePaths: kanaGuide,
      userStrokes: accurate,
      viewBox: 100,
    });
    expect(score).toBeGreaterThan(0);
  });

  it('defaults to 109 viewBox', () => {
    const accurate = [makeLine(10, 54, 100, 54)];
    const score = checkDrawing({ guidePaths: ICHI_STROKE, userStrokes: accurate });
    expect(score).toBeGreaterThanOrEqual(85);
  });

  it('handles empty strokes within a non-empty array', () => {
    const strokes: Point[][] = [[], makeLine(10, 54, 100, 54), []];
    const score = checkDrawing({ guidePaths: ICHI_STROKE, userStrokes: strokes });
    expect(score).toBeGreaterThanOrEqual(85);
  });

  it('handles malformed SVG path gracefully', () => {
    const score = checkDrawing({
      guidePaths: ['MZZZ,XXX LFOO,BAR'],
      userStrokes: [makeLine(10, 54, 100, 54)],
    });
    expect(score).toBe(0);
  });

  it('handles fast sparse strokes (few points)', () => {
    const sparse = [[{ x: 10, y: 54 }, { x: 100, y: 54 }]];
    const score = checkDrawing({ guidePaths: ICHI_STROKE, userStrokes: sparse });
    expect(score).toBeGreaterThanOrEqual(70);
  });

  it('accuracy decreases meaningfully with partial coverage', () => {
    const fullScore = checkDrawing({
      guidePaths: ICHI_STROKE,
      userStrokes: [makeLine(10, 54, 100, 54)],
    });
    const partialScore = checkDrawing({
      guidePaths: ICHI_STROKE,
      userStrokes: [makeLine(50, 54, 100, 54)],
    });
    expect(fullScore).toBeGreaterThan(partialScore);
  });

  it('works with curved SVG paths (cubic bezier)', () => {
    const curveGuide = ['M20,50 C30,20 70,80 80,50'];
    const tracing: Point[] = [];
    const samples = 100;
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const x = 20 * Math.pow(1 - t, 3) + 3 * 30 * t * Math.pow(1 - t, 2) + 3 * 70 * Math.pow(t, 2) * (1 - t) + 80 * Math.pow(t, 3);
      const y = 50 * Math.pow(1 - t, 3) + 3 * 20 * t * Math.pow(1 - t, 2) + 3 * 80 * Math.pow(t, 2) * (1 - t) + 50 * Math.pow(t, 3);
      tracing.push({ x, y });
    }
    const score = checkDrawing({ guidePaths: curveGuide, userStrokes: [tracing] });
    expect(score).toBeGreaterThanOrEqual(80);
  });

  it('score is always between 0 and 100', () => {
    const cases = [
      { guidePaths: ICHI_STROKE, userStrokes: [makeLine(10, 54, 100, 54)] },
      { guidePaths: undefined, userStrokes: [] as Point[][] },
      { guidePaths: [], userStrokes: [] as Point[][] },
      { guidePaths: ICHI_STROKE, userStrokes: [makeLine(54, 10, 54, 100)] },
    ];
    for (const c of cases) {
      const s = checkDrawing(c);
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(100);
    }
  });
});
