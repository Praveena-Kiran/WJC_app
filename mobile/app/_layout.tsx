import 'react-native-gesture-handler';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
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
import { useOtaUpdate } from '../src/hooks/useOtaUpdate';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { authClient } from '@/src/auth-client';
import { ThemeProvider, useTheme } from '@/src/theme/ThemeContext';
import { AppProvider } from '@/src/context/AppContext';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.2,
  profilesSampleRate: 0.1,
  enabled: process.env.NODE_ENV !== 'development',
});

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

function RootLayout() {
  useOtaUpdate();
  const [isAuthResolving, setIsAuthResolving] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

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

  if (!loaded) {
    return null;
  }

  // Session hydration & splash gate resolved in RootLayoutNav to ensure router mount before navigation.
  // if (!loaded || isAuthResolving)

  return <RootLayoutNav setIsAuthResolving={setIsAuthResolving} />;
}

export default process.env.NODE_ENV === 'development' ? RootLayout : Sentry.wrap(RootLayout);

function NavThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme, themeName } = useTheme();
  const isDark = themeName === 'dark';
  const navTheme = {
    ...(isDark ? { dark: true } : { dark: false }),
    colors: {
      primary: theme.accent,
      background: theme.background,
      card: theme.surface,
      text: theme.text,
      border: theme.border,
      notification: theme.accent,
    },
  } as const;
  return <NavThemeProvider value={navTheme as Parameters<typeof NavThemeProvider>[0]['value']}>{children}</NavThemeProvider>;
}

function RootLayoutNav({ setIsAuthResolving }: { setIsAuthResolving: (val: boolean) => void }) {
  const router = useRouter();
  const hasResolvedRef = useRef(false);

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
        <ThemeProvider>
          <AppProvider>
            <NavThemeWrapper>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                <Stack.Screen name="more" options={{ headerShown: false }} />
              </Stack>
            </NavThemeWrapper>
          </AppProvider>
        </ThemeProvider>
      </PersistQueryClientProvider>
    </SafeAreaProvider>
  );
}
