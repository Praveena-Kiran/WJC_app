import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/src/theme/ThemeContext';
import { Screen, Card, SegmentedControl, Badge, Button, Icon } from '@/src/components/ui';
import { TYPE, SPACING } from '@/src/theme/tokens';

export function WoxsenStudentDashboard() {
  const { theme } = useTheme();
  const [tab, setTab] = useState<'attendance' | 'vault'>('attendance');
  const router = useRouter();

  return (
    <Screen style={{ gap: SPACING.lg }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[TYPE.title, { color: theme.text, flex: 1 }]}>Woxsen University Portal</Text>
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
