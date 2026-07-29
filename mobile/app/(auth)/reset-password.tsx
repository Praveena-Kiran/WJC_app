import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  if (!token) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorTitle}>Invalid Reset Link</Text>
        <Text style={styles.errorText}>No password reset token was provided in the URL.</Text>
      </View>
    );
  }

  const handleResetPassword = () => {
    if (newPassword.length < 8) {
      setMessage('Password must be at least 8 characters long.');
      return;
    }
    setMessage('Password reset successfully!');
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Your Password</Text>
      <Text style={styles.subtitle}>Enter a new password for your account.</Text>

      <TextInput
        style={styles.input}
        placeholder="New Password (min 8 chars)"
        placeholderTextColor="#94a3b8"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      {Boolean(message) && <Text style={styles.messageText}>{message}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 16,
    color: '#0f172a',
  },
  button: {
    backgroundColor: '#5c60f5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ef4444',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#64748b',
  },
  messageText: {
    fontSize: 13,
    color: '#10b981',
    marginBottom: 12,
    fontWeight: '600',
  },
});
