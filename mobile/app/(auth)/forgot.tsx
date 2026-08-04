import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { authClient } from '@/src/auth-client';
import { useTheme } from '@/src/theme/ThemeContext';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Icon } from '@/src/components/ui/Icon';
import { TYPE, SPACING } from '@/src/theme/tokens';

export default function ForgotPasswordScreen() {
  const { theme } = useTheme();
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
        redirectTo: 'zengo://reset-password',
      });
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
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top', 'left', 'right']}>
        <View style={styles.containerCentered}>
          <Icon name="mail" size={48} color={theme.accent} />
          <Text style={[TYPE.title, { color: theme.text, marginTop: SPACING.lg, textAlign: 'center' }]}>
            Check your inbox
          </Text>
          <Text style={[TYPE.body, { color: theme.textMuted, marginTop: SPACING.md, textAlign: 'center', lineHeight: 22 }]}>
            If an account exists for{' '}
            <Text style={{ color: theme.accent, fontWeight: '600' }}>{email}</Text>, you'll receive a
            password reset link shortly.
          </Text>
          <Text style={[TYPE.caption, { color: theme.textMuted, textAlign: 'center', marginTop: SPACING.md, lineHeight: 20 }]}>
            Tap the link in the email to open the Zengo app and reset your password.
          </Text>
          <Link href={'/(auth)/login' as any} style={{ color: theme.accent, fontWeight: '600', marginTop: SPACING.xxl, fontSize: 15 }}>
            Back to login
          </Link>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.containerCentered}>
          <View style={{ alignItems: 'center', marginBottom: SPACING.xxxl }}>
            <Text style={[styles.logo, { color: theme.accent }]}>禅語</Text>
            <Text style={[TYPE.title, { color: theme.text, marginBottom: SPACING.sm, textAlign: 'center' }]}>
              Reset password
            </Text>
            <Text style={[TYPE.body, { color: theme.textMuted, textAlign: 'center', lineHeight: 22 }]}>
              Enter the email address you used to create your account and we'll send you a password reset link.
            </Text>
          </View>

          <View style={{ gap: SPACING.md, width: '100%' }}>
            <Input
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="send"
              onSubmitEditing={handleSendReset}
              error={undefined}
            />

            {error ? (
              <Text style={[TYPE.caption, { color: theme.error, textAlign: 'center' }]}>{error}</Text>
            ) : null}

            <Button title="Send Reset Link" onPress={handleSendReset} loading={loading} />

            <Link href={'/(auth)/login' as any} style={{ color: theme.accent, fontWeight: '600', textAlign: 'center', fontSize: 14 }}>
              Back to login
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.xxxl,
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
});
