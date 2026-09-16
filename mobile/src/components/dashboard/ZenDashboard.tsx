import React from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { Screen, Card, Button, Icon } from '@/src/components/ui';
import { useApp } from '@/src/context/AppContext';
import { useRouter } from 'expo-router';
import { N5DeadlineCard } from './N5DeadlineCard';
import { TYPE, SPACING, RADIUS, ELEVATION } from '@/src/theme/tokens';

export interface ZenDashboardProps {
  onNavigate?: (screen: string) => void;
}

export function ZenDashboard({ onNavigate }: ZenDashboardProps) {
  const { theme } = useTheme();
  const { state } = useApp();
  const router = useRouter();

  const nav = (route: string) => {
    if (onNavigate) onNavigate(route);
    else router.push(route as Parameters<typeof router.push>[0]);
  };

  const displayName = state.activeStudentName || 'Learner';

  return (
    <Screen scroll padding={SPACING.lg} style={{ gap: SPACING.lg }}>
      {/* Header with Zen Greeting and Quick Settings */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: SPACING.xs,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={[TYPE.micro, { color: theme.accent, letterSpacing: 1.5, textTransform: 'uppercase' }]}>
            Zen Student Dashboard • 禅
          </Text>
          <Text
            style={[
              TYPE.title,
              { color: theme.text, fontSize: 22, marginTop: 2 },
            ]}
          >
            Konnichiwa, {displayName}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => nav('/more/settings')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Settings"
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.surfaceAlt,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: theme.border,
          }}
        >
          <Icon name="sliders" size={18} color={theme.accent} />
        </TouchableOpacity>
      </View>

      {/* Main N5 Deadline & Progress Gauge Card */}
      <N5DeadlineCard
        n5TargetDate={state.n5TargetDate}
        solvedCount={state.solvedLessons.length}
        kanaCount={state.masteredKana.length}
        kanjiCount={state.practicedKanji.length}
        starredVocabCount={state.starredVocab.length}
        leavesGrown={state.solvedLessons.length + 2}
        onNavigateToRoadmap={() => nav('/more/planner')}
      />

      {/* Quick Study Stepping Stone Cards */}
      <View style={{ gap: SPACING.sm }}>
        <Text
          style={[
            TYPE.micro,
            {
              color: theme.textMuted,
              letterSpacing: 1,
              textTransform: 'uppercase',
              marginLeft: 2,
            },
          ]}
        >
          Quick Study Modalities
        </Text>

        <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
          <View style={{ flex: 1 }}>
            <Card padding={SPACING.md} style={{ ...ELEVATION.subtle }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: theme.accentMuted,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: SPACING.sm,
                }}
              >
                <Icon name="message-circle" size={18} color={theme.accent} />
              </View>

              <Text style={[TYPE.bodyStrong, { color: theme.text }]}>
                Kaiwa
              </Text>
              <Text
                style={[
                  TYPE.caption,
                  { color: theme.textMuted, marginTop: 2, marginBottom: SPACING.md },
                ]}
              >
                Dialogue & stories
              </Text>

              <Button
                title="Practice"
                size="sm"
                variant="tonal"
                fullWidth
                rightIcon="chevron-right"
                onPress={() => nav('/more/kaiwa')}
              />
            </Card>
          </View>

          <View style={{ flex: 1 }}>
            <Card padding={SPACING.md} style={{ ...ELEVATION.subtle }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: theme.accentMuted,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: SPACING.sm,
                }}
              >
                <Icon name="grid" size={18} color={theme.accent} />
              </View>

              <Text style={[TYPE.bodyStrong, { color: theme.text }]}>
                Radicals
              </Text>
              <Text
                style={[
                  TYPE.caption,
                  { color: theme.textMuted, marginTop: 2, marginBottom: SPACING.md },
                ]}
              >
                Build kanji parts
              </Text>

              <Button
                title="Build"
                size="sm"
                variant="tonal"
                fullWidth
                rightIcon="chevron-right"
                onPress={() => nav('/more/radicals')}
              />
            </Card>
          </View>
        </View>
      </View>
    </Screen>
  );
}
