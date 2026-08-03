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
import { Tabs, useRouter } from 'expo-router';
import { View } from 'react-native';
import { useSession } from '@/src/auth-client';
import { useEffect } from 'react';
import { GlassmorphicTabBar } from '@/src/components/navigation/GlassmorphicTabBar';

export default function TabLayout() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // ── Secondary auth guard ────────────────────────────────────────────────────
  // Redirect to welcome screen if there is no active session.
  // isPending is true while the session is being hydrated from SecureStore.
  // We wait for it to fully resolve before making a routing decision.
  // This prevents the race condition where a fresh login briefly shows
  // isPending=false + session=null before the cookie has propagated.
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace('/');
    }
  }, [isPending, session, router]);

  // While hydrating the session, render nothing to avoid a flicker or
  // a spurious redirect back to the welcome screen.
  if (isPending) {
    return <View style={{ flex: 1, backgroundColor: '#0a0e1a' }} />;
  }

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
