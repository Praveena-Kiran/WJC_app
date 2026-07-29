import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

/**
 * Zengo — Home screen skeleton.
 * This is a placeholder that will be replaced by the full dashboard
 * once auth and data layers are wired up (Issues #009, #025).
 */
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello Zengo 👋</Text>
      <Text style={styles.subtitle}>
        日本語を学ぼう
      </Text>
      <Text style={styles.note}>
        Setup in progress — auth &amp; data coming soon.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  note: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
});
