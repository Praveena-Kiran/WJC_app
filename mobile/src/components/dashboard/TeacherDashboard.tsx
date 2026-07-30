import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export function TeacherDashboard() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👨‍🏫 Faculty Teacher Portal</Text>
        <Text style={styles.subtitle}>
          Mark student attendance roster, upload study resources, and manage classes.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📋 Class Roster & Attendance Marker</Text>
        <Text style={styles.cardSubtitle}>
          Select date and mark student presence for Woxsen Language Centre courses.
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
