import {
  TextInput as RNTextInput,
  View,
  Text,
  StyleSheet,
  type TextInputProps,
} from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { RADIUS, SPACING, TYPE } from '@/src/theme/tokens';

export function Input({
  label,
  error,
  ...props
}: TextInputProps & { label?: string; error?: string }) {
  const { theme } = useTheme();

  return (
    <View style={{ marginBottom: SPACING.lg }}>
      {label ? (
        <Text style={[TYPE.caption, { color: theme.textMuted, marginBottom: SPACING.xs }]}>
          {label}
        </Text>
      ) : null}
      <RNTextInput
        placeholderTextColor={theme.textMuted}
        style={{
          backgroundColor: theme.surfaceAlt,
          borderRadius: RADIUS.sm,
          borderWidth: 1,
          borderColor: error ? theme.error : theme.border,
          color: theme.text,
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.md,
          fontSize: 15,
        }}
        {...props}
      />
      {error ? (
        <Text style={[TYPE.caption, { color: theme.error, marginTop: SPACING.xs }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
