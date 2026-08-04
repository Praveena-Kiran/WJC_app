import { View, type ViewStyle } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { RADIUS, SPACING, CARD_SHADOW } from '@/src/theme/tokens';

export function Card({
  children,
  style,
  padding = SPACING.lg,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
}) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: theme.surface,
          borderRadius: RADIUS.md,
          borderWidth: 1,
          borderColor: theme.border,
          padding,
          ...CARD_SHADOW,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
