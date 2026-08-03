/**
 * login.tsx — Sign-in screen
 *
 * Allows users to sign in with email + password using better-auth Expo client.
 * On success, redirects to onboarding (if first login) or tabs (if returning).
 *
 * TODO: Replace hardcoded zen colors with theme tokens from #016.
 *
 * Closes #010
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { authClient } from '@/src/auth-client';
import { apiFetch, ApiError } from '@/src/lib/api-fetch';

export default function LoginScreen() {
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

      // Check if user has a profile (i.e., completed onboarding).
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
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>禅語</Text>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue your Japanese journey</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            returnKeyType="next"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Min. 8 characters"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="password"
            autoComplete="password"
            returnKeyType="done"
            onSubmitEditing={handleSignIn}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Links */}
          <View style={styles.links}>
            <Text style={styles.linkText}>
              Don't have an account?{' '}
              <Link href={"/(auth)/register" as any} style={styles.link}>
                Create one
              </Link>
            </Text>
            <Link href={"/(auth)/forgot" as any} style={[styles.link, styles.forgotLink]}>
              Forgot password?
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// TODO: Replace with theme tokens from #016
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  flex: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 48,
    color: '#818cf8',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#f1f5f9',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  form: {
    gap: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 6,
    marginTop: 12,
  },
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
  errorText: {
    color: '#f87171',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  links: {
    marginTop: 24,
    alignItems: 'center',
    gap: 12,
  },
  linkText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  link: {
    color: '#818cf8',
    fontWeight: '600',
  },
  forgotLink: {
    fontSize: 14,
  },
});
