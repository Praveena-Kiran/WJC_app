import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useSession } from '@/src/auth-client';
import { apiFetch } from '@/src/lib/api-fetch';
import { useApp } from '@/src/context/AppContext';
import { useTheme } from '@/src/theme/ThemeContext';
import { Button } from '@/src/components/ui/Button';
import { Icon } from '@/src/components/ui/Icon';
import { ActionFooter } from '@/src/components/ui/ActionFooter';
import { TYPE, SPACING, RADIUS, ELEVATION } from '@/src/theme/tokens';

type Role = 'external' | 'woxsen-student';
type JlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

interface RoleOption {
  value: Role;
  label: string;
  badge: string;
  icon: 'globe' | 'book-open';
  description: string;
}

const ROLES: RoleOption[] = [
  {
    value: 'external',
    label: 'External Student',
    badge: 'Self-Paced',
    icon: 'globe',
    description: 'Autonomous learner mastering JLPT N5 at their own pace',
  },
  {
    value: 'woxsen-student',
    label: 'Woxsen Student',
    badge: 'Cohort Track',
    icon: 'book-open',
    description: 'Enrolled student in the Woxsen Japanese curriculum',
  },
];

const JLPT_LEVEL_DETAILS: Record<JlptLevel, { label: string; sub: string }> = {
  N5: { label: 'N5', sub: 'Beginner' },
  N4: { label: 'N4', sub: 'Elementary' },
  N3: { label: 'N3', sub: 'Intermediate' },
  N2: { label: 'N2', sub: 'Upper-Int.' },
  N1: { label: 'N1', sub: 'Advanced' },
};

const JLPT_LEVELS: JlptLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

