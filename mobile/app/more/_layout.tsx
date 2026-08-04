import { Stack, router } from 'expo-router';
import { useTheme } from '@/src/theme/ThemeContext';
import { TouchableOpacity } from 'react-native';
import { Icon } from '@/src/components/ui/Icon';
import { SPACING, RADIUS } from '@/src/theme/tokens';

export default function MoreLayout() {
  const { theme } = useTheme();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const renderBackButton = () => (
    <TouchableOpacity
      onPress={handleBack}
      style={{
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      accessibilityLabel="Go back"
      accessibilityRole="button"
    >
      <Icon name="arrow-left" size={22} color={theme.text} />
    </TouchableOpacity>
  );

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
      <Stack.Screen name="planner" options={{ title: 'N5 Planner', headerLeft: renderBackButton }} />
      <Stack.Screen name="radicals" options={{ title: 'Radicals', headerLeft: renderBackButton }} />
      <Stack.Screen name="admin" options={{ title: 'Admin', headerLeft: renderBackButton }} />
      <Stack.Screen name="settings" options={{ title: 'Settings', headerLeft: renderBackButton }} />
      <Stack.Screen name="kaiwa" options={{ title: 'Kaiwa', headerLeft: renderBackButton }} />
    </Stack>
  );
}


