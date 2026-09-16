import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/src/theme/ThemeContext';
import { Button } from '@/src/components/ui/Button';
import { Icon } from '@/src/components/ui/Icon';
import { TYPE, SPACING, RADIUS, ELEVATION } from '@/src/theme/tokens';

const FEATURES = [
  { icon: 'edit-3', label: 'Kanji Stroke Order' },
  { icon: 'layers', label: 'SRS Flashcards' },
  { icon: 'target', label: 'JLPT N5 Roadmap' },
  { icon: 'check-circle', label: 'Adaptive Quizzes' },
] as const;

export default function WelcomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand & Hero Thesis */}
        <View style={styles.heroSection}>
          <View
            style={[
              styles.sealStamp,
              {
                borderColor: theme.accent,
                backgroundColor: theme.accentMuted,
              },
            ]}
          >
            <Text style={[styles.sealText, { color: theme.accent }]}>禅語</Text>
          </View>

          <Text style={[styles.brandTitle, { color: theme.text }]}>Zengo</Text>

          <Text
            style={[
              TYPE.body,
              {
                color: theme.textMuted,
                textAlign: 'center',
                lineHeight: 22,
                marginTop: 4,
              },
            ]}
          >
            Master Japanese, one character at a time.
          </Text>

          <Text
            style={[
              TYPE.micro,
              {
                color: theme.accent,
                letterSpacing: 1.5,
                marginTop: SPACING.xs,
              },
            ]}
          >
            千里の道も一歩から
          </Text>
        </View>

        {/* Feature Highlights Grid */}
        <View style={styles.featuresSection}>
          {FEATURES.map((feat) => (
            <View
              key={feat.label}
              style={[
                styles.featureCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  ...ELEVATION.subtle,
                },
              ]}
            >
              <View
                style={[
                  styles.featureIconWrap,
                  { backgroundColor: theme.accentMuted },
                ]}
              >
                <Icon name={feat.icon} size={16} color={theme.accent} />
              </View>
              <Text
                style={[
                  TYPE.subhead,
                  { color: theme.text, fontWeight: '600', marginLeft: SPACING.sm },
                ]}
              >
                {feat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Actions Hierarchy */}
        <View style={styles.actionSection}>
          <Button
            title="Get Started"
            size="lg"
            fullWidth
            rightIcon="arrow-right"
            onPress={() => router.push('/(auth)/register' as any)}
          />

          <Button
            title="I already have an account"
            variant="outline"
            size="md"
            fullWidth
            onPress={() => router.push('/(auth)/login' as any)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.xxxl,
    justifyContent: 'space-between',
  },
  heroSection: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  sealStamp: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealText: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: 4,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: SPACING.md,
  },
  featuresSection: {
    gap: SPACING.sm,
    marginVertical: SPACING.xxl,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  featureIconWrap: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionSection: {
    gap: SPACING.md,
  },
});

