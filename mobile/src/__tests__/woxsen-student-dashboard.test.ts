import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { computeAttendancePct } from '../components/dashboard/attendance-utils';

describe('WoxsenStudentDashboard (Issue #160 / #027)', () => {
  const filePath = path.resolve(__dirname, '../components/dashboard/WoxsenStudentDashboard.tsx');
  const code = fs.readFileSync(filePath, 'utf-8');

  it('component file exists and exports WoxsenStudentDashboard', () => {
    expect(fs.existsSync(filePath)).toBe(true);
    expect(code).toContain('export function WoxsenStudentDashboard');
    expect(code).toContain('Woxsen University Portal');
  });

  it('renders N5DeadlineCard and PebbleTimeline widgets', () => {
    expect(code).toContain("import { N5DeadlineCard }");
    expect(code).toContain("import { PebbleTimeline }");
    expect(code).toContain('<N5DeadlineCard');
    expect(code).toContain('<PebbleTimeline');
  });

  it('wires real API data via useApiQuery', () => {
    expect(code).toContain("import { useApiQuery }");
    expect(code).toContain("'/api/attendance'");
    expect(code).toContain("'/api/files'");
  });

  it('supports file downloads via apiFetch + expo-file-system + expo-sharing', () => {
    expect(code).toContain("import { apiFetch }");
    expect(code).toContain("expo-file-system/legacy");
    expect(code).toContain("import * as Sharing from 'expo-sharing'");
    expect(code).toContain("FileSystem.downloadAsync");
    expect(code).toContain("Sharing.shareAsync");
  });

  it('no longer uses SegmentedControl', () => {
    expect(code).not.toContain('<SegmentedControl');
  });

  it('imports computeAttendancePct from attendance-utils', () => {
    expect(code).toContain(
      "import { computeAttendancePct, type AttendanceRecord } from './attendance-utils'"
    );
  });

  it('keeps the Kaiwa and Radicals quick-access row', () => {
    expect(code).toContain('/more/kaiwa');
    expect(code).toContain('/more/radicals');
  });
});

describe('computeAttendancePct', () => {
  it('returns 100 for empty records', () => {
    expect(computeAttendancePct([])).toBe(100);
  });

  it('returns 100 when all present', () => {
    expect(
      computeAttendancePct([
        { id: '1', status: 'present' },
        { id: '2', status: 'present' },
        { id: '3', status: 'present' },
      ])
    ).toBe(100);
  });

  it('returns 67 when 2 of 3 present', () => {
    expect(
      computeAttendancePct([
        { id: '1', status: 'present' },
        { id: '2', status: 'present' },
        { id: '3', status: 'absent' },
      ])
    ).toBe(67);
  });

  it('returns 0 when all absent', () => {
    expect(
      computeAttendancePct([
        { id: '1', status: 'absent' },
        { id: '2', status: 'absent' },
      ])
    ).toBe(0);
  });

  it('handles mixed status values (present, absent, late)', () => {
    expect(
      computeAttendancePct([
        { id: '1', status: 'present' },
        { id: '2', status: 'absent' },
        { id: '3', status: 'late' },
        { id: '4', status: 'present' },
      ])
    ).toBe(50);
  });
});
