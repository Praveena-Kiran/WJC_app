import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PebbleTimelineProps {
  solvedLessons?: number[];
  activeLessonId?: number;
  onSelectLesson?: (lessonId: number) => void;
}

export function PebbleTimeline({
  solvedLessons = [1],
  activeLessonId = 1,
  onSelectLesson,
}: PebbleTimelineProps) {
  const totalLessons = 10;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stepping Stones Timeline</Text>
      <View style={styles.pebbleList}>
        {Array.from({ length: totalLessons }, (_, i) => i + 1).map((lessonNum) => {
          const isSolved = solvedLessons.includes(lessonNum);
          const isActive = activeLessonId === lessonNum;
          const isLocked = lessonNum > Math.max(...solvedLessons, 0) + 1;

          return (
            <View key={lessonNum} style={styles.pebbleRow}>
              <TouchableOpacity
                style={[
                  styles.pebbleCircle,
                  isSolved && styles.pebbleSolved,
                  isActive && styles.pebbleActive,
                  isLocked && styles.pebbleLocked,
                ]}
                onPress={() => {
                  if (!isLocked && onSelectLesson) {
                    onSelectLesson(lessonNum);
                  }
                }}
                disabled={isLocked}
              >
                <Text
                  style={[
                    styles.pebbleText,
                    (isSolved || isActive) && styles.pebbleTextActive,
                    isLocked && styles.pebbleTextLocked,
                  ]}
                >
                  {isLocked ? '🔒' : `L${lessonNum}`}
                </Text>
              </TouchableOpacity>
              {lessonNum < totalLessons && <View style={styles.connectorLine} />}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  pebbleList: {
    alignItems: 'center',
  },
  pebbleRow: {
    alignItems: 'center',
  },
  pebbleCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#cbd5e1',
  },
  pebbleSolved: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  pebbleActive: {
    backgroundColor: '#5c60f5',
    borderColor: '#5c60f5',
  },
  pebbleLocked: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
  },
  pebbleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  pebbleTextActive: {
    color: '#ffffff',
  },
  pebbleTextLocked: {
    color: '#94a3b8',
  },
  connectorLine: {
    width: 3,
    height: 16,
    backgroundColor: '#cbd5e1',
    marginVertical: 2,
  },
});
