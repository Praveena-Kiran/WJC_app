import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { N5DeadlineCard } from './N5DeadlineCard';
import { BonsaiGarden } from './BonsaiGarden';
import { PebbleTimeline } from './PebbleTimeline';

export interface ZenDashboardProps {
  onNavigate?: (screen: string) => void;
}

export function ZenDashboard({ onNavigate }: ZenDashboardProps) {
  const solvedCount = 3;
  const totalLessons = 10;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Welcome Banner */}
        <View style={styles.header}>
          <Text style={styles.title}>Zen Student Dashboard • 禅語</Text>
          <Text style={styles.subtitle}>
            Peaceful, focused Japanese learning path with visual progress tracking.
          </Text>
        </View>

        {/* Bonsai Garden SVG Progress Widget */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🌱 Zen Garden Growth</Text>
          <BonsaiGarden leaves={solvedCount + 2} />
        </View>

        {/* N5 Exam Deadline Card */}
        <View style={{ marginVertical: 12 }}>
          <N5DeadlineCard targetDays={60} />
        </View>

        {/* Pebble Stepping Stones Path */}
        <View style={styles.card}>
          <PebbleTimeline
            solvedLessons={[1, 2, 3]}
            activeLessonId={4}
            onSelectLesson={(lessonId) => {
              if (onNavigate) onNavigate(`lesson-${lessonId}`);
            }}
          />
        </View>

        {/* Quick Action Navigation Grid */}
        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => onNavigate && onNavigate('kana')}
          >
            <Text style={styles.actionIcon}>🈠</Text>
            <Text style={styles.actionTitle}>Kana Trainer</Text>
            <Text style={styles.actionSub}>46 Hiragana & Katakana</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => onNavigate && onNavigate('kanji')}
          >
            <Text style={styles.actionIcon}>漢</Text>
            <Text style={styles.actionTitle}>Kanji Board</Text>
            <Text style={styles.actionSub}>N5 / N4 Stroke Order</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => onNavigate && onNavigate('quiz')}
          >
            <Text style={styles.actionIcon}>🎯</Text>
            <Text style={styles.actionTitle}>N5 Quiz</Text>
            <Text style={styles.actionSub}>Multiple Choice Practice</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => onNavigate && onNavigate('dictionary')}
          >
            <Text style={styles.actionIcon}>📖</Text>
            <Text style={styles.actionTitle}>Dictionary</Text>
            <Text style={styles.actionSub}>Vocab & Conjugator</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    elevation: 2,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  actionSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
});
