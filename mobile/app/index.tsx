import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/src/theme/ThemeContext';
import { Button } from '@/src/components/ui/Button';
import { Chip } from '@/src/components/ui/Chip';
import { TYPE, SPACING } from '@/src/theme/tokens';

export default function WelcomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.content}>
        <View style={styles.brandSection}>
          <Text style={[styles.logo, { color: theme.accent }]}>禅語</Text>
          <Text style={[styles.appName, { color: theme.text }]}>Zengo</Text>
          <Text style={[TYPE.body, { color: theme.textMuted, textAlign: 'center' }]}>
            Master Japanese, one character at a time.
          </Text>
        </View>

        <View style={styles.pillsRow}>
          {['JLPT N5 - N1', 'Kanji + Kana', 'Quizzes', 'Spaced Repetition'].map((label) => (
            <Chip key={label} label={label} />
          ))}
        </View>

        <View style={styles.buttons}>
          <Button
            title="Get Started"
            onPress={() => router.push('/(auth)/register' as any)}
          />
          <Button
            title="I already have an account"
            variant="ghost"
            onPress={() => router.push('/(auth)/login' as any)}
          />
        </View>

        <Text style={[TYPE.caption, { color: theme.textMuted, textAlign: 'center' }]}>
          Free to start — No credit card required
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xxxl,
    justifyContent: 'center',
    gap: SPACING.xxxl,
  },
  brandSection: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  logo: {
    fontSize: 64,
    fontWeight: '700',
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  buttons: {
    gap: SPACING.md,
  },
});
