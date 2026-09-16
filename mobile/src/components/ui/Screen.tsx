import { ScrollView, View, type ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/src/theme/ThemeContext';
import { SPACING } from '@/src/theme/tokens';

export function Screen({
  children,
  scroll = true,
  scrollEnabled = true,
  padding = SPACING.lg,
  bottomOffset,
  style,
  contentContainerStyle,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  scrollEnabled?: boolean;
  padding?: number;
  bottomOffset?: number;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  // Floating tab bar sits at bottomInset + ~64px height.
  // Generous bottom clearance ensures elements stay comfortably above the floating navbar.
  const resolvedBottomOffset =
    bottomOffset !== undefined ? bottomOffset : 88 + Math.max(insets.bottom, 16);

  const content = (
    <View style={[{ padding, flex: 1 }, style]}>{children}</View>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={['top', 'left', 'right']}
    >
      {scroll ? (
        <ScrollView
          scrollEnabled={scrollEnabled}
          contentContainerStyle={[
            { flexGrow: 1, paddingBottom: resolvedBottomOffset },
            contentContainerStyle,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, paddingBottom: resolvedBottomOffset }}>{content}</View>
      )}
    </SafeAreaView>
  );
}

