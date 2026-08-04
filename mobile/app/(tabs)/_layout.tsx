import { Tabs, router } from 'expo-router';
import { TabBar } from '@/src/components/navigation/TabBar';
import { TouchableOpacity } from 'react-native';
import { Icon } from '@/src/components/ui/Icon';
import { useTheme } from '@/src/theme/ThemeContext';
import { SPACING } from '@/src/theme/tokens';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.background },
        headerShadowVisible: false,
        headerTintColor: theme.text,
        headerTitleStyle: { fontWeight: '700' },
        headerRight: () => (
          <TouchableOpacity
            onPress={() => router.push('/more/settings')}
            style={{ marginRight: SPACING.lg }}
          >
            <Icon name="sliders" size={20} color={theme.accent} />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', headerShown: false }} />
      <Tabs.Screen name="kana" options={{ title: 'Kana' }} />
      <Tabs.Screen name="kanji" options={{ title: 'Kanji' }} />
      <Tabs.Screen name="dictionary" options={{ title: 'Dictionary' }} />
      <Tabs.Screen name="quiz" options={{ title: 'Quiz' }} />
    </Tabs>
  );
}
