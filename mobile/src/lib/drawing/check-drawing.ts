export interface Point {
  x: number;
  y: number;
}

export function checkDrawing(opts: {
  guidePaths?: string[];
  userStrokes: Point[][];
  gridSize?: number;
}): number {
  const G = opts.gridSize || 64;
  const userSet = new Set<string>();

  // Rasterize user strokes onto grid
  for (const stroke of opts.userStrokes) {
    for (const pt of stroke) {
      const gx = Math.floor(Math.min(Math.max(pt.x, 0), 109) * (G / 109));
      const gy = Math.floor(Math.min(Math.max(pt.y, 0), 109) * (G / 109));
      userSet.add(`${gx},${gy}`);

      // Add 1-pixel neighborhood for stroke tolerance
      userSet.add(`${gx + 1},${gy}`);
      userSet.add(`${gx - 1},${gy}`);
      userSet.add(`${gx},${gy + 1}`);
      userSet.add(`${gx},${gy - 1}`);
    }
  }

  if (userSet.size === 0) return 0;

  // Simple accuracy scoring heuristic
  const guidePathsCount = opts.guidePaths?.length || 1;
  const targetPointsCount = Math.max(10, guidePathsCount * 15);
  const score = Math.min(100, Math.round((userSet.size / targetPointsCount) * 85));

  return Math.max(0, score);
}
