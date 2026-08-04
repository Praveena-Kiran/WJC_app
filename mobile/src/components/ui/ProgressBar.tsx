import { View, type ViewStyle } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { RADIUS } from '@/src/theme/tokens';

export function ProgressBar({
  progress,
  height = 4,
  style,
}: {
  progress: number; // 0 to 1
  height?: number;
  style?: ViewStyle;
}) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          height,
          borderRadius: RADIUS.full,
          backgroundColor: theme.surfaceAlt,
          overflow: 'hidden',
          width: '100%',
        },
        style,
      ]}
    >
      <View
        style={{
          height: '100%',
          width: `${Math.min(Math.max(progress, 0), 1) * 100}%`,
          borderRadius: RADIUS.full,
          backgroundColor: theme.accent,
        }}
      />
    </View>
  );
}
