import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

export interface WoxsenStudentDashboardProps {
  onNavigate?: (screen: string) => void;
}

export function WoxsenStudentDashboard({ onNavigate }: WoxsenStudentDashboardProps) {
  const [selectedSection, setSelectedSection] = useState<'attendance' | 'vault'>('attendance');

  const attendanceRecords = [
    { date: '2026-07-28', status: 'Present', topic: 'Lesson 1: Self-Introductions' },
    { date: '2026-07-29', status: 'Present', topic: 'Lesson 2: Demonstratives' },
    { date: '2026-07-30', status: 'Present', topic: 'Kana Pronunciation Drill' },
  ];

  const vaultFiles = [
    { id: 'f1', title: 'JLPT N5 Grammar Handbook.pdf', size: '2.4 MB' },
    { id: 'f2', title: 'Kanji Stroke Order Guide.pdf', size: '4.1 MB' },
    { id: 'f3', title: 'Classroom Audio Dialogues.zip', size: '15.8 MB' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Institutional Woxsen Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Woxsen University Portal • 禅語</Text>
        <Text style={styles.subtitle}>
          Official course attendance tracking & PDF study material vault.
        </Text>
      </View>

      {/* Section Switcher Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, selectedSection === 'attendance' && styles.tabBtnActive]}
          onPress={() => setSelectedSection('attendance')}
        >
          <Text style={[styles.tabText, selectedSection === 'attendance' && styles.tabTextActive]}>
            📅 Attendance (94%)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, selectedSection === 'vault' && styles.tabBtnActive]}
          onPress={() => setSelectedSection('vault')}
        >
          <Text style={[styles.tabText, selectedSection === 'vault' && styles.tabTextActive]}>
            📁 Course Vault
          </Text>
        </TouchableOpacity>
      </View>

      {/* Attendance History Section */}
      {selectedSection === 'attendance' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Class Attendance Log</Text>
          {attendanceRecords.map((rec, idx) => (
            <View key={idx} style={styles.recordRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.recordTopic}>{rec.topic}</Text>
                <Text style={styles.recordDate}>{rec.date}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{rec.status}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Course Vault Files Section */}
      {selectedSection === 'vault' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Syllabus Resources & Handouts</Text>
          {vaultFiles.map((file) => (
            <View key={file.id} style={styles.recordRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.recordTopic}>{file.title}</Text>
                <Text style={styles.recordDate}>{file.size}</Text>
              </View>
              <TouchableOpacity style={styles.downloadBtn}>
                <Text style={styles.downloadText}>Download</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
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
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#5c60f5',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  recordTopic: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  recordDate: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10b981',
  },
  downloadBtn: {
    backgroundColor: '#5c60f5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  downloadText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
});
