/**
 * GlassmorphicTabBar.tsx
 *
 * A fully custom floating tab bar rendered as a glassmorphic pill that
 * hovers above the safe-area bottom inset. Uses:
 *  - expo-blur     → frosted-glass background
 *  - expo-linear-gradient → shimmering gradient border
 *  - react-native-reanimated → spring icon scale + sliding active indicator
 *  - react-native-safe-area-context → correct bottom offset on notched devices
 */

import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

// ─── Design tokens ────────────────────────────────────────────────────────────
const ACCENT = '#E63946';           // Sakura red — active tab accent
const PILL_HEIGHT = 68;
const PILL_RADIUS = 34;
const BOTTOM_OFFSET = 16;           // px above safe-area inset
const SPRING_CONFIG = { damping: 14, stiffness: 200 };

const TAB_ICONS: Record<string, string> = {
  index:      '🏠',
  kana:       '🈠',
  kanji:      '漢',
  dictionary: '📖',
  quiz:       '🎯',
  kaiwa:      '💬',
};

const TAB_LABELS: Record<string, string> = {
  index:      'Home',
  kana:       'Kana',
  kanji:      'Kanji',
  dictionary: 'Dict',
  quiz:       'Quiz',
  kaiwa:      'Kaiwa',
};

// ─── Single tab item ───────────────────────────────────────────────────────────
interface TabItemProps {
  label: string;
  icon: string;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

function TabItem({ label, icon, isFocused, onPress, onLongPress }: TabItemProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(isFocused ? 1 : 0.55);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.18 : 1, SPRING_CONFIG);
    opacity.value = withTiming(isFocused ? 1 : 0.55, { duration: 200 });
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={label}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabItem}
      activeOpacity={0.75}
    >
      <Animated.View style={[styles.iconWrapper, animatedStyle]}>
        {isFocused && <View style={styles.glowRing} />}
        <Text style={styles.icon}>{icon}</Text>
      </Animated.View>
      <Animated.Text
        style={[
          styles.label,
          { color: isFocused ? ACCENT : 'rgba(255,255,255,0.5)' },
          animatedStyle,
        ]}
      >
        {label}
      </Animated.Text>
    </TouchableOpacity>
  );
}

// ─── Sliding active indicator ──────────────────────────────────────────────────
interface ActiveIndicatorProps {
  tabCount: number;
  activeIndex: number;
}

function ActiveIndicator({ tabCount, activeIndex }: ActiveIndicatorProps) {
  const { width: screenWidth } = Dimensions.get('window');
  // Account for outerContainer left/right 16 each = 32, plus gradientBorder padding 1.5 each side
  const pillWidth = screenWidth - 32 - 3;
  const tabWidth = pillWidth / tabCount;

  const translateX = useSharedValue(activeIndex * tabWidth + 4);

  useEffect(() => {
    translateX.value = withSpring(activeIndex * tabWidth + 4, SPRING_CONFIG);
  }, [activeIndex, tabWidth]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.activeIndicator,
        { width: tabWidth - 8 },
        animatedStyle,
      ]}
    />
  );
}

// ─── Main floating tab bar ─────────────────────────────────────────────────────
export function GlassmorphicTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.outerContainer,
        { bottom: insets.bottom + BOTTOM_OFFSET },
      ]}
      pointerEvents="box-none"
    >
      {/* Gradient border shimmer */}
      <LinearGradient
        colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0.05)', 'rgba(230,57,70,0.4)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        {/* Frosted glass body */}
        <BlurView
          intensity={75}
          tint="dark"
          style={styles.blurContainer}
        >
          {/* Sliding active indicator sits behind tab items */}
          <ActiveIndicator
            tabCount={state.routes.length}
            activeIndex={state.index}
          />

          {/* Tab items */}
          <View style={styles.tabRow}>
            {state.routes.map((route, index) => {
              const isFocused = state.index === index;
              const icon = TAB_ICONS[route.name] ?? '•';
              const label = TAB_LABELS[route.name] ?? route.name;

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              const onLongPress = () => {
                navigation.emit({ type: 'tabLongPress', target: route.key });
              };

              return (
                <TabItem
                  key={route.key}
                  label={label}
                  icon={icon}
                  isFocused={isFocused}
                  onPress={onPress}
                  onLongPress={onLongPress}
                />
              );
            })}
          </View>
        </BlurView>
      </LinearGradient>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: PILL_HEIGHT,
    // iOS shadow
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    // Android elevation
    elevation: 20,
    zIndex: 999,
  },
  gradientBorder: {
    flex: 1,
    borderRadius: PILL_RADIUS,
    padding: 1.5, // border thickness
  },
  blurContainer: {
    flex: 1,
    borderRadius: PILL_RADIUS - 1.5,
    overflow: 'hidden',
    backgroundColor: Platform.OS === 'android'
      ? 'rgba(10, 14, 26, 0.82)'  // Android blur fallback
      : 'rgba(10, 14, 26, 0.45)', // iOS: let BlurView do the work
  },
  tabRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 2,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    lineHeight: 24,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  glowRing: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(230, 57, 70, 0.18)',
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  activeIndicator: {
    position: 'absolute',
    top: 6,
    height: 3,
    borderRadius: 2,
    backgroundColor: ACCENT,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
});
