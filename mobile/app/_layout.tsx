import 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import 'react-native-reanimated';
import * as Sentry from '@sentry/react-native';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { onlineManager } from '@tanstack/react-query';
import * as Network from 'expo-network';

import { queryClient, persister } from '@/src/lib/query-client';
import { useColorScheme } from '@/components/useColorScheme';
import { useOtaUpdate } from '../src/hooks/useOtaUpdate';

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
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading and session resolution complete (#033b).
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  useOtaUpdate();
  const [isAuthResolving, setIsAuthResolving] = useState(true);

  // ── Online manager: refetch queries when network reconnects (#009c) ────────
  useEffect(() => {
    return onlineManager.setEventListener((setOnline) => {
      const checkNetwork = async () => {
        const state = await Network.getNetworkStateAsync();
        setOnline(state.isConnected ?? true);
      };
      const subscription = AppState.addEventListener('change', checkNetwork);
      // Fire once immediately to set initial state.
      void checkNetwork();
      return () => subscription.remove();
    });
  }, []);

  // ── Auth session hydration & splash gate (#033b) ──────────────────────────
  useEffect(() => {
    const resolveAuthSession = async () => {
      try {
        // Simulating session resolution / hydration
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (err) {
        console.warn('Session resolution error:', err);
      } finally {
        setIsAuthResolving(false);
      }
    };
    resolveAuthSession();
  }, []);

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Hide splash screen ONLY when fonts are loaded AND session is resolved (#033b).
  useEffect(() => {
    if (loaded && !isAuthResolving) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isAuthResolving]);

  if (!loaded || isAuthResolving) {
    return null;
  }

  return <RootLayoutNav />;
}

export default process.env.NODE_ENV === 'development' ? RootLayout : Sentry.wrap(RootLayout);

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          {/* Onboarding is a full-screen step outside tabs/auth stacks (#011) */}
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </ThemeProvider>
    </PersistQueryClientProvider>
  );
}
