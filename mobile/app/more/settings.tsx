import { useTheme, type ThemePreference } from '@/src/theme/ThemeContext';
import { useApp } from '@/src/context/AppContext';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { ListItem } from '@/src/components/ui/ListItem';
import { SegmentedControl } from '@/src/components/ui/SegmentedControl';
import { authClient } from '@/src/auth-client';
import { useRouter, Stack } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';
import { SPACING, TYPE, RADIUS } from '@/src/theme/tokens';
import { Icon } from '@/src/components/ui/Icon';

const THEME_OPTIONS: { label: string; value: ThemePreference }[] = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

const MODE_OPTIONS: { label: string; value: 'zen' | 'cyber' }[] = [
  { label: 'Zen', value: 'zen' },
  { label: 'Cyber', value: 'cyber' },
];

export default function SettingsScreen() {
  const { theme, preference, setPreference } = useTheme();
  const { state, setStudyMode, signOut } = useApp();
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <Screen style={{ gap: SPACING.lg }}>
      <Stack.Screen
        options={{
          headerLeft: () => (
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
          ),
        }}
      />

      <Card>
        <Text style={[TYPE.caption, { color: theme.textMuted, marginBottom: SPACING.md }]}>
          Appearance
        </Text>
        <SegmentedControl
          options={THEME_OPTIONS}
          value={preference}
          onChange={setPreference}
        />
      </Card>

      <Card>
        <Text style={[TYPE.caption, { color: theme.textMuted, marginBottom: SPACING.md }]}>
          Dashboard Mode
        </Text>
        <SegmentedControl
          options={MODE_OPTIONS}
          value={state.studyMode}
          onChange={setStudyMode}
        />
      </Card>

      <Card>
        <ListItem
          icon="log-out"
          title="Sign Out"
          subtitle="Return to the welcome screen"
          onPress={async () => {
            await authClient.signOut();
            await signOut();
            router.replace('/');
          }}
        />
      </Card>
    </Screen>
  );
}


