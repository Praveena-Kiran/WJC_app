import { useRouter } from 'expo-router';
import { useTheme } from '@/src/theme/ThemeContext';
import { useApp } from '@/src/context/AppContext';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { ListItem } from '@/src/components/ui/ListItem';
import { authClient } from '@/src/auth-client';
import { Text } from 'react-native';
import { TYPE, SPACING, CARD_SHADOW } from '@/src/theme/tokens';
import { View } from 'react-native';

export default function MoreMenuScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { state, signOut } = useApp();

  const isAdmin = state.userRole === 'admin';

  return (
    <Screen style={{ gap: SPACING.lg }}>
      <Text style={[TYPE.title, { color: theme.text, marginBottom: SPACING.xs }]}>
        More
      </Text>

      <Card>
        <Text style={[TYPE.caption, { color: theme.textMuted, marginBottom: SPACING.sm, paddingHorizontal: SPACING.md, paddingTop: SPACING.md }]}>
          Practice
        </Text>
        <ListItem
          icon="message-circle"
          title="Kaiwa"
          subtitle="Conversation practice"
          onPress={() => router.push('/more/kaiwa')}
        />
        <ListItem
          icon="calendar"
          title="N5 Planner"
          subtitle="Exam roadmap"
          onPress={() => router.push('/more/planner')}
        />
        <ListItem
          icon="grid"
          title="Kanji Radicals"
          subtitle="Build kanji from parts"
          onPress={() => router.push('/more/radicals')}
        />
      </Card>

      <Card>
        <ListItem
          icon="sliders"
          title="Settings"
          subtitle="Appearance, dashboard mode"
          onPress={() => router.push('/more/settings')}
        />
      </Card>

      {isAdmin && (
        <Card>
          <ListItem
            icon="shield"
            title="Admin Portal"
            subtitle="User management, health, audit"
            onPress={() => router.push('/more/admin')}
          />
        </Card>
      )}

      <Card>
        <ListItem
          icon="log-out"
          title="Sign Out"
          subtitle="Return to welcome screen"
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
