import 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useRef } from 'react';
import { AppState } from 'react-native';
import 'react-native-reanimated';
import * as Sentry from '@sentry/react-native';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { onlineManager } from '@tanstack/react-query';
import * as Network from 'expo-network';

import { queryClient, persister } from '@/src/lib/query-client';
import { useColorScheme } from '@/components/useColorScheme';
import { useOtaUpdate } from '../src/hooks/useOtaUpdate';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { authClient } from '@/src/auth-client';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.2,
  profilesSampleRate: 0.1,
  enabled: process.env.NODE_ENV !== 'development',
});

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Start at the welcome/index screen; the auth guard redirects logged-in users.
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading and session resolution complete.
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  useOtaUpdate();
  const [isAuthResolving, setIsAuthResolving] = useState(true);

  // ── Online manager: refetch queries when network reconnects ────────────────
  useEffect(() => {
    return onlineManager.setEventListener((setOnline) => {
      const checkNetwork = async () => {
        const state = await Network.getNetworkStateAsync();
        setOnline(state.isConnected ?? true);
      };
      const subscription = AppState.addEventListener('change', checkNetwork);
      void checkNetwork();
      return () => subscription.remove();
    });
  }, []);

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return null;
  }

  // Session hydration & splash gate resolved in RootLayoutNav to ensure router mount before navigation.
  // if (!loaded || isAuthResolving)

  return <RootLayoutNav setIsAuthResolving={setIsAuthResolving} />;
}

export default process.env.NODE_ENV === 'development' ? RootLayout : Sentry.wrap(RootLayout);

function RootLayoutNav({ setIsAuthResolving }: { setIsAuthResolving: (val: boolean) => void }) {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const hasResolvedRef = useRef(false);

  // ── Auth session hydration + splash gate ──────────────────────────────────
  // Check if a session already exists in SecureStore on cold boot.
  // Performs router.replace('/(tabs)') when the Stack navigator is already mounted.
  useEffect(() => {
    if (hasResolvedRef.current) return;
    hasResolvedRef.current = true;

    const resolveAuthSession = async () => {
      try {
        const session = await authClient.getSession();
        if (session?.data?.user) {
          router.replace('/(tabs)');
        }
      } catch (err) {
        console.warn('[auth] Session resolution error:', err);
      } finally {
        setIsAuthResolving(false);
        await SplashScreen.hideAsync().catch(() => null);
      }
    };

    void resolveAuthSession();
  }, [router, setIsAuthResolving]);

  return (
    <SafeAreaProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            {/* Welcome screen — shown to unauthenticated users only */}
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            {/* Onboarding is a full-screen step outside tabs/auth stacks */}
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </ThemeProvider>
      </PersistQueryClientProvider>
    </SafeAreaProvider>
  );
}
