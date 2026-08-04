export interface Point {
  x: number;
  y: number;
}

function parseSvgPath(d: string): { type: string; values: number[] }[] {
  const commands: { type: string; values: number[] }[] = [];
  const cmdRe = /([MLHVCSQTAZmlhvcsqtaz])([^MLHVCSQTAZmlhvcsqtaz]*)/g;
  let match;
  while ((match = cmdRe.exec(d)) !== null) {
    const cmd = match[1];
    const numbers = match[2]
      .trim()
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(Number);
    commands.push({ type: cmd, values: numbers });
  }
  return commands;
}

interface Segment {
  points: [Point, Point] | [Point, Point, Point, Point];
  length: number;
  cumulative: number;
}

function samplePath(d: string, numSamples: number): Point[] {
  const commands = parseSvgPath(d);
  if (commands.length === 0) return [];

  const segments: Segment[] = [];
  let prevX = 0;
  let prevY = 0;
  let totalLength = 0;

  for (const cmd of commands) {
    const vals = cmd.values;
    let i = 0;

    switch (cmd.type) {
      case 'M': {
        prevX = vals[0];
        prevY = vals[1];
        i = 2;
        while (i < vals.length) {
          prevX = vals[i];
          prevY = vals[i + 1];
          i += 2;
        }
        break;
      }
      case 'm': {
        prevX += vals[0];
        prevY += vals[1];
        i = 2;
        while (i < vals.length) {
          prevX += vals[i];
          prevY += vals[i + 1];
          i += 2;
        }
        break;
      }
      case 'L': {
        while (i < vals.length) {
          const x1 = vals[i];
          const y1 = vals[i + 1];
          const segLen = dist(prevX, prevY, x1, y1);
          totalLength += segLen;
          segments.push({
            points: [{ x: prevX, y: prevY }, { x: x1, y: y1 }],
            length: segLen,
            cumulative: totalLength,
          });
          prevX = x1;
          prevY = y1;
          i += 2;
        }
        break;
      }
      case 'l': {
        while (i < vals.length) {
          const x1 = prevX + vals[i];
          const y1 = prevY + vals[i + 1];
          const segLen = dist(prevX, prevY, x1, y1);
          totalLength += segLen;
          segments.push({
            points: [{ x: prevX, y: prevY }, { x: x1, y: y1 }],
            length: segLen,
            cumulative: totalLength,
          });
          prevX = x1;
          prevY = y1;
          i += 2;
        }
        break;
      }
      case 'H': {
        while (i < vals.length) {
          const x1 = vals[i];
          const segLen = dist(prevX, prevY, x1, prevY);
          totalLength += segLen;
          segments.push({
            points: [{ x: prevX, y: prevY }, { x: x1, y: prevY }],
            length: segLen,
            cumulative: totalLength,
          });
          prevX = x1;
          i++;
        }
        break;
      }
      case 'h': {
        while (i < vals.length) {
          const x1 = prevX + vals[i];
          const segLen = dist(prevX, prevY, x1, prevY);
          totalLength += segLen;
          segments.push({
            points: [{ x: prevX, y: prevY }, { x: x1, y: prevY }],
            length: segLen,
            cumulative: totalLength,
          });
          prevX = x1;
          i++;
        }
        break;
      }
      case 'V': {
        while (i < vals.length) {
          const y1 = vals[i];
          const segLen = dist(prevX, prevY, prevX, y1);
          totalLength += segLen;
          segments.push({
            points: [{ x: prevX, y: prevY }, { x: prevX, y: y1 }],
            length: segLen,
            cumulative: totalLength,
          });
          prevY = y1;
          i++;
        }
        break;
      }
      case 'v': {
        while (i < vals.length) {
          const y1 = prevY + vals[i];
          const segLen = dist(prevX, prevY, prevX, y1);
          totalLength += segLen;
          segments.push({
            points: [{ x: prevX, y: prevY }, { x: prevX, y: y1 }],
            length: segLen,
            cumulative: totalLength,
          });
          prevY = y1;
          i++;
        }
        break;
      }
      case 'C': {
        while (i < vals.length) {
          const cp1x = vals[i];
          const cp1y = vals[i + 1];
          const cp2x = vals[i + 2];
          const cp2y = vals[i + 3];
          const x1 = vals[i + 4];
          const y1 = vals[i + 5];
          const segLen = approximateCubicLength(
            prevX, prevY, cp1x, cp1y, cp2x, cp2y, x1, y1,
          );
          totalLength += segLen;
          segments.push({
            points: [
              { x: prevX, y: prevY },
              { x: cp1x, y: cp1y },
              { x: cp2x, y: cp2y },
              { x: x1, y: y1 },
            ],
            length: segLen,
            cumulative: totalLength,
          });
          prevX = x1;
          prevY = y1;
          i += 6;
        }
        break;
      }
      case 'c': {
        while (i < vals.length) {
          const cp1x = prevX + vals[i];
          const cp1y = prevY + vals[i + 1];
          const cp2x = prevX + vals[i + 2];
          const cp2y = prevY + vals[i + 3];
          const x1 = prevX + vals[i + 4];
          const y1 = prevY + vals[i + 5];
          const segLen = approximateCubicLength(
            prevX, prevY, cp1x, cp1y, cp2x, cp2y, x1, y1,
          );
          totalLength += segLen;
          segments.push({
            points: [
              { x: prevX, y: prevY },
              { x: cp1x, y: cp1y },
              { x: cp2x, y: cp2y },
              { x: x1, y: y1 },
            ],
            length: segLen,
            cumulative: totalLength,
          });
          prevX = x1;
          prevY = y1;
          i += 6;
        }
        break;
      }
      case 'Z':
      case 'z':
        break;
      default:
        break;
    }
  }

  if (totalLength === 0) return [];

  const samples: Point[] = [];
  for (let s = 0; s <= numSamples; s++) {
    const targetDist = (s / numSamples) * totalLength;
    samples.push(pointAtDistance(segments, targetDist));
  }
  return samples;
}

