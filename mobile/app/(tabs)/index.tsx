import React, { useState } from 'react';
import { ZenDashboard } from '../../src/components/dashboard/ZenDashboard';
import { CyberZenDashboard } from '../../src/components/dashboard/CyberZenDashboard';
import { WoxsenStudentDashboard } from '../../src/components/dashboard/WoxsenStudentDashboard';
import { TeacherDashboard } from '../../src/components/dashboard/TeacherDashboard';

export default function HomeScreen() {
  // In v1, role & mode are read from app context or state
  const [userRole] = useState<'external' | 'woxsen-student' | 'teacher'>('external');
  const [studyMode] = useState<'zen' | 'cyber'>('zen');

  if (userRole === 'teacher') {
    return <TeacherDashboard />;
  }

  if (userRole === 'woxsen-student') {
    return <WoxsenStudentDashboard />;
  }

  return studyMode === 'zen' ? <ZenDashboard /> : <CyberZenDashboard />;
}
