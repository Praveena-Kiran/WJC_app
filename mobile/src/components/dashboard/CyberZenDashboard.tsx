import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { N5DeadlineCard } from './N5DeadlineCard';

export function CyberZenDashboard() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚡ CyberZen Dashboard</Text>
        <Text style={styles.subtitle}>
          High-tech Japanese learning analytics, streak counters, and modules.
        </Text>
      </View>

      <N5DeadlineCard />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔥 Streak & Module Radar</Text>
        <Text style={styles.cardSubtitle}>
          Track your daily SRS reviews, Kanji mastery, and conversation drills.
        </Text>
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
    fontSize: 22,
    fontWeight: '800',
    color: '#38bdf8',
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
});
