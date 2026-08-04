import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { authClient } from '@/src/auth-client';
import { useTheme } from '@/src/theme/ThemeContext';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import { TYPE, SPACING } from '@/src/theme/tokens';

export default function RegisterScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function getPasswordStrength(pw: string): { label: string; progress: number } {
    if (pw.length === 0) return { label: '', progress: 0 };
    if (pw.length < 8) return { label: 'Too short', progress: 0.1 };
    const hasUpper = /[A-Z]/.test(pw);
    const hasDigit = /\d/.test(pw);
    const hasSpecial = /[^A-Za-z0-9]/.test(pw);
    const score = [hasUpper, hasDigit, hasSpecial].filter(Boolean).length;
    if (score === 0) return { label: 'Weak', progress: 0.25 };
    if (score === 1) return { label: 'Fair', progress: 0.5 };
    if (score === 2) return { label: 'Good', progress: 0.75 };
    return { label: 'Strong', progress: 1 };
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
            <Text style={[styles.logo, { color: theme.accent }]}>禅語</Text>
            <Text style={[TYPE.display, { color: theme.text, marginBottom: SPACING.xs }]}>Create account</Text>
            <Text style={[TYPE.body, { color: theme.textMuted, textAlign: 'center' }]}>
              Start your Japanese learning journey
            </Text>
          </View>

          <View style={{ gap: SPACING.sm }}>
            <Input label="Name" placeholder="Your full name" value={name} onChangeText={setName} autoCapitalize="words" textContentType="name" returnKeyType="next" />
            <Input label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" textContentType="emailAddress" returnKeyType="next" />
            <Input label="Password" placeholder="Min. 8 characters" value={password} onChangeText={setPassword} secureTextEntry textContentType="newPassword" returnKeyType="next" />

            {strength.label ? (
              <View style={{ gap: 4 }}>
                <ProgressBar progress={strength.progress} />
                <Text style={[TYPE.caption, { color: theme.textMuted }]}>{strength.label}</Text>
              </View>
            ) : null}

            <Input label="Confirm Password" placeholder="Re-enter password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry textContentType="newPassword" returnKeyType="done" onSubmitEditing={handleRegister} error={confirmMatch === false ? 'Passwords do not match' : undefined} />

            {error ? (
              <Text style={[TYPE.caption, { color: theme.error, textAlign: 'center' }]}>{error}</Text>
            ) : null}

            <Button title="Create Account" onPress={handleRegister} loading={loading} />

            <View style={{ alignItems: 'center', marginTop: SPACING.md }}>
              <Text style={[TYPE.body, { color: theme.textMuted }]}>
                Already have an account?{' '}
                <Link href={'/(auth)/login' as any} style={{ color: theme.accent, fontWeight: '600' }}>
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
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.xxxl * 2,
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
});
