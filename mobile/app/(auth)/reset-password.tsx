import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { authClient } from '@/src/auth-client';
import { useTheme } from '@/src/theme/ThemeContext';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Icon } from '@/src/components/ui/Icon';
import { TYPE, SPACING } from '@/src/theme/tokens';

export default function ResetPasswordScreen() {
  const { theme } = useTheme();
  const { token } = useLocalSearchParams<{ token?: string }>();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={styles.container}>
          <Icon name="alert-triangle" size={36} color={theme.error} />
          <Text style={[TYPE.title, { color: theme.text, marginTop: SPACING.md }]}>
            Invalid Reset Link
          </Text>
          <Text style={[TYPE.body, { color: theme.textMuted, marginTop: SPACING.sm, textAlign: 'center' }]}>
            No password reset token was provided in the URL.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleResetPassword = async () => {
    if (newPassword.length < 8) {
      setMessage('Password must be at least 8 characters long.');
      setIsError(true);
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const result = await (authClient as any).resetPassword({
        newPassword,
        token,
      });

      if (result?.error) {
        setMessage(result.error.message ?? 'Password reset failed. The link may have expired.');
        setIsError(true);
        return;
      }

      setMessage('Password reset successfully.');
      setIsError(false);
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 1500);
    } catch (e) {
      setMessage('Failed to reset password. The link may have expired.');
      setIsError(true);
      console.error('[reset-password] reset error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        <Text style={[TYPE.display, { color: theme.text, marginBottom: SPACING.xs, textAlign: 'center' }]}>
          Reset Your Password
        </Text>
        <Text style={[TYPE.body, { color: theme.textMuted, marginBottom: SPACING.xxl, textAlign: 'center' }]}>
          Enter a new password for your account.
        </Text>

        <View style={{ gap: SPACING.md, width: '100%' }}>
          <Input
            label="New Password"
            placeholder="Min. 8 characters"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <Input
            label="Confirm Password"
            placeholder="Re-enter password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onSubmitEditing={handleResetPassword}
          />

          {message ? (
            <Text
              style={[
                TYPE.caption,
                { color: isError ? theme.error : theme.success, textAlign: 'center' },
              ]}
            >
              {message}
            </Text>
          ) : null}

          <Button title="Update Password" onPress={handleResetPassword} loading={loading} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.xxl,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
