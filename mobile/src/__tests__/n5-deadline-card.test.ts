import { describe, it, expect } from 'vitest';
import { calculateN5Metrics } from '../components/dashboard/n5-metrics';

describe('calculateN5Metrics (Issue #183)', () => {
  it('calculates readiness percentage and metrics correctly', () => {
    const metrics = calculateN5Metrics('2028-12-31', 5, 46, 50, 10);

    expect(metrics.overallPct).toBe(58);
    expect(metrics.daysLeft).toBeGreaterThan(0);
    expect(metrics.statusLabel).toBe('On Track');
    expect(metrics.status).toBe('on-track');
    expect(metrics.dailyKana).toBeGreaterThanOrEqual(0);
    expect(metrics.dailyKanji).toBeGreaterThanOrEqual(0);
  });

  it('identifies pace boost needed for low readiness and close deadline', () => {
    const metrics = calculateN5Metrics(new Date(Date.now() + 5 * 86400000).toISOString(), 0, 0, 0, 0);

    expect(metrics.overallPct).toBe(5);
    expect(metrics.daysLeft).toBeLessThanOrEqual(6);
    expect(metrics.statusLabel).toBe('Pace Boost Needed');
    expect(metrics.status).toBe('pace-needed');
  });

  it('identifies exam ready for high readiness percentage', () => {
    const metrics = calculateN5Metrics('2028-12-31', 10, 92, 100, 20);

    expect(metrics.overallPct).toBe(100);
    expect(metrics.statusLabel).toBe('Exam Ready');
    expect(metrics.status).toBe('exam-ready');
  });

  it('verifies N5DeadlineCard component file exists and exports N5DeadlineCard', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.resolve(__dirname, '../components/dashboard/N5DeadlineCard.tsx');
    expect(fs.existsSync(filePath)).toBe(true);

    const code = fs.readFileSync(filePath, 'utf-8');
    expect(code).toContain('export function N5DeadlineCard');
    expect(code).toContain('displayLeaves');
    expect(code).toContain('N5 Exam Target');
    expect(code).toContain('View N5 Roadmap');
  });
});
