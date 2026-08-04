import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '@/src/theme/ThemeContext';
import { TYPE } from '@/src/theme/tokens';

interface BonsaiGardenProps {
  leaves?: number;
}

export function BonsaiGarden({ leaves = 5 }: BonsaiGardenProps) {
  const { theme } = useTheme();
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(leaves / 10, 1);
  const offset = circumference * (1 - progress);

  return (
    <View style={styles.container}>
      <Svg width="96" height="96" viewBox="0 0 96 96">
        <Circle
          cx="48"
          cy="48"
          r={radius}
          stroke={theme.surfaceAlt}
          strokeWidth="5"
          fill="none"
        />
        <Circle
          cx="48"
          cy="48"
          r={radius}
          stroke={theme.accent}
          strokeWidth="5"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 48 48)"
        />
      </Svg>
      <View style={styles.label}>
        <Text style={[TYPE.title, { color: theme.accent }]}>{leaves}</Text>
        <Text style={[TYPE.caption, { color: theme.textMuted }]}>Leaves Grown</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'relative',
  },
  label: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
