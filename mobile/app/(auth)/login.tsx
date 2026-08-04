import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { authClient } from '@/src/auth-client';
import { apiFetch, ApiError } from '@/src/lib/api-fetch';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { TYPE, SPACING } from '@/src/theme/tokens';

export default function LoginScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
        callbackURL: '/',
      });

      if (result.error) {
        setError(result.error.message ?? 'Sign-in failed. Check your credentials.');
        return;
      }

      try {
        const { profile } = await apiFetch<{ profile: null | object }>('/api/progress');
        if (!profile) {
          router.replace('/onboarding' as any);
        } else {
          router.replace('/(tabs)' as any);
        }
      } catch (e) {
        if (e instanceof ApiError && e.status === 404) {
          router.replace('/onboarding' as any);
        } else {
          router.replace('/(tabs)' as any);
        }
      }
    } catch (e) {
      setError('Network error. Please check your connection and try again.');
      console.error('[login] signIn error:', e);
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
            <Text style={[TYPE.display, { color: theme.text, marginBottom: SPACING.xs }]}>Welcome back</Text>
            <Text style={[TYPE.body, { color: theme.textMuted, textAlign: 'center' }]}>
              Sign in to continue your Japanese journey
            </Text>
          </View>

          <View style={{ gap: SPACING.sm }}>
            <Input
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="next"
              error={undefined}
            />

            <Input
              label="Password"
              placeholder="Min. 8 characters"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={handleSignIn}
              error={undefined}
            />

            {error ? (
              <Text style={[TYPE.caption, { color: theme.error, textAlign: 'center' }]}>{error}</Text>
            ) : null}

            <Button title="Sign In" onPress={handleSignIn} loading={loading} />

            <View style={{ alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.md }}>
              <Text style={[TYPE.body, { color: theme.textMuted }]}>
                Don't have an account?{' '}
                <Link href={'/(auth)/register' as any} style={{ color: theme.accent, fontWeight: '600' }}>
                  Create one
                </Link>
              </Text>
              <Link href={'/(auth)/forgot' as any} style={{ color: theme.accent, fontWeight: '600', fontSize: 14 }}>
                Forgot password?
              </Link>
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
    marginBottom: SPACING.xxxl + 8,
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
});
