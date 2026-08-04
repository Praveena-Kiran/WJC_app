import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { Icon } from '@/src/components/ui/Icon';
import { TYPE, SPACING } from '@/src/theme/tokens';

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
  const { theme } = useTheme();
  const totalLessons = 10;
  const maxSolved = Math.max(...solvedLessons, 0);

  return (
    <View style={styles.container}>
      <Text style={[TYPE.bodyStrong, { color: theme.text, marginBottom: SPACING.md }]}>
        Stepping Stones
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.timeline}>
          {Array.from({ length: totalLessons }, (_, i) => i + 1).map((num, idx) => {
            const isSolved = solvedLessons.includes(num);
            const isActive = num === activeLessonId;
            const isLocked = num > maxSolved + 1;

            return (
              <React.Fragment key={num}>
                {idx > 0 && (
                  <View
                    style={[
                      styles.connector,
                      { backgroundColor: isSolved ? theme.success : theme.border },
                    ]}
                  />
                )}
                <TouchableOpacity
                  style={[
                    styles.pebble,
                    {
                      backgroundColor: isSolved
                        ? theme.success
                        : isActive
                          ? theme.accent
                          : isLocked
                            ? theme.surfaceAlt
                            : theme.surface,
                      borderColor: isActive ? theme.accent : theme.border,
                      transform: isActive ? [{ scale: 1.15 }] : undefined,
                    },
                  ]}
                  onPress={() => {
                    if (!isLocked && onSelectLesson) onSelectLesson(num);
                  }}
                  disabled={isLocked}
                >
                  {isLocked ? (
                    <Icon name="lock" size={12} color={theme.textMuted} />
                  ) : isSolved ? (
                    <Icon name="check" size={14} color="#FFFFFF" />
                  ) : (
                    <Text
                      style={[
                        TYPE.caption,
                        { color: isActive ? '#FFFFFF' : theme.text, fontWeight: '700' },
                      ]}
                    >
                      {num}
                    </Text>
                  )}
                </TouchableOpacity>
              </React.Fragment>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  pebble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  connector: {
    width: 24,
    height: 3,
    borderRadius: 2,
  },
});
