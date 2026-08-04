import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { Card, ProgressBar, Badge } from '@/src/components/ui';
import { calculateN5Metrics, type N5Status } from './n5-metrics';
import { TYPE, SPACING } from '@/src/theme/tokens';

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

function statusBadgeVariant(status: N5Status): 'success' | 'error' | 'accent' {
  if (status === 'pace-needed') return 'error';
  if (status === 'exam-ready') return 'accent';
  return 'success';
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
  const { theme } = useTheme();
  const effectiveTargetDate = n5TargetDate || (targetDays ? new Date(Date.now() + targetDays * 86400000).toISOString() : null);
  const metrics = calculateN5Metrics(
    effectiveTargetDate,
    solvedCount,
    kanaCount,
    kanjiCount,
    starredVocabCount
  );

  return (
    <Card style={{ borderLeftWidth: 3, borderLeftColor: theme.accent }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[TYPE.bodyStrong, { color: theme.text }]}>N5 Exam Target</Text>
        {onAdjustGoalDate ? (
          <TouchableOpacity onPress={onAdjustGoalDate}>
            <Badge label={metrics.statusLabel} variant={statusBadgeVariant(metrics.status)} />
          </TouchableOpacity>
        ) : (
          <Badge label={metrics.statusLabel} variant={statusBadgeVariant(metrics.status)} />
        )}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: SPACING.md }}>
        <Text style={[{ fontSize: 36, fontWeight: '700', color: theme.accent }]}>{metrics.daysLeft}</Text>
        <Text style={[TYPE.body, { color: theme.textMuted, marginLeft: SPACING.sm }]}>Days Remaining</Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.md }}>
        <Text style={[TYPE.caption, { color: theme.textMuted }]}>Overall Readiness</Text>
        <Text style={[TYPE.caption, { color: theme.accent, fontWeight: '700' }]}>{metrics.overallPct}%</Text>
      </View>
      <ProgressBar progress={metrics.overallPct / 100} style={{ marginTop: SPACING.xs }} />

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: SPACING.md, paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: theme.border }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={[TYPE.caption, { color: theme.textMuted }]}>Kana</Text>
          <Text style={[TYPE.bodyStrong, { color: theme.text }]}>{kanaCount}/92</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={[TYPE.caption, { color: theme.textMuted }]}>Lessons</Text>
          <Text style={[TYPE.bodyStrong, { color: theme.text }]}>{solvedCount}/10</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={[TYPE.caption, { color: theme.textMuted }]}>Kanji</Text>
          <Text style={[TYPE.bodyStrong, { color: theme.text }]}>{kanjiCount}/100</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={[TYPE.caption, { color: theme.textMuted }]}>Vocab</Text>
          <Text style={[TYPE.bodyStrong, { color: theme.text }]}>~800</Text>
        </View>
      </View>

      {onNavigateToRoadmap && (
        <TouchableOpacity
          onPress={onNavigateToRoadmap}
          style={{
            marginTop: SPACING.md,
            paddingVertical: SPACING.sm,
            alignItems: 'center',
            backgroundColor: theme.accentMuted,
            borderRadius: 8,
          }}
        >
          <Text style={[TYPE.bodyStrong, { color: theme.accent }]}>View N5 Roadmap</Text>
        </TouchableOpacity>
      )}
    </Card>
  );
}
