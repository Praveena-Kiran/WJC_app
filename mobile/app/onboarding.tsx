import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSession } from '@/src/auth-client';
import { apiFetch } from '@/src/lib/api-fetch';
import { useApp } from '@/src/context/AppContext';
import { useTheme } from '@/src/theme/ThemeContext';
import { Button } from '@/src/components/ui/Button';
import { Icon } from '@/src/components/ui/Icon';
import { TYPE, SPACING } from '@/src/theme/tokens';

type Role = 'external' | 'woxsen-student';
type JlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

const ROLES: { value: Role; label: string; icon: string; description: string }[] = [
  { value: 'external', label: 'External Student', icon: 'globe', description: 'Self-studying Japanese' },
  { value: 'woxsen-student', label: 'Woxsen Student', icon: 'book-open', description: 'Enrolled at Woxsen University' },
];

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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.logo, { color: theme.accent }]}>禅語</Text>
          <Text style={[TYPE.title, { color: theme.text, textAlign: 'center', marginBottom: SPACING.xs }]}>
            Let's set up your profile
          </Text>
          {/* <Text style={[TYPE.body, { color: theme.textMuted, textAlign: 'center' }]}>
            We'll personalize your learning experience based on your answers.
          </Text> */}
        </View>

        <View style={{ marginBottom: SPACING.lg }}>
          <Text style={[TYPE.caption, { color: theme.textMuted, marginBottom: SPACING.sm, marginTop: SPACING.xs }]}>What's your role?</Text>
          {ROLES.map((r) => (
            <Pressable
              key={r.value}
              style={[
                styles.roleCard,
                {
                  borderColor: role === r.value ? theme.accent : theme.border,
                  backgroundColor: role === r.value ? theme.accentMuted : theme.surface,
                },
              ]}
              onPress={() => setRole(r.value)}
            >
              <Icon name={r.icon as 'globe' | 'book-open'} size={22} color={role === r.value ? theme.accent : theme.textMuted} />
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <Text style={[TYPE.bodyStrong, { color: role === r.value ? theme.accent : theme.text }]}>{r.label}</Text>
                <Text style={[TYPE.caption, { color: theme.textMuted }]}>{r.description}</Text>
              </View>
              {role === r.value && <Icon name="check" size={18} color={theme.accent} />}
            </Pressable>
          ))}
        </View>

        <View style={{ marginBottom: SPACING.xl }}>
          <Text style={[TYPE.caption, { color: theme.textMuted, marginBottom: SPACING.sm }]}>Target JLPT level</Text>
          <View style={{ flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' }}>
            {JLPT_LEVELS.map((level) => (
              <Pressable
                key={level}
                style={{
                  paddingHorizontal: SPACING.xl,
                  paddingVertical: SPACING.sm,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: jlptLevel === level ? theme.accent : theme.border,
                  backgroundColor: jlptLevel === level ? theme.accentMuted : theme.surfaceAlt,
                }}
                onPress={() => setJlptLevel(level)}
              >
                <Text style={[TYPE.bodyStrong, { color: jlptLevel === level ? theme.accent : theme.textMuted }]}>{level}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {error ? (
          <Text style={[TYPE.caption, { color: theme.error, textAlign: 'center', marginBottom: SPACING.md }]}>
            {error}
          </Text>
        ) : null}

        <Button title="Start Learning" onPress={handleSubmit} loading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.xxxl * 2,
    paddingBottom: SPACING.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
});
