/**
 * forgot.tsx — Forgot password screen
 *
 * Allows users to request a password reset link via email.
 * Uses better-auth's forgetPassword with the zengo:// deep-link scheme
 * so the reset link opens the mobile app directly.
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
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { authClient } from '@/src/auth-client';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSendReset() {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await (authClient as any).forgetPassword({
        email: email.trim().toLowerCase(),
        // Deep-link URL — opens the app to the reset-password screen.
        redirectTo: 'zengo://reset-password',
      });
      // Show success regardless of whether the email exists (security best practice).
      setSent(true);
    } catch (e) {
      setError('Failed to send reset link. Please check your connection and try again.');
      console.error('[forgot] forgetPassword error:', e);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <View style={styles.container}>
        <Text style={styles.successIcon}>📬</Text>
        <Text style={styles.title}>Check your inbox</Text>
        <Text style={styles.subtitle}>
          If an account exists for{' '}
          <Text style={styles.emailHighlight}>{email}</Text>, you'll receive a
          password reset link shortly.
        </Text>
        <Text style={styles.note}>
          Tap the link in the email to open the Zengo app and reset your password.
        </Text>
        <Link href={"/(auth)/login" as any} style={styles.backLink}>
          ← Back to login
        </Link>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🔐</Text>
          <Text style={styles.title}>Reset password</Text>
          <Text style={styles.subtitle}>
            Enter the email address you used to create your account and we'll send you
            a password reset link.
          </Text>
        </View>

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
          returnKeyType="send"
          onSubmitEditing={handleSendReset}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSendReset}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Send Reset Link</Text>
          )}
        </TouchableOpacity>

        <Link href={"/(auth)/login" as any} style={styles.backLink}>
          ← Back to login
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

// TODO: Replace with theme tokens from #016
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#0f172a' },
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 24,
    paddingVertical: 48,
    justifyContent: 'center',
  },
  header: { marginBottom: 32 },
  logo: { fontSize: 40, marginBottom: 12, textAlign: 'center' },
  title: { fontSize: 26, fontWeight: '800', color: '#f1f5f9', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#94a3b8', lineHeight: 22, textAlign: 'center' },
  label: { fontSize: 13, fontWeight: '600', color: '#cbd5e1', marginBottom: 6, marginTop: 8 },
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
  errorText: { color: '#f87171', fontSize: 13, marginTop: 8, textAlign: 'center' },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  backLink: { color: '#818cf8', fontSize: 14, textAlign: 'center', marginTop: 20 },
  successIcon: { fontSize: 56, textAlign: 'center', marginBottom: 16 },
  emailHighlight: { color: '#818cf8', fontWeight: '600' },
  note: { fontSize: 13, color: '#64748b', textAlign: 'center', marginTop: 12, lineHeight: 20 },
});
