import { View, Text, type ViewStyle } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { RADIUS, SPACING, TYPE } from '@/src/theme/tokens';

type BadgeVariant = 'accent' | 'success' | 'warning' | 'error' | 'muted';

export function Badge({
  label,
  variant = 'muted',
  style,
}: {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}) {
  const { theme } = useTheme();

  const colors: Record<BadgeVariant, { bg: string; text: string }> = {
    accent: { bg: theme.accentMuted, text: theme.accent },
    success: { bg: theme.successMuted, text: theme.success },
    warning: { bg: theme.warningMuted, text: theme.warning },
    error: { bg: theme.errorMuted, text: theme.error },
    muted: { bg: theme.surfaceAlt, text: theme.textMuted },
  };

  const c = colors[variant];

  return (
    <View
      style={[
        {
          paddingVertical: SPACING.xs,
          paddingHorizontal: SPACING.sm,
          borderRadius: RADIUS.sm,
          backgroundColor: c.bg,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      <Text style={[TYPE.caption, { color: c.text }]}>{label}</Text>
    </View>
  );
}
