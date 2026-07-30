import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { calculateN5Metrics } from './n5-metrics';

export interface N5DeadlineCardProps {
  n5TargetDate?: string | null;
  targetDays?: number;
  solvedCount?: number;
  kanaCount?: number;
  kanjiCount?: number;
  starredVocabCount?: number;
  onNavigateToRoadmap?: () => void;
  onAdjustGoalDate?: () => void;
}

export function N5DeadlineCard({
  n5TargetDate,
  targetDays,
  solvedCount = 0,
  kanaCount = 0,
  kanjiCount = 0,
  starredVocabCount = 0,
  onNavigateToRoadmap,
  onAdjustGoalDate,
}: N5DeadlineCardProps) {
  const effectiveTargetDate = n5TargetDate || (targetDays ? new Date(Date.now() + targetDays * 86400000).toISOString() : null);
  const metrics = calculateN5Metrics(
    effectiveTargetDate,
    solvedCount,
    kanaCount,
    kanjiCount,
    starredVocabCount
  );

  return (
    <View style={styles.card}>
      {/* Header with Title and Status Badge */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerIcon}>📅</Text>
          <Text style={styles.headerTitle}>N5 Exam Deadline Target</Text>
        </View>
        <TouchableOpacity onPress={onAdjustGoalDate} activeOpacity={0.7}>
          <View style={[styles.badge, { backgroundColor: metrics.statusBg }]}>
            <Text style={[styles.badgeText, { color: metrics.statusColor }]}>
              {metrics.statusLabel}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Days Remaining Meter */}
      <View style={styles.daysRow}>
        <Text style={styles.daysNumber}>{metrics.daysLeft}</Text>
        <Text style={styles.daysLabel}>Days Remaining</Text>
      </View>

      {/* Recommended Daily Pace Badge */}
      <View style={styles.paceBadgeContainer}>
        <Text style={styles.paceBadgeText}>
          Pace Goal: {metrics.dailyKana} Kana, {metrics.dailyKanji} Kanji, {metrics.dailyVocab} Vocab / day
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressLabelRow}>
          <Text style={styles.progressLabel}>Overall N5 Readiness</Text>
          <Text style={styles.progressValue}>{metrics.overallPct}%</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${metrics.overallPct}%` }]} />
        </View>
      </View>

      {/* Metrics Grid */}
      <View style={styles.gridContainer}>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Kana</Text>
          <Text style={styles.gridValue}>{kanaCount}/92</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Lessons</Text>
          <Text style={styles.gridValue}>{solvedCount}/10</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Kanji</Text>
          <Text style={styles.gridValue}>{kanjiCount}/100</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Vocab</Text>
          <Text style={styles.gridValue}>~800 Target</Text>
        </View>
      </View>

      {/* Navigation Quick Action Button */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={onNavigateToRoadmap}
        activeOpacity={0.8}
      >
        <Text style={styles.actionButtonText}>View N5 Roadmap & Plan →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#5c60f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerIcon: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  daysRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginVertical: 10,
  },
  daysNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: '#5c60f5',
  },
  daysLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  paceBadgeContainer: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  paceBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  progressContainer: {
    marginBottom: 14,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  progressValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5c60f5',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#5c60f5',
    borderRadius: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8fafc',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  gridItem: {
    alignItems: 'center',
  },
  gridLabel: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 2,
  },
  gridValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  actionButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5c60f5',
  },
});
