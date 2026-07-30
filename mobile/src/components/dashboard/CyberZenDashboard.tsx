import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

export interface CyberZenDashboardProps {
  onNavigate?: (screen: string) => void;
}

export function CyberZenDashboard({ onNavigate }: CyberZenDashboardProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Neon Cyber Header */}
      <View style={styles.header}>
        <Text style={styles.title}>CYBER ZEN SYSTEM // 禅語</Text>
        <Text style={styles.subtitle}>
          High-tech futuristic dashboard with neon accents & XP metrics.
        </Text>
      </View>

      {/* Cyber XP & Streak Stats */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>CYBER XP</Text>
          <Text style={styles.statVal}>1,240 XP</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>DAY STREAK</Text>
          <Text style={styles.statVal}>🔥 12 Days</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>ACCURACY</Text>
          <Text style={styles.statVal}>94.2%</Text>
        </View>
      </View>

      {/* Cyber Quick Module Matrix */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>SYSTEM MODULE MATRIX</Text>
        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.moduleBtn}
            onPress={() => onNavigate && onNavigate('kana')}
          >
            <Text style={styles.moduleCode}>SYS.KANA</Text>
            <Text style={styles.moduleTitle}>Kana Matrix</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.moduleBtn}
            onPress={() => onNavigate && onNavigate('kanji')}
          >
            <Text style={styles.moduleCode}>SYS.KANJI</Text>
            <Text style={styles.moduleTitle}>Kanji Rasterizer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.moduleBtn}
            onPress={() => onNavigate && onNavigate('quiz')}
          >
            <Text style={styles.moduleCode}>SYS.QUIZ</Text>
            <Text style={styles.moduleTitle}>Practice Simulator</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.moduleBtn}
            onPress={() => onNavigate && onNavigate('dictionary')}
          >
            <Text style={styles.moduleCode}>SYS.DICT</Text>
            <Text style={styles.moduleTitle}>Conjugation Engine</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#0f172a',
    flexGrow: 1,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#38bdf8',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38bdf8',
  },
  statVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f8fafc',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  moduleBtn: {
    width: '48%',
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  moduleCode: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38bdf8',
  },
  moduleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 4,
  },
});
