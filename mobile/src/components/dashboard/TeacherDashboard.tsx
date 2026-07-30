import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

export function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState<'roster' | 'upload'>('roster');
  const [markedStudents, setMarkedStudents] = useState<string[]>(['s1', 's2']);

  const students = [
    { id: 's1', name: 'Tanaka Hiroshi', roll: 'WOX-2026-001' },
    { id: 's2', name: 'Sato Yuka', roll: 'WOX-2026-002' },
    { id: 's3', name: 'Suzuki Ken', roll: 'WOX-2026-003' },
    { id: 's4', name: 'Takahashi Mei', roll: 'WOX-2026-004' },
  ];

  const toggleAttendance = (id: string) => {
    setMarkedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Teacher Portal • Sensei Control</Text>
        <Text style={styles.subtitle}>
          Mark daily class attendance & upload handouts to Woxsen Vault.
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'roster' && styles.tabBtnActive]}
          onPress={() => setActiveTab('roster')}
        >
          <Text style={[styles.tabText, activeTab === 'roster' && styles.tabTextActive]}>
            📋 Class Roster Attendance
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'upload' && styles.tabBtnActive]}
          onPress={() => setActiveTab('upload')}
        >
          <Text style={[styles.tabText, activeTab === 'upload' && styles.tabTextActive]}>
            📤 Vault File Upload
          </Text>
        </TouchableOpacity>
      </View>

      {/* Roster Section */}
      {activeTab === 'roster' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily Class Roster (4 Students)</Text>
          {students.map((student) => {
            const isPresent = markedStudents.includes(student.id);
            return (
              <View key={student.id} style={styles.studentRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentRoll}>{student.roll}</Text>
                </View>

                <TouchableOpacity
                  style={[styles.statusBtn, isPresent ? styles.btnPresent : styles.btnAbsent]}
                  onPress={() => toggleAttendance(student.id)}
                >
                  <Text style={styles.statusBtnText}>{isPresent ? 'Present ✓' : 'Absent ✕'}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}

      {/* Upload Section */}
      {activeTab === 'upload' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Upload Course Handout</Text>
          <View style={styles.dropZone}>
            <Text style={styles.dropText}>📄 Tap to select PDF or audio file for S3 upload</Text>
          </View>
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
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  studentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  studentRoll: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  statusBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnPresent: {
    backgroundColor: '#10b981',
  },
  btnAbsent: {
    backgroundColor: '#ef4444',
  },
  statusBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  dropZone: {
    padding: 30,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  dropText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
});
