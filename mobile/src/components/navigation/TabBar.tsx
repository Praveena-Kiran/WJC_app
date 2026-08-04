import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/src/theme/ThemeContext';
import { Icon } from '@/src/components/ui/Icon';
import { SPACING, TYPE } from '@/src/theme/tokens';

const TAB_ICONS: Record<string, { label: string; icon?: string; glyph?: string }> = {
  index: { label: 'Home', icon: 'home' },
  kana: { label: 'Kana', glyph: 'あ' },
  kanji: { label: 'Kanji', glyph: '漢' },
  dictionary: { label: 'Dict', icon: 'book-open' },
  quiz: { label: 'Quiz', icon: 'check-circle' },
};

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const { theme, themeName } = useTheme();
  const insets = useSafeAreaInsets();

  const isDark = themeName === 'dark';
  const bottomInset = Math.max(insets.bottom, 12);

  return (
    <View
      style={[
        styles.outerContainer,
        {
          bottom: bottomInset,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDark ? 0.4 : 0.15,
          shadowRadius: 16,
          elevation: 10,
        },
      ]}
    >
      <BlurView
        intensity={80}
        tint={isDark ? 'dark' : 'light'}
        style={[
          styles.blurContainer,
          {
            borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)',
            backgroundColor: isDark ? 'rgba(20, 20, 25, 0.75)' : 'rgba(255, 255, 255, 0.85)',
          },
        ]}
      >
        <View style={styles.tabBarContent}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const config = TAB_ICONS[route.name];
            if (!config) return null;

            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                }}
                activeOpacity={0.7}
                style={[
                  styles.tab,
                  isFocused && [
                    styles.activeTabPill,
                    {
                      backgroundColor: isDark
                        ? 'rgba(255, 255, 255, 0.12)'
                        : 'rgba(0, 0, 0, 0.05)',
                    },
                  ],
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: isFocused }}
                accessibilityLabel={config.label}
              >
                {config.icon ? (
                  <Icon
                    name={config.icon as 'home' | 'book-open' | 'check-circle'}
                    size={20}
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
                    styles.tabLabel,
                    {
                      color: isFocused ? theme.accent : theme.textMuted,
                      fontWeight: isFocused ? '700' : '500',
                    },
                  ]}
                >
                  {config.label}
                </Text>
                {isFocused && (
                  <View style={[styles.activeDot, { backgroundColor: theme.accent }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderRadius: 32,
  },
  blurContainer: {
    borderRadius: 32,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tabBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 20,
  },
  activeTabPill: {
    borderRadius: 20,
  },
  glyph: {
    fontSize: 18,
    fontWeight: '700',
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 3,
  },
});

