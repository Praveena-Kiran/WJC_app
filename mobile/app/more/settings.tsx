import { useTheme, type ThemePreference } from '@/src/theme/ThemeContext';
import { useApp } from '@/src/context/AppContext';
import { Screen } from '@/src/components/ui/Screen';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { ListItem } from '@/src/components/ui/ListItem';
import { SegmentedControl } from '@/src/components/ui/SegmentedControl';
import { authClient } from '@/src/auth-client';
import { useRouter } from 'expo-router';
import { Text } from 'react-native';
import { SPACING, TYPE } from '@/src/theme/tokens';

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

  return (
    <Screen style={{ gap: SPACING.lg }}>
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
