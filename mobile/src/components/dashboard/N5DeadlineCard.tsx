import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/ThemeContext';
import { Card } from '@/src/components/ui';
import { calculateN5Metrics } from './n5-metrics';
import { TYPE, SPACING, RADIUS } from '@/src/theme/tokens';

export interface N5DeadlineCardProps {
  n5TargetDate?: string | null;
  targetDays?: number;
  solvedCount?: number;
  kanaCount?: number;
  kanjiCount?: number;
  starredVocabCount?: number;
  leavesGrown?: number;
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
  leavesGrown = 3,
  onNavigateToRoadmap,
  onAdjustGoalDate,
}: N5DeadlineCardProps) {
  const { theme } = useTheme();
  const effectiveTargetDate =
    n5TargetDate || (targetDays ? new Date(Date.now() + targetDays * 86400000).toISOString() : null);
  const metrics = calculateN5Metrics(
    effectiveTargetDate,
    solvedCount,
    kanaCount,
    kanjiCount,
    starredVocabCount
  );

  const displayLeaves = leavesGrown ?? (solvedCount > 0 ? solvedCount + 2 : 3);
  const headerRadius = 20;
  const headerCircumference = 2 * Math.PI * headerRadius;
  const ringProgress = Math.min(displayLeaves / 10, 1);
  const headerOffset = headerCircumference * (1 - ringProgress);

  return (
    <Card padding={SPACING.md} style={{ borderRadius: RADIUS.lg }}>
      {/* Header Row: Title shifted higher & Top-Right Compact Ring Gauge */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Text style={[TYPE.bodyStrong, { color: theme.text, fontSize: 18, fontWeight: '700', marginTop: 2 }]}>
          N5 Exam Target
        </Text>

        <TouchableOpacity
          onPress={onAdjustGoalDate}
          disabled={!onAdjustGoalDate}
          activeOpacity={onAdjustGoalDate ? 0.7 : 1}
          accessibilityLabel="Adjust goal date"
          style={{ marginTop: -2, marginRight: -2 }}
        >
          <View style={{ width: 48, height: 48, justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <Svg width="48" height="48" viewBox="0 0 48 48">
              <Circle
                cx="24"
                cy="24"
                r={headerRadius}
                stroke={theme.surfaceAlt}
                strokeWidth="3.5"
                fill="none"
              />
              <Circle
                cx="24"
                cy="24"
                r={headerRadius}
                stroke={theme.accent}
                strokeWidth="3.5"
                fill="none"
                strokeDasharray={headerCircumference}
                strokeDashoffset={headerOffset}
                strokeLinecap="round"
                transform="rotate(-90 24 24)"
              />
            </Svg>
            <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: theme.accent, lineHeight: 16 }}>
                {displayLeaves}
              </Text>
              <Svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={{ marginTop: 1 }}>
                <Path
                  d="M11 20A9 9 0 0 0 20 11C20 5 13 3 13 3S11 10 5 13a9 9 0 0 0 6 7z"
                  stroke={theme.accent}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M13 3L7 17"
                  stroke={theme.accent}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Countdown Row tightly below title */}
      <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 2 }}>
        <Text style={{ fontSize: 34, fontWeight: '700', color: theme.accent, lineHeight: 38 }}>
          {metrics.daysLeft}
        </Text>
        <Text style={{ fontSize: 14, color: theme.textMuted, marginLeft: SPACING.xs }}>
          Days Remaining
        </Text>
      </View>

      {/* Overall Readiness Header & Bar */}
      <View style={{ marginTop: SPACING.sm }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: theme.textMuted, fontWeight: '500' }}>Overall Readiness</Text>
          <Text style={{ fontSize: 12, color: theme.accent, fontWeight: '700' }}>
            {metrics.overallPct}%
          </Text>
        </View>
        <View
          style={{
            height: 6,
            borderRadius: 3,
            backgroundColor: theme.surfaceAlt,
            marginTop: 4,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              height: '100%',
              width: `${Math.max(metrics.overallPct, 2)}%`,
              backgroundColor: theme.accent,
              borderRadius: 3,
            }}
          />
        </View>
      </View>

      {/* Horizontal Divider */}
      <View style={{ height: 1, backgroundColor: theme.border, marginVertical: SPACING.sm }} />

      {/* Full-Width 4 Column Grid */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ fontSize: 12, color: theme.textMuted }}>Kana</Text>
          <Text style={{ fontSize: 15, fontWeight: '700', color: theme.text, marginTop: 2 }}>
            {kanaCount}/92
          </Text>
        </View>
        <View style={{ width: 1, height: 20, backgroundColor: theme.border }} />
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ fontSize: 12, color: theme.textMuted }}>Lessons</Text>
          <Text style={{ fontSize: 15, fontWeight: '700', color: theme.text, marginTop: 2 }}>
            {solvedCount}/10
          </Text>
        </View>
        <View style={{ width: 1, height: 20, backgroundColor: theme.border }} />
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ fontSize: 12, color: theme.textMuted }}>Kanji</Text>
          <Text style={{ fontSize: 15, fontWeight: '700', color: theme.text, marginTop: 2 }}>
            {kanjiCount}/100
          </Text>
        </View>
        <View style={{ width: 1, height: 20, backgroundColor: theme.border }} />
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ fontSize: 12, color: theme.textMuted }}>Vocab</Text>
          <Text style={{ fontSize: 15, fontWeight: '700', color: theme.text, marginTop: 2 }}>
            ~800
          </Text>
        </View>
      </View>

      {/* Action CTA Button */}
      {onNavigateToRoadmap && (
        <TouchableOpacity
          onPress={onNavigateToRoadmap}
          style={{
            marginTop: SPACING.sm,
            paddingVertical: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.accentMuted,
            borderRadius: RADIUS.md,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: theme.accent, marginRight: 4 }}>
            View N5 Roadmap
          </Text>
          <Feather name="chevron-right" size={16} color={theme.accent} />
        </TouchableOpacity>
      )}
    </Card>
  );
}
