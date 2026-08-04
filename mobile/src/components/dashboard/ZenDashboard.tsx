import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { Screen, Card, Button, Icon } from '@/src/components/ui';
import { useApp } from '@/src/context/AppContext';
import { useRouter } from 'expo-router';
import { N5DeadlineCard } from './N5DeadlineCard';
import { BonsaiGarden } from './BonsaiGarden';
import { PebbleTimeline } from './PebbleTimeline';
import { TYPE, SPACING } from '@/src/theme/tokens';

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

  return (
    <Screen style={{ gap: SPACING.lg }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[TYPE.title, { color: theme.text, flex: 1 }]}>Zen Student Dashboard</Text>
        <TouchableOpacity
          onPress={() => nav('/more/settings')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Settings"
        >
          <Icon name="sliders" size={20} color={theme.accent} />
        </TouchableOpacity>
      </View>

      <Card>
        <BonsaiGarden leaves={state.solvedLessons.length + 2} />
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
        <PebbleTimeline
          solvedLessons={state.solvedLessons}
          activeLessonId={state.activeLessonId}
          onSelectLesson={(id) => nav(`/more/planner`)}
        />
      </Card>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm }}>
        {[
          { label: 'Kana', glyph: 'あ', route: '/(tabs)/kana' },
          { label: 'Kanji', glyph: '漢', route: '/(tabs)/kanji' },
          { label: 'Quiz', route: '/(tabs)/quiz' },
          { label: 'Dict', route: '/(tabs)/dictionary' },
        ].map((item) => (
          <View key={item.label} style={{ width: '47%' }}>
            <Card padding={SPACING.md}>
              {item.glyph ? (
                <Text style={[TYPE.glyph, { color: theme.accent, textAlign: 'center' }]}>
                  {item.glyph}
                </Text>
              ) : (
                <Text style={[TYPE.title, { color: theme.accent, textAlign: 'center' }]}>
                  {item.label}
                </Text>
              )}
              <Text style={[TYPE.bodyStrong, { color: theme.text, textAlign: 'center', marginTop: SPACING.xs }]}>
                {item.glyph ? `${item.label} Trainer` : item.label}
              </Text>
              <Button
                title="Open"
                size="sm"
                variant="secondary"
                onPress={() => nav(item.route)}
                style={{ marginTop: SPACING.sm }}
              />
            </Card>
          </View>
        ))}
      </View>

      <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
        <View style={{ flex: 1 }}>
          <Card padding={SPACING.md}>
            <Text style={[TYPE.bodyStrong, { color: theme.text, textAlign: 'center' }]}>
              Kaiwa
            </Text>
            <Button
              title="Practice"
              size="sm"
              variant="ghost"
              onPress={() => nav('/more/kaiwa')}
              style={{ marginTop: SPACING.xs }}
            />
          </Card>
        </View>
        <View style={{ flex: 1 }}>
          <Card padding={SPACING.md}>
            <Text style={[TYPE.bodyStrong, { color: theme.text, textAlign: 'center' }]}>
              Radicals
            </Text>
            <Button
              title="Build"
              size="sm"
              variant="ghost"
              onPress={() => nav('/more/radicals')}
              style={{ marginTop: SPACING.xs }}
            />
          </Card>
        </View>
      </View>
    </Screen>
  );
}
