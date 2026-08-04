import { TouchableOpacity, Text, View, type ViewStyle } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { RADIUS, SPACING, TYPE } from '@/src/theme/tokens';
import { Icon, type IconName } from './Icon';

export function ListItem({
  icon,
  title,
  subtitle,
  onPress,
  chevron = true,
  style,
}: {
  icon?: IconName;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  chevron?: boolean;
  style?: ViewStyle;
}) {
  const { theme } = useTheme();

  const inner = (
    <>
      {icon && (
        <View style={{ marginRight: SPACING.md, width: 24, alignItems: 'center' }}>
          <Icon name={icon} size={20} color={theme.textMuted} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={[TYPE.body, { color: theme.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[TYPE.caption, { color: theme.textMuted, marginTop: 2 }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {chevron && <Icon name="chevron-right" size={16} color={theme.textMuted} />}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.6}
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: SPACING.md,
            paddingHorizontal: SPACING.lg,
          },
          style,
        ]}
      >
        {inner}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.lg,
        },
        style,
      ]}
    >
      {inner}
    </View>
  );
}
