import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { checkDrawing } from '../../lib/drawing/check-drawing';

interface Point {
  x: number;
  y: number;
}

interface KanjiDrawingCanvasProps {
  guidePaths?: string[];
  strokeColor?: string;
  strokeWidth?: number;
  onCheckResult?: (accuracyScore: number) => void;
}

export function KanjiDrawingCanvas({
  guidePaths = [],
  strokeColor = '#5c60f5',
  strokeWidth = 6,
  onCheckResult,
}: KanjiDrawingCanvasProps) {
  const [userStrokes, setUserStrokes] = useState<Point[][]>([]);

  const handleClear = () => {
    setUserStrokes([]);
  };

  const handleCheck = () => {
    const score = checkDrawing({ guidePaths, userStrokes });
    if (onCheckResult) {
      onCheckResult(score);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.canvasFrame}>
        <Svg width="100%" height="100%" viewBox="0 0 109 109">
          {/* Guide stroke background */}
          {guidePaths.map((d, idx) => (
            <Path
              key={`guide-${idx}`}
              d={d}
              stroke="#e2e8f0"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ))}

          {/* User drawn strokes */}
          {userStrokes.map((stroke, sIdx) => {
            if (stroke.length === 0) return null;
            const pathData = stroke.reduce(
              (acc, pt, pIdx) => `${acc} ${pIdx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`,
              ''
            );
            return (
              <Path
                key={`user-${sIdx}`}
                d={pathData}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            );
          })}
        </Svg>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlRow}>
        <TouchableOpacity style={styles.btnSecondary} onPress={handleClear}>
          <Text style={styles.btnSecondaryText}>Clear Canvas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnPrimary} onPress={handleCheck}>
          <Text style={styles.btnPrimaryText}>Check Stroke</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  canvasFrame: {
    width: 260,
    height: 260,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    overflow: 'hidden',
  },
  controlRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  btnSecondary: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  btnSecondaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  btnPrimary: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#5c60f5',
    borderRadius: 8,
  },
  btnPrimaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
});
