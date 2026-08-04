import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { Screen, Card, Button, Icon } from '@/src/components/ui';
import { useApp } from '@/src/context/AppContext';
import { useRouter } from 'expo-router';
import { N5DeadlineCard } from './N5DeadlineCard';
import { ProgressBar } from '@/src/components/ui';
import { TYPE, SPACING } from '@/src/theme/tokens';

export interface CyberZenDashboardProps {
  onNavigate?: (screen: string) => void;
}

export function CyberZenDashboard({ onNavigate }: CyberZenDashboardProps) {
  const { theme } = useTheme();
  const { state } = useApp();
  const router = useRouter();

  const nav = (route: string) => {
    if (onNavigate) onNavigate(route);
    else router.push(route as Parameters<typeof router.push>[0]);
  };

  return (
    <Screen style={{ gap: SPACING.lg }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, paddingRight: SPACING.sm }}>
          <Text style={[TYPE.title, { color: theme.text }]}>CYBER ZEN SYSTEM</Text>
          <Text style={[TYPE.caption, { color: theme.textMuted, marginTop: SPACING.xs }]}>
            Module-driven dashboard with structured progress tracking.
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => nav('/more/settings')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ paddingTop: SPACING.xs }}
          accessibilityLabel="Settings"
        >
          <Icon name="sliders" size={20} color={theme.accent} />
        </TouchableOpacity>
      </View>

      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          {[
            { label: 'Streak', value: `${state.streakCount} Days` },
            { label: 'Kana', value: `${state.masteredKana.length}/92` },
            { label: 'Kanji', value: `${state.practicedKanji.length}/100` },
          ].map((s) => (
            <View key={s.label} style={{ alignItems: 'center' }}>
              <Text style={[TYPE.caption, { color: theme.textMuted }]}>{s.label}</Text>
              <Text style={[TYPE.bodyStrong, { color: theme.accent, marginTop: SPACING.xs }]}>
                {s.value}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <N5DeadlineCard
        n5TargetDate={state.n5TargetDate}
        solvedCount={state.solvedLessons.length}
        kanaCount={state.masteredKana.length}
        kanjiCount={state.practicedKanji.length}
        starredVocabCount={state.starredVocab.length}
        onNavigateToRoadmap={() => nav('/more/planner')}
      />

      <Card>
        <Text style={[TYPE.bodyStrong, { color: theme.text, marginBottom: SPACING.md }]}>
          Modules
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm }}>
          {[
            { id: 'kana', label: 'Kana Matrix', route: '/(tabs)/kana' },
            { id: 'kanji', label: 'Kanji Board', route: '/(tabs)/kanji' },
            { id: 'quiz', label: 'Quiz Engine', route: '/(tabs)/quiz' },
            { id: 'dict', label: 'Dictionary', route: '/(tabs)/dictionary' },
          ].map((m) => (
            <View key={m.id} style={{ width: '47%' }}>
              <Button
                title={m.label}
                size="md"
                variant="secondary"
                onPress={() => nav(m.route)}
              />
            </View>
          ))}
        </View>
      </Card>
    </Screen>
  );
}
