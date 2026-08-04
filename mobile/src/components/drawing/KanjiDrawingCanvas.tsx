import React, { useRef, useCallback } from 'react';
import { View, PanResponder, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/src/theme/ThemeContext';
import { SPACING, RADIUS } from '@/src/theme/tokens';
import { Button } from '@/src/components/ui/Button';
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

const CANVAS_SIZE = 260;
const VIEWBOX = 109;

export function KanjiDrawingCanvas({
  guidePaths = [],
  strokeWidth = 6,
  onCheckResult,
}: KanjiDrawingCanvasProps) {
  const { theme } = useTheme();
  const strokeColor = '#5c60f5';

  const userStrokesRef = useRef<Point[][]>([]);
  const currentStrokeRef = useRef<Point[]>([]);
  const [, setRenderTick] = React.useState(0);

  const triggerRender = () => setRenderTick((t) => t + 1);

  const toSvgCoords = (x: number, y: number, boxWidth: number, boxHeight: number): Point => {
    return {
      x: (x / boxWidth) * VIEWBOX,
      y: (y / boxHeight) * VIEWBOX,
    };
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const svgPt = toSvgCoords(locationX, locationY, CANVAS_SIZE, CANVAS_SIZE);
        currentStrokeRef.current = [svgPt];
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const svgPt = toSvgCoords(locationX, locationY, CANVAS_SIZE, CANVAS_SIZE);
        currentStrokeRef.current = [...currentStrokeRef.current, svgPt];
        triggerRender();
      },
      onPanResponderRelease: () => {
        if (currentStrokeRef.current.length > 0) {
          userStrokesRef.current = [...userStrokesRef.current, currentStrokeRef.current];
          currentStrokeRef.current = [];
          triggerRender();
        }
      },
    })
  ).current;

  const handleClear = useCallback(() => {
    userStrokesRef.current = [];
    currentStrokeRef.current = [];
    triggerRender();
  }, []);

  const handleCheck = useCallback(() => {
    const score = checkDrawing({ guidePaths, userStrokes: userStrokesRef.current });
    if (onCheckResult) {
      onCheckResult(score);
    }
  }, [guidePaths, onCheckResult]);

  const allUserStrokes: Point[][] = [...userStrokesRef.current, currentStrokeRef.current];

  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          width: CANVAS_SIZE,
          height: CANVAS_SIZE,
          backgroundColor: theme.surface,
          borderWidth: 2,
          borderColor: theme.border,
          borderRadius: RADIUS.md,
          overflow: 'hidden',
        }}
        {...panResponder.panHandlers}
      >
        <Svg width="100%" height="100%" viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}>
          {guidePaths.map((d, idx) => (
            <Path
              key={`guide-${idx}`}
              d={d}
              stroke={theme.border}
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ))}

          {allUserStrokes.map((stroke, sIdx) => {
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

      <View style={{ flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.lg }}>
        <Button title="Clear Canvas" variant="secondary" size="sm" onPress={handleClear} />
        <Button title="Check Stroke" size="sm" onPress={handleCheck} />
      </View>
    </View>
  );
}
