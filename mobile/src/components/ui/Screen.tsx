import { SafeAreaView, ScrollView, View, type ViewStyle } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { SPACING } from '@/src/theme/tokens';

export function Screen({
  children,
  scroll = true,
  padding = SPACING.lg,
  style,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  padding?: number;
  style?: ViewStyle;
}) {
  const { theme } = useTheme();

  const content = (
    <View style={[{ padding, flex: 1 }, style]}>{children}</View>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      {scroll ? (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>{content}</View>
      )}
    </SafeAreaView>
  );
}
