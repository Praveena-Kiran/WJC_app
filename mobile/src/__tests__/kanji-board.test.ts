import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
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

  it('implements scroll lock mechanisms in Screen, KanjiDrawingCanvas, and KanjiBoard', () => {
    const screenPath = path.resolve(__dirname, '../components/ui/Screen.tsx');
    const screenCode = fs.readFileSync(screenPath, 'utf-8');
    expect(screenCode).toContain('scrollEnabled = true');
    expect(screenCode).toContain('scrollEnabled={scrollEnabled}');

    const canvasPath = path.resolve(__dirname, '../components/drawing/KanjiDrawingCanvas.tsx');
    const canvasCode = fs.readFileSync(canvasPath, 'utf-8');
    expect(canvasCode).toContain('onDrawingStart?: () => void');
    expect(canvasCode).toContain('onDrawingEnd?: () => void');
    expect(canvasCode).toContain('onPanResponderTerminationRequest: () => false');
    expect(canvasCode).toContain('onStartShouldSetPanResponderCapture: () => true');
    expect(canvasCode).toContain('onMoveShouldSetPanResponderCapture: () => true');

    const boardPath = path.resolve(__dirname, '../components/KanjiBoard.tsx');
    const boardCode = fs.readFileSync(boardPath, 'utf-8');
    expect(boardCode).toContain('scrollEnabled={!isDrawing}');
    expect(boardCode).toContain('onDrawingStart={() => setIsDrawing(true)}');
    expect(boardCode).toContain('onDrawingEnd={() => setIsDrawing(false)}');
  });
});
