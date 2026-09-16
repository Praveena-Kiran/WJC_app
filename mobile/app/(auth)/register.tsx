import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { authClient } from '@/src/auth-client';
import { useTheme } from '@/src/theme/ThemeContext';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Icon } from '@/src/components/ui/Icon';
import { TYPE, SPACING, RADIUS } from '@/src/theme/tokens';

export default function RegisterScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function getPasswordStrength(pw: string): {
    label: string;
    level: number; // 0 to 4
    color: string;
  } {
    if (pw.length === 0) return { label: '', level: 0, color: theme.surfaceAlt };
    if (pw.length < 8) return { label: 'Too short (min 8 chars)', level: 1, color: theme.error };

    const hasUpper = /[A-Z]/.test(pw);
    const hasDigit = /\d/.test(pw);
    const hasSpecial = /[^A-Za-z0-9]/.test(pw);
    const score = [hasUpper, hasDigit, hasSpecial].filter(Boolean).length;

    if (score === 0) return { label: 'Weak', level: 1, color: theme.error };
    if (score === 1) return { label: 'Fair', level: 2, color: theme.warning };
    if (score === 2) return { label: 'Good', level: 3, color: '#2563EB' };
    return { label: 'Strong', level: 4, color: theme.success };
  }

  const strength = getPasswordStrength(password);
  const confirmMatch = confirmPassword.length > 0 ? password === confirmPassword : null;

  async function handleRegister() {
    setError(null);

    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!email.trim()) { setError('Please enter your email.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const result = await authClient.signUp.email({
        email: email.trim().toLowerCase(),
        password,
        name: name.trim(),
        callbackURL: '/onboarding',
      });

      if (result.error) {
        setError(result.error.message ?? 'Registration failed. Please try again.');
        return;
      }

      router.replace('/onboarding' as any);
    } catch (e) {
      setError('Network error. Please check your connection and try again.');
      console.error('[register] signUp error:', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={[styles.sealBadge, { borderColor: theme.accent, backgroundColor: theme.accentMuted }]}>
              <Text style={[styles.sealText, { color: theme.accent }]}>禅語</Text>
            </View>
            <Text style={[TYPE.display, { color: theme.text, marginTop: SPACING.md, marginBottom: SPACING.xs }]}>
              Create account
            </Text>
            <Text style={[TYPE.body, { color: theme.textMuted, textAlign: 'center' }]}>
              Start your Japanese learning journey
            </Text>
          </View>

          <View style={{ gap: SPACING.xs }}>
            <Input
              label="Full Name"
              placeholder="Your name"
              leftIcon="user"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              textContentType="name"
              returnKeyType="next"
            />

            <Input
              label="Email"
              placeholder="you@example.com"
              leftIcon="mail"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="next"
            />

            <Input
              label="Password"
              placeholder="Min. 8 characters"
              leftIcon="lock"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              textContentType="newPassword"
              returnKeyType="next"
              rightIcon={
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Icon
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={18}
                    color={theme.textMuted}
                  />
                </Pressable>
              }
            />

            {strength.label ? (
              <View style={styles.strengthContainer}>
                <View style={styles.segmentsRow}>
                  {[1, 2, 3, 4].map((seg) => {
                    const isActive = seg <= strength.level;
                    return (
                      <View
                        key={seg}
                        style={[
                          styles.segment,
                          {
                            backgroundColor: isActive ? strength.color : theme.surfaceAlt,
                          },
                        ]}
                      />
                    );
                  })}
                </View>
                <Text style={[TYPE.caption, { color: strength.color, fontWeight: '600' }]}>
                  {strength.label}
                </Text>
              </View>
            ) : null}

            <Input
              label="Confirm Password"
              placeholder="Re-enter password"
              leftIcon="shield"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              textContentType="newPassword"
              returnKeyType="done"
              onSubmitEditing={handleRegister}
              error={confirmMatch === false ? 'Passwords do not match' : undefined}
            />

            {error ? (
              <Text style={[TYPE.caption, { color: theme.error, textAlign: 'center', marginBottom: SPACING.sm }]}>{error}</Text>
            ) : null}

            <Button
              title="Create Account"
              size="lg"
              fullWidth
              rightIcon="arrow-right"
              onPress={handleRegister}
              loading={loading}
              style={{ marginTop: SPACING.xs }}
            />

            <View style={{ alignItems: 'center', marginTop: SPACING.lg }}>
              <Text style={[TYPE.body, { color: theme.textMuted }]}>
                Already have an account?{' '}
                <Link href={'/(auth)/login' as any} style={{ color: theme.accent, fontWeight: '700' }}>
                  Sign in
                </Link>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  sealBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
  },
  sealText: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 2,
  },
  strengthContainer: {
    gap: 6,
    marginTop: 2,
    marginBottom: SPACING.sm,
  },
  segmentsRow: {
    flexDirection: 'row',
    gap: 6,
    width: '100%',
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: RADIUS.full,
  },
});
