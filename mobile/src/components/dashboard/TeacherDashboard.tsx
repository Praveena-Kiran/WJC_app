import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/src/theme/ThemeContext';
import { Screen, Card, Badge, SegmentedControl, Button, Icon } from '@/src/components/ui';
import { useApp } from '@/src/context/AppContext';
import { TYPE, SPACING } from '@/src/theme/tokens';

type Student = { id: number; name: string; status: 'present' | 'absent' | null };

const STUDENTS: Student[] = [
  { id: 1, name: 'Ananya Sharma', status: null },
  { id: 2, name: 'Rohan Verma', status: null },
  { id: 3, name: 'Priya Kapoor', status: null },
  { id: 4, name: 'Vikram Patel', status: null },
];

export function TeacherDashboard() {
  const { theme } = useTheme();
  const [tab, setTab] = useState<'roster' | 'upload'>('roster');
  const [students, setStudents] = useState<Student[]>(STUDENTS);
  const router = useRouter();

  return (
    <Screen style={{ gap: SPACING.lg }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[TYPE.title, { color: theme.text, flex: 1 }]}>Teacher Portal</Text>
        <TouchableOpacity
          onPress={() => router.push('/more/settings')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Settings"
        >
          <Icon name="sliders" size={20} color={theme.accent} />
        </TouchableOpacity>
      </View>

      <SegmentedControl
        options={[
          { label: 'Roster', value: 'roster' },
          { label: 'Materials', value: 'upload' },
        ]}
        value={tab}
        onChange={(v) => setTab(v as 'roster' | 'upload')}
      />

      {tab === 'roster' ? (
        <Card>
          <Text style={[TYPE.bodyStrong, { color: theme.text, marginBottom: SPACING.md }]}>
            Attendance
          </Text>
          {students.map((s) => (
            <View
              key={s.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: SPACING.sm,
                borderBottomWidth: 1,
                borderBottomColor: theme.border,
              }}
            >
              <Text style={[TYPE.body, { color: theme.text, flex: 1 }]}>{s.name}</Text>
              {['present' as const, 'absent' as const].map((st) => (
                <TouchableOpacity
                  key={st}
                  onPress={() =>
                    setStudents((prev) =>
                      prev.map((p) => (p.id === s.id ? { ...p, status: p.status === st ? null : st } : p))
                    )
                  }
                  style={{
                    marginLeft: SPACING.sm,
                    paddingHorizontal: SPACING.md,
                    paddingVertical: SPACING.xs,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: s.status === st ? (st === 'present' ? theme.success : theme.error) : theme.border,
                    backgroundColor: s.status === st ? (st === 'present' ? theme.successMuted : theme.errorMuted) : 'transparent',
                  }}
                >
                  <Text style={[TYPE.caption, { color: s.status === st ? (st === 'present' ? theme.success : theme.error) : theme.textMuted }]}>
                    {st === 'present' ? 'Present' : 'Absent'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
          <Button title="Save Attendance" onPress={() => {}} style={{ marginTop: SPACING.md }} />
        </Card>
      ) : (
        <Card style={{ alignItems: 'center', paddingVertical: SPACING.xxxl }}>
          <Text style={[TYPE.body, { color: theme.textMuted, textAlign: 'center' }]}>
            Upload materials for your students.
          </Text>
          <Button title="Select File" variant="secondary" onPress={() => {}} style={{ marginTop: SPACING.md }} />
        </Card>
      )}
    </Screen>
  );
}
