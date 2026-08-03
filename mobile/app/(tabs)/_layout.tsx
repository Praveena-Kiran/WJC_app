/**
 * (tabs)/_layout.tsx — Tab bar navigator
 *
 * Secondary auth guard: if a user somehow reaches this layout without a
 * valid session, they are immediately redirected to the welcome screen.
 * The primary guard lives in the root _layout.tsx.
 */
import { Tabs, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Text } from 'react-native';
import { useSession } from '@/src/auth-client';
import { useEffect } from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // ── Secondary auth guard ────────────────────────────────────────────────────
  // Redirect to welcome screen if there is no active session.
  // isPending is true while the session is being hydrated from SecureStore —
  // we wait for it to resolve before making a routing decision.
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace('/');
    }
  }, [isPending, session, router]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="kana"
        options={{
          title: 'Kana',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🈠</Text>,
        }}
      />
      <Tabs.Screen
        name="kanji"
        options={{
          title: 'Kanji',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>漢</Text>,
        }}
      />
      <Tabs.Screen
        name="dictionary"
        options={{
          title: 'Dictionary',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📖</Text>,
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: 'Quiz',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🎯</Text>,
        }}
      />
    </Tabs>
  );
}
