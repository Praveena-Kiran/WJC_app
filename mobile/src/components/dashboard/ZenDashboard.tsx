import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { N5DeadlineCard } from './N5DeadlineCard';

export function ZenDashboard() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>こんにちは! (Zen Mode)</Text>
        <Text style={styles.subtitle}>
          Peaceful Japanese learning experience. Step by step mastery.
        </Text>
      </View>

      <N5DeadlineCard />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌱 Zen Garden Progress</Text>
        <Text style={styles.cardSubtitle}>
          Complete daily stepping stones to grow your Japanese skills.
        </Text>
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
});
