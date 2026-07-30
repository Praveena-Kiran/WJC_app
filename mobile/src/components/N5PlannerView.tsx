import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

export function N5PlannerView() {
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>N5 Exam & Learning Roadmap</Text>
        <Text style={styles.subtitle}>
          Set your exam deadline, track daily pace goals, and complete today's study checklist.
        </Text>
      </View>

      {/* Target Deadline Banner */}
      <View style={styles.bannerCard}>
        <Text style={styles.bannerTag}>EXAM DEADLINE TARGET</Text>
        <Text style={styles.bannerDays}>{targetDays} Days Remaining</Text>
        <Text style={styles.bannerSubText}>Preset target options:</Text>

        <View style={styles.presetRow}>
          {[14, 30, 60, 90].map((days) => (
            <TouchableOpacity
              key={days}
              style={[
                styles.presetButton,
                targetDays === days && styles.presetButtonActive,
              ]}
              onPress={() => setTargetDays(days)}
            >
              <Text
                style={[
                  styles.presetText,
                  targetDays === days && styles.presetTextActive,
                ]}
              >
                {days} Days
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Daily Pace Target Metrics */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Daily Kana Goal</Text>
          <Text style={styles.metricVal}>{dailyKanaTarget} / day</Text>
          <Text style={styles.metricSub}>{remainingKana} kana target</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Daily Kanji Goal</Text>
          <Text style={styles.metricVal}>{dailyKanjiTarget} / day</Text>
          <Text style={styles.metricSub}>{remainingKanji} kanji target</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Daily Vocab Goal</Text>
          <Text style={styles.metricVal}>{dailyVocabTarget} / day</Text>
          <Text style={styles.metricSub}>800 N5 vocab target</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Weekly Lessons</Text>
          <Text style={styles.metricVal}>{weeklyLessonTarget} / week</Text>
          <Text style={styles.metricSub}>{remainingLessons} lessons target</Text>
        </View>
      </View>

      {/* Today's Checklist */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>✅ Today's Action Checklist</Text>
        {tasks.map((t) => {
          const isDone = checkedTasks.includes(t.id);
          return (
            <TouchableOpacity
              key={t.id}
              style={styles.taskRow}
              onPress={() => toggleTask(t.id)}
            >
              <View style={[styles.checkbox, isDone && styles.checkboxDone]}>
                <Text style={styles.checkMark}>{isDone ? '✓' : ''}</Text>
              </View>
              <Text style={[styles.taskLabel, isDone && styles.taskLabelDone]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8fafc',
    flexGrow: 1,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  bannerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 5,
    borderLeftColor: '#5c60f5',
    marginBottom: 16,
    elevation: 2,
  },
  bannerTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#5c60f5',
  },
  bannerDays: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginVertical: 4,
  },
  bannerSubText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
  },
  presetButton: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    alignItems: 'center',
  },
  presetButtonActive: {
    backgroundColor: '#5c60f5',
  },
  presetText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  presetTextActive: {
    color: '#ffffff',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    elevation: 2,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#5c60f5',
    marginVertical: 4,
  },
  metricSub: {
    fontSize: 11,
    color: '#94a3b8',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxDone: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  checkMark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  taskLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    flex: 1,
  },
  taskLabelDone: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
});
