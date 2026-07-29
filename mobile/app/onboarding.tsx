/**
 * onboarding.tsx — Post-signup onboarding flow
 *
 * Collects display name, role, JLPT target level, and target deadline from
 * new users. Submits to PUT /api/progress to populate UserProfile, then
 * redirects to the main tabs.
 *
 * This screen is shown once after registration. On subsequent app opens,
 * the root layout checks for a UserProfile and skips to tabs.
 *
 * TODO: Replace hardcoded zen colors with theme tokens from #016.
 *
 * Closes #011
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSession } from '@/src/auth-client';
import { apiFetch } from '@/src/lib/api-fetch';

// ── Types ─────────────────────────────────────────────────────────────────────

type Role = 'external' | 'woxsen-student' | 'teacher';
type JlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

const ROLES: { value: Role; label: string; icon: string; description: string }[] = [
  { value: 'external', label: 'External Student', icon: '🌍', description: 'Self-studying Japanese' },
  { value: 'woxsen-student', label: 'Woxsen Student', icon: '🎓', description: 'Enrolled at Woxsen University' },
  { value: 'teacher', label: 'Instructor', icon: '👩‍🏫', description: 'Teaching Japanese at Woxsen' },
];

const JLPT_LEVELS: JlptLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

const TARGET_PRESETS = [
  { label: '15 days', days: 15 },
  { label: '30 days', days: 30 },
  { label: '60 days', days: 60 },
];

function addDays(days: number): string {
  const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return d.toISOString().split('T')[0];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const router = useRouter();
  const { data: session } = useSession();

  const [name, setName] = useState(session?.user?.name ?? '');
  const [role, setRole] = useState<Role>('external');
  const [jlptLevel, setJlptLevel] = useState<JlptLevel>('N5');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(30);
  const [targetDate, setTargetDate] = useState(addDays(30));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function selectPreset(days: number) {
    setSelectedPreset(days);
    setTargetDate(addDays(days));
  }

  async function handleSubmit() {
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!targetDate || targetDate < new Date().toISOString().split('T')[0]) {
      setError('Please pick a target date in the future.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await apiFetch('/api/progress', {
        method: 'PUT',
        body: JSON.stringify({
          profile: {
            role,
            targetJlptLevel: jlptLevel,
            n5TargetDate: targetDate,
            studyMode: 'zen',
          },
        }),
      });

      router.replace('/(tabs)/');
    } catch (e) {
      setError('Failed to save your profile. Please try again.');
      console.error('[onboarding] submit error:', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>禅語</Text>
        <Text style={styles.title}>Let's set up your profile</Text>
        <Text style={styles.subtitle}>
          We'll personalize your learning experience based on your answers.
        </Text>
      </View>

      {/* Name */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What should we call you?</Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          placeholderTextColor="#94a3b8"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          textContentType="name"
        />
      </View>

      {/* Role */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What's your role?</Text>
        {ROLES.map((r) => (
          <Pressable
            key={r.value}
            style={[styles.roleCard, role === r.value && styles.roleCardSelected]}
            onPress={() => setRole(r.value)}
          >
            <Text style={styles.roleIcon}>{r.icon}</Text>
            <View style={styles.roleTextContainer}>
              <Text style={[styles.roleLabel, role === r.value && styles.roleLabelSelected]}>
                {r.label}
              </Text>
              <Text style={styles.roleDescription}>{r.description}</Text>
            </View>
            {role === r.value && <Text style={styles.checkmark}>✓</Text>}
          </Pressable>
        ))}
      </View>

      {/* JLPT Level */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Target JLPT level</Text>
        <View style={styles.levelRow}>
          {JLPT_LEVELS.map((level) => (
            <Pressable
              key={level}
              style={[styles.levelChip, jlptLevel === level && styles.levelChipSelected]}
              onPress={() => setJlptLevel(level)}
            >
              <Text style={[styles.levelText, jlptLevel === level && styles.levelTextSelected]}>
                {level}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Target Date */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Target date to pass {jlptLevel}</Text>
        <View style={styles.presetRow}>
          {TARGET_PRESETS.map((p) => (
            <Pressable
              key={p.days}
              style={[styles.presetChip, selectedPreset === p.days && styles.presetChipSelected]}
              onPress={() => selectPreset(p.days)}
            >
              <Text style={[styles.presetText, selectedPreset === p.days && styles.presetTextSelected]}>
                {p.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.targetDateDisplay}>
          Target: <Text style={styles.targetDateValue}>{targetDate}</Text>
        </Text>
      </View>

      {/* Error */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Submit */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Start Learning →</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

// TODO: Replace with theme tokens from #016
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#0f172a' },
  container: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 48,
  },
  header: { alignItems: 'center', marginBottom: 36 },
  logo: { fontSize: 48, color: '#818cf8', marginBottom: 12 },
  title: { fontSize: 26, fontWeight: '800', color: '#f1f5f9', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#94a3b8', textAlign: 'center', lineHeight: 20 },

  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#e2e8f0', marginBottom: 12 },

  input: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#f1f5f9',
  },

  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    gap: 12,
  },
  roleCardSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#1e1b4b',
  },
  roleIcon: { fontSize: 24 },
  roleTextContainer: { flex: 1 },
  roleLabel: { fontSize: 15, fontWeight: '700', color: '#cbd5e1', marginBottom: 2 },
  roleLabelSelected: { color: '#a5b4fc' },
  roleDescription: { fontSize: 12, color: '#64748b' },
  checkmark: { color: '#6366f1', fontSize: 18, fontWeight: '700' },

  levelRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  levelChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#1e293b',
  },
  levelChipSelected: { borderColor: '#6366f1', backgroundColor: '#1e1b4b' },
  levelText: { color: '#94a3b8', fontWeight: '600', fontSize: 15 },
  levelTextSelected: { color: '#a5b4fc' },

  presetRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  presetChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#1e293b',
    alignItems: 'center',
  },
  presetChipSelected: { borderColor: '#6366f1', backgroundColor: '#1e1b4b' },
  presetText: { color: '#94a3b8', fontWeight: '600', fontSize: 13 },
  presetTextSelected: { color: '#a5b4fc' },
  targetDateDisplay: { color: '#64748b', fontSize: 13 },
  targetDateValue: { color: '#818cf8', fontWeight: '700' },

  errorText: { color: '#f87171', fontSize: 13, textAlign: 'center', marginBottom: 12 },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#ffffff', fontSize: 17, fontWeight: '800' },
});
