import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  View,
  type ViewStyle,
  type TextStyle,
  type StyleProp,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/src/theme/ThemeContext';
import { BUTTON_SIZE } from '@/src/theme/tokens';
import { Icon, type IconName } from './Icon';

export type ButtonVariant =
  | 'primary'
  | 'tonal'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'destructive';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  fullWidth?: boolean;
  haptic?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  haptic = true,
  style,
  textStyle,
}: ButtonProps) {
  const { theme } = useTheme();
  const metrics = BUTTON_SIZE[size] ?? BUTTON_SIZE.md;

  let bg = 'transparent';
  let borderColor = 'transparent';
  let borderWidth = 0;
  let txtColor = theme.accent;

  if (disabled) {
    if (variant === 'primary') {
      bg = theme.border;
      txtColor = theme.textMuted;
    } else if (variant === 'tonal' || variant === 'destructive') {
      bg = theme.surfaceAlt;
      txtColor = theme.textMuted;
    } else if (variant === 'secondary' || variant === 'outline') {
      borderWidth = 1;
      borderColor = theme.border;
      txtColor = theme.textMuted;
    } else {
      txtColor = theme.textMuted;
    }
  } else {
    switch (variant) {
      case 'primary':
        bg = theme.accent;
        txtColor = theme.onAccent;
        break;
      case 'tonal':
        bg = theme.accentMuted;
        txtColor = theme.accent;
        break;
      case 'outline':
        borderWidth = 1;
        borderColor = theme.border;
        bg = 'transparent';
        txtColor = theme.text;
        break;
      case 'secondary':
        borderWidth = 1;
        borderColor = theme.accent;
        bg = 'transparent';
        txtColor = theme.accent;
        break;
      case 'destructive':
        bg = theme.errorMuted;
        txtColor = theme.error;
        break;
      case 'ghost':
      default:
        bg = 'transparent';
        txtColor = theme.accent;
        break;
    }
  }

  const handlePress = () => {
    if (disabled || loading || !onPress) return;
    if (haptic) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    onPress();
  };

  const iconSize =
    size === 'xs' ? 13 : size === 'sm' ? 15 : size === 'lg' ? 20 : 17;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading || !onPress}
      style={({ pressed }) => [
        {
          backgroundColor: bg,
          borderColor,
          borderWidth,
          borderRadius: metrics.radius,
          minHeight: metrics.height,
          paddingHorizontal: metrics.paddingHorizontal,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          alignSelf: fullWidth ? 'stretch' : undefined,
          opacity: disabled ? 0.6 : pressed ? 0.88 : 1.0,
          transform: [{ scale: pressed && !disabled && !loading ? 0.98 : 1.0 }],
        },
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={txtColor}
          style={{ marginRight: 8 }}
        />
      ) : leftIcon ? (
        <View style={{ marginRight: 8 }}>
          <Icon name={leftIcon} size={iconSize} color={txtColor} />
        </View>
      ) : null}

      <Text
        style={[
          {
            color: txtColor,
            fontSize: metrics.fontSize,
            fontWeight: size === 'lg' ? '700' : '600',
            letterSpacing: 0.2,
          },
          textStyle,
        ]}
      >
        {title}
      </Text>

      {!loading && rightIcon ? (
        <View style={{ marginLeft: 8 }}>
          <Icon name={rightIcon} size={iconSize} color={txtColor} />
        </View>
      ) : null}
    </Pressable>
  );
}