function pointAtDistance(segments: Segment[], distance: number): Point {
  for (const seg of segments) {
    if (distance <= seg.cumulative || seg === segments[segments.length - 1]) {
      const segStart = seg.cumulative - seg.length;
      const t = seg.length > 0 ? (distance - segStart) / seg.length : 0;
      const clampedT = Math.max(0, Math.min(1, t));
      return interpolateSegment(seg.points, clampedT);
    }
  }
  const last = segments[segments.length - 1];
  const pts = last.points;
  return pts[pts.length - 1];
}

function interpolateSegment(
  pts: [Point, Point] | [Point, Point, Point, Point],
  t: number,
): Point {
  if (pts.length === 2) {
    return {
      x: pts[0].x + t * (pts[1].x - pts[0].x),
      y: pts[0].y + t * (pts[1].y - pts[0].y),
    };
  }
  const mt = 1 - t;
  return {
    x: mt * mt * mt * pts[0].x + 3 * mt * mt * t * pts[1].x + 3 * mt * t * t * pts[2].x + t * t * t * pts[3].x,
    y: mt * mt * mt * pts[0].y + 3 * mt * mt * t * pts[1].y + 3 * mt * t * t * pts[2].y + t * t * t * pts[3].y,
  };
}

function approximateCubicLength(
  x0: number, y0: number,
  x1: number, y1: number,
  x2: number, y2: number,
  x3: number, y3: number,
): number {
  let len = 0;
  let px = x0;
  let py = y0;
  const steps = 20;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const mt = 1 - t;
    const cx = mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3;
    const cy = mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3;
    len += dist(px, py, cx, cy);
    px = cx;
    py = cy;
  }
  return len;
}

function dist(x0: number, y0: number, x1: number, y1: number): number {
  return Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2);
}

function markCell(
  x: number,
  y: number,
  grid: number,
  viewBox: number,
  set: Set<string>,
  tolerance: number,
): void {
  const gx = Math.floor((x / viewBox) * grid);
  const gy = Math.floor((y / viewBox) * grid);
  for (let dx = -tolerance; dx <= tolerance; dx++) {
    for (let dy = -tolerance; dy <= tolerance; dy++) {
      set.add(`${gx + dx},${gy + dy}`);
    }
  }
}

function bresenham(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  grid: number,
  viewBox: number,
  set: Set<string>,
  tolerance: number,
): void {
  const gx0 = Math.floor((x0 / viewBox) * grid);
  const gy0 = Math.floor((y0 / viewBox) * grid);
  const gx1 = Math.floor((x1 / viewBox) * grid);
  const gy1 = Math.floor((y1 / viewBox) * grid);

  const dx = Math.abs(gx1 - gx0);
  const dy = Math.abs(gy1 - gy0);
  const sx = gx0 < gx1 ? 1 : -1;
  const sy = gy0 < gy1 ? 1 : -1;
  let err = dx - dy;
  let cx = gx0;
  let cy = gy0;

  for (;;) {
    for (let tx = -tolerance; tx <= tolerance; tx++) {
      for (let ty = -tolerance; ty <= tolerance; ty++) {
        set.add(`${cx + tx},${cy + ty}`);
      }
    }
    if (cx === gx1 && cy === gy1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      cx += sx;
    }
    if (e2 < dx) {
      err += dx;
      cy += sy;
    }
  }
}

export function checkDrawing(opts: {
  guidePaths?: string[];
  userStrokes: Point[][];
  gridSize?: number;
  samplesPerPath?: number;
  tolerance?: number;
  viewBox?: number;
}): number {
  const G = opts.gridSize ?? 64;
  const samples = opts.samplesPerPath ?? 200;
  const tolerance = opts.tolerance ?? 2;
  const VB = opts.viewBox ?? 109;

  const refSet = new Set<string>();

  for (const d of opts.guidePaths ?? []) {
    const sampled = samplePath(d, samples);
    for (const pt of sampled) {
      markCell(pt.x, pt.y, G, VB, refSet, tolerance);
    }
  }

  if (refSet.size === 0) return 0;

  const userSet = new Set<string>();

  for (const stroke of opts.userStrokes) {
    if (stroke.length === 0) continue;
    if (stroke.length === 1) {
      markCell(stroke[0].x, stroke[0].y, G, VB, userSet, tolerance);
    } else {
      for (let i = 1; i < stroke.length; i++) {
        const p0 = stroke[i - 1];
        const p1 = stroke[i];
        bresenham(p0.x, p0.y, p1.x, p1.y, G, VB, userSet, tolerance);
      }
    }
  }

  if (userSet.size === 0) return 0;

  let overlap = 0;
  for (const key of refSet) {
    if (userSet.has(key)) overlap++;
  }

  return Math.round((overlap / refSet.size) * 100);
}
