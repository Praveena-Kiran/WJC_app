/**
 * (tabs)/_layout.tsx — Tab bar navigator
 *
 * Secondary auth guard: if a user somehow reaches this layout without a
 * valid session, they are immediately redirected to the welcome screen.
 * The primary guard lives in the root _layout.tsx.
 *
 * Fix: render null while the session is still hydrating (isPending=true)
 * to avoid the race condition where a fresh login triggers the guard
 * before the session cookie has propagated to useSession().
 */
import { Tabs } from 'expo-router';
import { GlassmorphicTabBar } from '@/src/components/navigation/GlassmorphicTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <GlassmorphicTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        // Transparent scene container so the floating pill overlaps content cleanly
        sceneStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="kana" options={{ title: 'Kana' }} />
      <Tabs.Screen name="kanji" options={{ title: 'Kanji' }} />
      <Tabs.Screen name="dictionary" options={{ title: 'Dictionary' }} />
      <Tabs.Screen name="quiz" options={{ title: 'Quiz' }} />
      <Tabs.Screen name="kaiwa" options={{ title: 'Kaiwa' }} />
    </Tabs>
  );
}
