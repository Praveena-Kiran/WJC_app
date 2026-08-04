import { ZenDashboard } from '../../src/components/dashboard/ZenDashboard';
import { CyberZenDashboard } from '../../src/components/dashboard/CyberZenDashboard';
import { WoxsenStudentDashboard } from '../../src/components/dashboard/WoxsenStudentDashboard';
import { TeacherDashboard } from '../../src/components/dashboard/TeacherDashboard';
import { useApp } from '@/src/context/AppContext';

export default function HomeScreen() {
  const { state } = useApp();

  if (state.userRole === 'teacher') {
    return <TeacherDashboard />;
  }

  if (state.userRole === 'woxsen-student') {
    return <WoxsenStudentDashboard />;
  }

  return state.studyMode === 'zen' ? <ZenDashboard /> : <CyberZenDashboard />;
}
