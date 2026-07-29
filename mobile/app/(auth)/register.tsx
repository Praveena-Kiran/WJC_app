/**
 * register.tsx — Account creation screen
 *
 * Allows new users to register with name + email + password.
 * On success, redirects to the onboarding flow.
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
import { Link, useRouter } from 'expo-router';
import { authClient } from '@/src/auth-client';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function getPasswordStrength(pw: string): { label: string; color: string } {
    if (pw.length === 0) return { label: '', color: 'transparent' };
    if (pw.length < 8) return { label: 'Too short', color: '#f87171' };
    const hasUpper = /[A-Z]/.test(pw);
    const hasDigit = /\d/.test(pw);
    const hasSpecial = /[^A-Za-z0-9]/.test(pw);
    const score = [hasUpper, hasDigit, hasSpecial].filter(Boolean).length;
    if (score === 0) return { label: 'Weak', color: '#fb923c' };
    if (score === 1) return { label: 'Fair', color: '#fbbf24' };
    if (score === 2) return { label: 'Good', color: '#34d399' };
    return { label: 'Strong', color: '#10b981' };
  }

  const strength = getPasswordStrength(password);

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

      // Redirect to onboarding — the databaseHooks (#012b) auto-create
      // UserProfile + UserProgress. Onboarding will update them.
      router.replace('/onboarding' as any);
    } catch (e) {
      setError('Network error. Please check your connection and try again.');
      console.error('[register] signUp error:', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>禅語</Text>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Start your Japanese learning journey</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your full name"
            placeholderTextColor="#94a3b8"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            textContentType="name"
            returnKeyType="next"
          />

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
            textContentType="newPassword"
            returnKeyType="next"
          />

          {/* Password strength indicator */}
          {strength.label ? (
            <View style={styles.strengthRow}>
              <View style={[styles.strengthBar, { backgroundColor: strength.color }]} />
              <Text style={[styles.strengthLabel, { color: strength.color }]}>
                {strength.label}
              </Text>
            </View>
          ) : null}

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter password"
            placeholderTextColor="#94a3b8"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            textContentType="newPassword"
            returnKeyType="done"
            onSubmitEditing={handleRegister}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.linkRow}>
            <Text style={styles.linkText}>
              Already have an account?{' '}
              <Link href={"/(auth)/login" as any} style={styles.link}>
                Sign in
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// TODO: Replace with theme tokens from #016
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#0f172a' },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  header: { alignItems: 'center', marginBottom: 32 },
  logo: { fontSize: 48, color: '#818cf8', marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', color: '#f1f5f9', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#94a3b8', textAlign: 'center' },
  form: { gap: 4 },
  label: { fontSize: 13, fontWeight: '600', color: '#cbd5e1', marginBottom: 6, marginTop: 12 },
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
  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  strengthBar: { height: 4, flex: 1, borderRadius: 2 },
  strengthLabel: { fontSize: 12, fontWeight: '600' },
  errorText: { color: '#f87171', fontSize: 13, marginTop: 8, textAlign: 'center' },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  linkRow: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#94a3b8', fontSize: 14 },
  link: { color: '#818cf8', fontWeight: '600' },
});
