import { Hono } from 'hono';

export const attendanceRoute = new Hono();

// In-memory fallback attendance database
interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

const attendanceDb: AttendanceRecord[] = [
  { id: 'att-1', studentId: 's1', studentName: 'Tanaka Hiroshi', date: '2026-07-29', status: 'present' },
  { id: 'att-2', studentId: 's2', studentName: 'Sato Yuka', date: '2026-07-29', status: 'present' },
  { id: 'att-3', studentId: 's3', studentName: 'Suzuki Ken', date: '2026-07-29', status: 'absent' },
];

// GET /api/attendance/roster — List class roster
attendanceRoute.get('/roster', (c) => {
  return c.json({
    ok: true,
    roster: [
      { id: 's1', name: 'Tanaka Hiroshi', roll: 'WOX-2026-001', attendancePct: 95 },
      { id: 's2', name: 'Sato Yuka', roll: 'WOX-2026-002', attendancePct: 100 },
      { id: 's3', name: 'Suzuki Ken', roll: 'WOX-2026-003', attendancePct: 88 },
      { id: 's4', name: 'Takahashi Mei', roll: 'WOX-2026-004', attendancePct: 92 },
    ],
  });
});

// GET /api/attendance — List attendance history
attendanceRoute.get('/', (c) => {
  return c.json({
    ok: true,
    records: attendanceDb,
  });
});

// POST /api/attendance — Mark/save attendance record
attendanceRoute.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { studentId, studentName, status } = body;

    if (!studentId || !status) {
      return c.json({ ok: false, error: 'Missing studentId or status' }, 400);
    }

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      studentId,
      studentName: studentName || 'Student',
      date: new Date().toISOString().split('T')[0],
      status,
    };

    attendanceDb.push(newRecord);

    return c.json({
      ok: true,
      message: 'Attendance recorded successfully',
      record: newRecord,
    });
  } catch (error) {
    return c.json({ ok: false, error: 'Invalid payload' }, 400);
  }
});
