import { TouchableOpacity, Text, View, type ViewStyle } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { RADIUS, SPACING, TYPE } from '@/src/theme/tokens';

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  style,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
  style?: ViewStyle;
}) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          backgroundColor: theme.surfaceAlt,
          borderRadius: RADIUS.sm,
          padding: 2,
        },
        style,
      ]}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.7}
            style={{
              flex: 1,
              paddingVertical: SPACING.sm,
              borderRadius: RADIUS.sm - 2,
              backgroundColor: active ? theme.surface : 'transparent',
              alignItems: 'center',
            }}
          >
            <Text
              style={[
                TYPE.caption,
                { fontWeight: active ? '700' : '500', color: active ? theme.text : theme.textMuted },
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
