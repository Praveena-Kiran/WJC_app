import { TouchableOpacity, Text, type ViewStyle } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { RADIUS, SPACING, TYPE } from '@/src/theme/tokens';

export function Chip({
  label,
  selected = false,
  onPress,
  style,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        {
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.md,
          borderRadius: RADIUS.full,
          borderWidth: 1,
          borderColor: selected ? theme.accent : theme.border,
          backgroundColor: selected ? theme.accentMuted : theme.surfaceAlt,
        },
        style,
      ]}
    >
      <Text
        style={[
          TYPE.caption,
          { color: selected ? theme.accent : theme.textMuted },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
