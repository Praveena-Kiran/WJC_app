import { Stack } from 'expo-router';

/**
 * Auth stack navigator.
 * Screens: login, register, forgot, reset-password
 * No headers — each screen manages its own back navigation.
 *
 * Closes #010
 */
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot" />
      <Stack.Screen name="reset-password" options={{ headerShown: true, title: 'Reset Password' }} />
    </Stack>
  );
}
