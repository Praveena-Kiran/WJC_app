export interface AttendanceRecord {
  id: string;
  studentId?: string;
  studentUserId?: string;
  studentName?: string;
  date?: string;
  attendanceDate?: string;
  status: string;
  markedBy?: string;
}

export function computeAttendancePct(records: AttendanceRecord[]): number {
  if (records.length === 0) return 100;
  const present = records.filter((r) => r.status === 'present').length;
  return Math.round((present / records.length) * 100);
}
