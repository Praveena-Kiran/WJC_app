import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/src/theme/ThemeContext';
import { Icon } from '@/src/components/ui/Icon';
import { triggerHaptic } from '@/src/lib/haptics';
import { SPACING, TYPE } from '@/src/theme/tokens';

const TAB_ICONS: Record<string, { label: string; icon?: string; glyph?: string }> = {
  index: { label: 'Home', icon: 'home' },
  kana: { label: 'Kana', glyph: 'あ' },
  kanji: { label: 'Kanji', glyph: '漢' },
  dictionary: { label: 'Dict', icon: 'book-open' },
  quiz: { label: 'Quiz', icon: 'check-circle' },
};

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const config = TAB_ICONS[route.name];
        if (!config) return null;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => {
              triggerHaptic('light');
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
            activeOpacity={0.6}
            style={styles.tab}
            accessibilityRole="button"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={config.label}
          >
            {config.icon ? (
              <Icon
                name={config.icon as 'home' | 'book-open' | 'check-circle'}
                size={22}
                color={isFocused ? theme.accent : theme.textMuted}
              />
            ) : config.glyph ? (
              <Text
                style={[
                  styles.glyph,
                  { color: isFocused ? theme.accent : theme.textMuted },
                ]}
              >
                {config.glyph}
              </Text>
            ) : null}
            <Text
              style={[
                TYPE.caption,
                {
                  color: isFocused ? theme.accent : theme.textMuted,
                  marginTop: 2,
                },
              ]}
            >
              {config.label}
            </Text>
            {isFocused && (
              <View style={[styles.indicator, { backgroundColor: theme.accent }]} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
  },
  glyph: {
    fontSize: 20,
    fontWeight: '700',
  },
  indicator: {
    width: 20,
    height: 3,
    borderRadius: 2,
    marginTop: 4,
  },
});