export default function OnboardingScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { data: session } = useSession();
  const { completeOnboarding } = useApp();

  const [role, setRole] = useState<Role>('external');
  const [jlptLevel, setJlptLevel] = useState<JlptLevel>('N5');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectRole = (newRole: Role) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setRole(newRole);
  };

  const handleSelectLevel = (lvl: JlptLevel) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setJlptLevel(lvl);
  };

  async function handleSubmit() {
    setError(null);
    setLoading(true);

    const userName = session?.user?.name || '';

    try {
      await apiFetch('/api/progress', {
        method: 'PUT',
        body: JSON.stringify({
          profile: {
            role,
            targetJlptLevel: jlptLevel,
            studyMode: 'zen',
          },
        }),
      });

      completeOnboarding({
        name: userName,
        role: role as 'external' | 'woxsen-student' | 'teacher' | 'admin',
        targetDate: '',
        level: jlptLevel,
      });

      router.replace('/(tabs)' as any);
    } catch (e) {
      setError('Failed to save your profile. Please try again.');
      console.error('[onboarding] submit error:', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={['top', 'left', 'right']}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Calligraphic Seal & Headline */}
        <View style={styles.header}>
          <View
            style={[
              styles.sealBadge,
              {
                borderColor: theme.accent,
                backgroundColor: theme.accentMuted,
              },
            ]}
          >
            <Text style={[styles.sealText, { color: theme.accent }]}>禅語</Text>
          </View>
          <Text
            style={[
              TYPE.title,
              {
                color: theme.text,
                textAlign: 'center',
                marginTop: SPACING.md,
                marginBottom: SPACING.xs,
              },
            ]}
          >
            Set Up Your Learning Path
          </Text>
          <Text
            style={[
              TYPE.body,
              {
                color: theme.textMuted,
                textAlign: 'center',
                paddingHorizontal: SPACING.lg,
              },
            ]}
          >
            Personalize your daily curriculum, syllabus pacing, and study goals.
          </Text>
        </View>

        {/* Section 1: Study Track */}
        <View style={styles.section}>
          <Text
            style={[
              TYPE.subhead,
              {
                color: theme.textMuted,
                fontWeight: '700',
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                marginBottom: SPACING.sm,
              },
            ]}
          >
            Select Your Learning Track
          </Text>

          <View style={{ gap: SPACING.sm }}>
            {ROLES.map((r) => {
              const isSelected = role === r.value;
              return (
                <Pressable
                  key={r.value}
                  style={({ pressed }) => [
                    styles.roleCard,
                    {
                      borderColor: isSelected ? theme.accent : theme.border,
                      borderWidth: isSelected ? 2 : 1,
                      backgroundColor: isSelected
                        ? theme.accentMuted
                        : theme.surface,
                      transform: [{ scale: pressed ? 0.99 : 1.0 }],
                      ...ELEVATION.subtle,
                    },
                  ]}
                  onPress={() => handleSelectRole(r.value)}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      {
                        backgroundColor: isSelected
                          ? theme.surface
                          : theme.surfaceAlt,
                      },
                    ]}
                  >
                    <Icon
                      name={r.icon}
                      size={20}
                      color={isSelected ? theme.accent : theme.textMuted}
                    />
                  </View>

                  <View style={{ flex: 1, marginLeft: SPACING.md }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Text
                        style={[
                          TYPE.bodyStrong,
                          {
                            color: isSelected ? theme.accent : theme.text,
                            fontSize: 16,
                          },
                        ]}
                      >
                        {r.label}
                      </Text>
                      <Text
                        style={[
                          TYPE.micro,
                          {
                            color: isSelected ? theme.accent : theme.textMuted,
                            backgroundColor: isSelected
                              ? theme.surface
                              : theme.surfaceAlt,
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            borderRadius: RADIUS.full,
                            overflow: 'hidden',
                          },
                        ]}
                      >
                        {r.badge}
                      </Text>
                    </View>
                    <Text
                      style={[
                        TYPE.caption,
                        { color: theme.textMuted, marginTop: 4, lineHeight: 18 },
                      ]}
                    >
                      {r.description}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Section 2: Target JLPT Level */}
        <View style={styles.section}>
          <Text
            style={[
              TYPE.subhead,
              {
                color: theme.textMuted,
                fontWeight: '700',
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                marginBottom: SPACING.sm,
              },
            ]}
          >
            Target JLPT Level
          </Text>

          <View style={styles.levelRow}>
            {JLPT_LEVELS.map((lvl) => {
              const isSelected = jlptLevel === lvl;
              const details = JLPT_LEVEL_DETAILS[lvl];
              return (
                <Pressable
                  key={lvl}
                  style={({ pressed }) => [
                    styles.levelTile,
                    {
                      borderColor: isSelected ? theme.accent : theme.border,
                      borderWidth: isSelected ? 2 : 1,
                      backgroundColor: isSelected
                        ? theme.accentMuted
                        : theme.surfaceAlt,
                      transform: [{ scale: pressed ? 0.97 : 1.0 }],
                    },
                  ]}
                  onPress={() => handleSelectLevel(lvl)}
                >
                  <Text
                    style={[
                      TYPE.titleSm,
                      {
                        color: isSelected ? theme.accent : theme.text,
                        fontWeight: '700',
                      },
                    ]}
                  >
                    {details.label}
                  </Text>
                  <Text
                    style={[
                      TYPE.micro,
                      {
                        color: isSelected ? theme.accent : theme.textMuted,
                        marginTop: 2,
                      },
                    ]}
                  >
                    {details.sub}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {error ? (
          <Text
            style={[
              TYPE.caption,
              { color: theme.error, textAlign: 'center', marginTop: SPACING.sm },
            ]}
          >
            {error}
          </Text>
        ) : null}
      </ScrollView>

      {/* Pinned Bottom CTA */}
      <ActionFooter>
        <Button
          title="Start Learning"
          size="lg"
          fullWidth
          rightIcon="arrow-right"
          onPress={handleSubmit}
          loading={loading}
        />
      </ActionFooter>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  sealBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
  },
  sealText: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 2,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelRow: {
    flexDirection: 'row',
    gap: SPACING.xs + 2,
  },
  levelTile: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

