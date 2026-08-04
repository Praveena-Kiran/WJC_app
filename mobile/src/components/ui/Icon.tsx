import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/ThemeContext';

export type IconName = keyof typeof Feather.glyphMap;

export function Icon({
  name,
  size = 20,
  color,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  const { theme } = useTheme();
  return <Feather name={name} size={size} color={color ?? theme.text} />;
}
