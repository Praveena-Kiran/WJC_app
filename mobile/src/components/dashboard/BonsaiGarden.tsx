import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface BonsaiGardenProps {
  leaves?: number;
}

export function BonsaiGarden({ leaves = 5 }: BonsaiGardenProps) {
  // Leaf positions
  const leafPositions = [
    { cx: 50, cy: 30 },
    { cx: 35, cy: 35 },
    { cx: 65, cy: 35 },
    { cx: 42, cy: 22 },
    { cx: 58, cy: 22 },
    { cx: 28, cy: 42 },
    { cx: 72, cy: 42 },
    { cx: 50, cy: 15 },
    { cx: 38, cy: 18 },
    { cx: 62, cy: 18 },
  ];

  const visibleLeaves = leafPositions.slice(0, Math.min(leaves, leafPositions.length));

  return (
    <View style={styles.container}>
      <Svg width="100" height="100" viewBox="0 0 100 100">
        {/* Pot Base */}
        <Path d="M 30,75 L 70,75 L 65,90 L 35,90 Z" fill="#475569" />

        {/* Trunk */}
        <Path
          d="M 50,75 Q 45,55 50,35"
          stroke="#78350f"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Dynamic Leaf Foliage */}
        {visibleLeaves.map((pos, idx) => (
          <Circle key={idx} cx={pos.cx} cy={pos.cy} r="8" fill="#10b981" />
        ))}
      </Svg>
      <Text style={styles.leafCountText}>{leaves} Leaves Grown</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 12,
  },
  leafCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10b981',
    marginTop: 4,
  },
});
