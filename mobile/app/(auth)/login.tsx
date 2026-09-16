import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { authClient } from '@/src/auth-client';
import { apiFetch, ApiError } from '@/src/lib/api-fetch';
import { KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Icon } from '@/src/components/ui/Icon';
import { TYPE, SPACING, RADIUS } from '@/src/theme/tokens';

export default function LoginScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

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
            <View style={[styles.sealBadge, { borderColor: theme.accent, backgroundColor: theme.accentMuted }]}>
              <Text style={[styles.sealText, { color: theme.accent }]}>禅語</Text>
            </View>
            <Text style={[TYPE.display, { color: theme.text, marginTop: SPACING.md, marginBottom: SPACING.xs }]}>
              Welcome back
            </Text>
            <Text style={[TYPE.body, { color: theme.textMuted, textAlign: 'center' }]}>
              Sign in to continue your Japanese journey
            </Text>
          </View>

          <View style={{ gap: SPACING.xs }}>
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
              error={undefined}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              leftIcon="lock"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={handleSignIn}
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
              error={undefined}
            />

            <View style={{ alignItems: 'flex-end', marginBottom: SPACING.md }}>
              <Link href={'/(auth)/forgot' as any} style={{ color: theme.accent, fontWeight: '600', fontSize: 13, paddingVertical: 4 }}>
                Forgot password?
              </Link>
            </View>

            {error ? (
              <Text style={[TYPE.caption, { color: theme.error, textAlign: 'center', marginBottom: SPACING.sm }]}>{error}</Text>
            ) : null}

            <Button
              title="Sign In"
              size="lg"
              fullWidth
              rightIcon="arrow-right"
              onPress={handleSignIn}
              loading={loading}
            />

            <View style={{ alignItems: 'center', marginTop: SPACING.lg }}>
              <Text style={[TYPE.body, { color: theme.textMuted }]}>
                Don't have an account?{' '}
                <Link href={'/(auth)/register' as any} style={{ color: theme.accent, fontWeight: '700' }}>
                  Create one
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
});
