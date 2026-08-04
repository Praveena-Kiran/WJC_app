import { Stack } from 'expo-router';
import { useTheme } from '@/src/theme/ThemeContext';

export default function MoreLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'More' }} />
      <Stack.Screen name="planner" options={{ title: 'N5 Planner' }} />
      <Stack.Screen name="radicals" options={{ title: 'Radicals' }} />
      <Stack.Screen name="admin" options={{ title: 'Admin' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      <Stack.Screen name="kaiwa" options={{ title: 'Kaiwa' }} />
    </Stack>
  );
}
