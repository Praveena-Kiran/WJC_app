import { describe, it, expect } from 'vitest';
import app from '../server/app';

describe('GET & POST /api/attendance Handlers (Issue #128 / #052)', () => {
  it('GET /api/attendance/roster returns roster array', async () => {
    const res = await app.request('/api/attendance/roster');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.roster)).toBe(true);
    expect(data.roster.length).toBeGreaterThan(0);
    expect(data.roster[0]).toHaveProperty('name');
  });

  it('GET /api/attendance returns attendance records', async () => {
    const res = await app.request('/api/attendance');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.records)).toBe(true);
  });

  it('POST /api/attendance records single student attendance', async () => {
    const res = await app.request('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: 's4',
        studentName: 'Takahashi Mei',
        status: 'present',
      }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.record.studentId).toBe('s4');
    expect(data.record.status).toBe('present');
  });

  it('POST /api/attendance records batch attendance records', async () => {
    const res = await app.request('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: '2026-08-01',
        records: [
          { studentUserId: 's1', status: 'present' },
          { studentUserId: 's2', status: 'absent' },
          { studentUserId: 's3', status: 'late' },
        ],
      }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.records)).toBe(true);
    expect(data.records.length).toBe(3);
    expect(data.records[0].status).toBe('present');
  });
});
