import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { SPACING, RADIUS, TYPE, CARD_SHADOW } from '@/src/theme/tokens';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { Icon } from '@/src/components/ui/Icon';

export function N5PlannerView() {
  const { theme } = useTheme();
  const [targetDays, setTargetDays] = useState<number>(60);
  const [checkedTasks, setCheckedTasks] = useState<string[]>([]);

  const remainingKana = 92;
  const remainingKanji = 100;
  const remainingLessons = 10;

  const dailyKanaTarget = Math.max(1, Math.ceil(remainingKana / targetDays));
  const dailyKanjiTarget = Math.max(1, Math.ceil(remainingKanji / targetDays));
  const dailyVocabTarget = Math.max(1, Math.ceil(800 / targetDays));
  const weeklyLessonTarget = (remainingLessons / Math.max(1, targetDays / 7)).toFixed(1);

  const toggleTask = (id: string) => {
    setCheckedTasks((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const tasks = [
    { id: 't1', label: `Study ${dailyKanaTarget} Kana cards on Kana Trainer` },
    { id: 't2', label: `Trace ${dailyKanjiTarget} Kanji characters on Kanji Board` },
    { id: 't3', label: `Complete Step L1 in Stepping Stones Curriculum` },
    { id: 't4', label: `Spend 10 minutes reviewing SRS Flashcards deck` },
    { id: 't5', label: `Take 1 N5 Multiple Choice Practice Quiz` },
  ];

  const presetOptions = [14, 30, 60, 90];

  return (
    <Screen scroll padding={SPACING.lg}>
      <View style={{ marginBottom: SPACING.lg }}>
        <Text style={[TYPE.title, { color: theme.text }]}>N5 Exam & Learning Roadmap</Text>
        <Text style={[TYPE.caption, { color: theme.textMuted, marginTop: SPACING.xs }]}>
          Set your exam deadline, track daily pace goals, and complete today's study checklist.
        </Text>
      </View>

      {/* Target Deadline Banner */}
      <View
        style={{
          backgroundColor: theme.surface,
          borderRadius: RADIUS.md,
          padding: SPACING.lg,
          borderLeftWidth: 5,
          borderLeftColor: theme.accent,
          borderWidth: 1,
          borderColor: theme.border,
          ...CARD_SHADOW,
          marginBottom: SPACING.lg,
        }}
      >
        <Text style={[TYPE.caption, { fontWeight: '800', color: theme.accent }]}>EXAM DEADLINE TARGET</Text>
        <Text style={[TYPE.display, { color: theme.text, marginVertical: SPACING.xs }]}>{targetDays} Days Remaining</Text>
        <Text style={[TYPE.caption, { color: theme.textMuted, marginBottom: SPACING.sm }]}>Preset target options:</Text>

        <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
          {presetOptions.map((days) => (
            <TouchableOpacity
              key={days}
              style={{
                flex: 1,
                paddingVertical: SPACING.sm,
                backgroundColor: targetDays === days ? theme.accentMuted : theme.surfaceAlt,
                borderRadius: RADIUS.sm,
                borderWidth: 1,
                borderColor: targetDays === days ? theme.accent : theme.border,
                alignItems: 'center',
              }}
              onPress={() => setTargetDays(days)}
            >
              <Text
                style={[
                  TYPE.caption,
                  { fontWeight: '700', color: targetDays === days ? theme.accent : theme.textMuted },
                ]}
              >
                {days} Days
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Daily Pace Target Metrics */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm + 2, marginBottom: SPACING.lg }}>
        <Card padding={SPACING.md + 2} style={{ width: '48%' as never, flexGrow: 1, minWidth: '45%' as never }}>
          <Text style={[TYPE.caption, { fontWeight: '700', color: theme.textMuted }]}>Daily Kana Goal</Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: theme.accent, marginVertical: SPACING.xs }}>
            {dailyKanaTarget} / day
          </Text>
          <Text style={[TYPE.caption, { color: theme.textMuted }]}>{remainingKana} kana target</Text>
        </Card>

        <Card padding={SPACING.md + 2} style={{ width: '48%' as never, flexGrow: 1, minWidth: '45%' as never }}>
          <Text style={[TYPE.caption, { fontWeight: '700', color: theme.textMuted }]}>Daily Kanji Goal</Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: theme.accent, marginVertical: SPACING.xs }}>
            {dailyKanjiTarget} / day
          </Text>
          <Text style={[TYPE.caption, { color: theme.textMuted }]}>{remainingKanji} kanji target</Text>
        </Card>

        <Card padding={SPACING.md + 2} style={{ width: '48%' as never, flexGrow: 1, minWidth: '45%' as never }}>
          <Text style={[TYPE.caption, { fontWeight: '700', color: theme.textMuted }]}>Daily Vocab Goal</Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: theme.accent, marginVertical: SPACING.xs }}>
            {dailyVocabTarget} / day
          </Text>
          <Text style={[TYPE.caption, { color: theme.textMuted }]}>800 N5 vocab target</Text>
        </Card>

        <Card padding={SPACING.md + 2} style={{ width: '48%' as never, flexGrow: 1, minWidth: '45%' as never }}>
          <Text style={[TYPE.caption, { fontWeight: '700', color: theme.textMuted }]}>Weekly Lessons</Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: theme.accent, marginVertical: SPACING.xs }}>
            {weeklyLessonTarget} / week
          </Text>
          <Text style={[TYPE.caption, { color: theme.textMuted }]}>{remainingLessons} lessons target</Text>
        </Card>
      </View>

      {/* Today's Checklist */}
      <Card padding={SPACING.lg}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md, gap: SPACING.xs }}>
          <Icon name="check-square" size={16} color={theme.text} />
          <Text style={[TYPE.bodyStrong, { color: theme.text }]}>Today's Action Checklist</Text>
        </View>
        {tasks.map((t) => {
          const isDone = checkedTasks.includes(t.id);
          return (
            <TouchableOpacity
              key={t.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: SPACING.sm + 2,
                borderBottomWidth: 1,
                borderBottomColor: theme.border,
                gap: SPACING.sm + 2,
              }}
              onPress={() => toggleTask(t.id)}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  borderWidth: 2,
                  borderColor: isDone ? theme.success : theme.border,
                  backgroundColor: isDone ? theme.success : 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {isDone && <Icon name="check" size={12} color={theme.onAccent} />}
              </View>
              <Text
                style={[
                  TYPE.caption,
                  {
                    fontWeight: '600',
                    color: isDone ? theme.textMuted : theme.text,
                    flex: 1,
                    textDecorationLine: isDone ? 'line-through' : 'none',
                  },
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Card>
    </Screen>
  );
}
