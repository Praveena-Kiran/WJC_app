import {
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { RADIUS, SPACING, TYPE } from '@/src/theme/tokens';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
}: {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}) {
  const { theme } = useTheme();

  const bg = disabled
    ? theme.border
    : variant === 'primary'
      ? theme.accent
      : 'transparent';

  const borderColor =
    variant === 'secondary' ? (disabled ? theme.border : theme.accent) : 'transparent';

  const txtColor =
    variant === 'primary'
      ? disabled
        ? theme.textMuted
        : theme.onAccent
      : disabled
        ? theme.textMuted
        : theme.accent;

  return (
    <TouchableOpacity
      onPress={onPress ?? (() => {})}
      disabled={disabled || loading || !onPress}
      activeOpacity={0.7}
      style={[
        {
          backgroundColor: bg,
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor,
          borderRadius: RADIUS.md,
          paddingVertical: size === 'sm' ? SPACING.sm : SPACING.md,
          paddingHorizontal: SPACING.xl,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          minHeight: size === 'sm' ? 36 : 48,
        },
        style,
      ]}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={txtColor}
          style={{ marginRight: SPACING.sm }}
        />
      )}
      <Text style={[TYPE.bodyStrong, { color: txtColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}
