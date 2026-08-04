import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { Screen, Card, SegmentedControl, Badge, Button } from '@/src/components/ui';
import { TYPE, SPACING } from '@/src/theme/tokens';

export function WoxsenStudentDashboard() {
  const { theme } = useTheme();
  const [tab, setTab] = useState<'attendance' | 'vault'>('attendance');

  return (
    <Screen style={{ gap: SPACING.lg }}>
      <Text style={[TYPE.title, { color: theme.text }]}>Woxsen University Portal</Text>

      <SegmentedControl
        options={[
          { label: 'Attendance', value: 'attendance' },
          { label: 'Vault', value: 'vault' },
        ]}
        value={tab}
        onChange={(v) => setTab(v as 'attendance' | 'vault')}
      />

      {tab === 'attendance' ? (
        <Card>
          {[
            { date: '2026-07-28', topic: 'Lesson 1: Self-Introductions' },
            { date: '2026-07-29', topic: 'Lesson 2: Demonstratives' },
            { date: '2026-07-30', topic: 'Kana Pronunciation Drill' },
          ].map((rec, idx) => (
            <View
              key={idx}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: SPACING.sm,
                borderBottomWidth: 1,
                borderBottomColor: theme.border,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={[TYPE.body, { color: theme.text }]}>{rec.topic}</Text>
                <Text style={[TYPE.caption, { color: theme.textMuted }]}>{rec.date}</Text>
              </View>
              <Badge label="Present" variant="success" />
            </View>
          ))}
        </Card>
      ) : (
        <Card>
          {[
            { title: 'JLPT N5 Grammar Handbook.pdf', size: '2.4 MB' },
            { title: 'Kanji Stroke Order Guide.pdf', size: '4.1 MB' },
            { title: 'Classroom Audio Dialogues.zip', size: '15.8 MB' },
          ].map((file, idx) => (
            <View
              key={idx}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: SPACING.sm,
                borderBottomWidth: 1,
                borderBottomColor: theme.border,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={[TYPE.body, { color: theme.text }]}>{file.title}</Text>
                <Text style={[TYPE.caption, { color: theme.textMuted }]}>{file.size}</Text>
              </View>
              <Button title="Download" size="sm" variant="secondary" onPress={() => {}} />
            </View>
          ))}
        </Card>
      )}
    </Screen>
  );
}
