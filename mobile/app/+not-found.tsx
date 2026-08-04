import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { TYPE, SPACING } from '@/src/theme/tokens';
import { Button } from '@/src/components/ui/Button';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <Stack.Screen options={{ title: 'Not Found' }} />
      <Text style={[TYPE.display, { color: theme.text }]}>禅語</Text>
      <Text style={[TYPE.title, { color: theme.text, marginTop: SPACING.md }]}>
        This screen doesn't exist.
      </Text>
      <Link href="/(tabs)" asChild>
        <Button title="Go Home" style={{ marginTop: SPACING.xxl }} />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
});
