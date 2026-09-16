import React, { useState } from 'react';
import {
  TextInput as RNTextInput,
  View,
  Text,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { RADIUS, SPACING, TYPE, BUTTON_SIZE } from '@/src/theme/tokens';
import { Icon, type IconName } from './Icon';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: IconName;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md';
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  size = 'md',
  containerStyle,
  inputContainerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const metrics = size === 'sm' ? BUTTON_SIZE.sm : BUTTON_SIZE.md;
  const iconSize = size === 'sm' ? 16 : 18;

  const borderColor = error
    ? theme.error
    : isFocused
      ? theme.accent
      : theme.border;

  const backgroundColor = isFocused ? theme.surface : theme.surfaceAlt;

  return (
    <View style={[{ marginBottom: SPACING.md }, containerStyle]}>
      {label ? (
        <Text
          style={[
            TYPE.subhead,
            {
              color: isFocused ? theme.accent : theme.textMuted,
              marginBottom: SPACING.xs,
              fontWeight: '600',
            },
          ]}
        >
          {label}
        </Text>
      ) : null}

      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor,
            borderRadius: metrics.radius,
            borderWidth: 1.5,
            borderColor,
            minHeight: metrics.height,
            paddingHorizontal: SPACING.md,
          },
          inputContainerStyle,
        ]}
      >
        {leftIcon ? (
          <View style={{ marginRight: SPACING.sm }}>
            <Icon
              name={leftIcon}
              size={iconSize}
              color={isFocused ? theme.accent : theme.textMuted}
            />
          </View>
        ) : null}

        <RNTextInput
          placeholderTextColor={theme.textMuted}
          style={[
            {
              flex: 1,
              color: theme.text,
              fontSize: metrics.fontSize,
              paddingVertical: 0,
            },
            style,
          ]}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />

        {rightIcon ? (
          <View style={{ marginLeft: SPACING.sm }}>{rightIcon}</View>
        ) : null}
      </View>

      {error ? (
        <Text
          style={[
            TYPE.caption,
            { color: theme.error, marginTop: SPACING.xs, marginLeft: 2 },
          ]}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}
