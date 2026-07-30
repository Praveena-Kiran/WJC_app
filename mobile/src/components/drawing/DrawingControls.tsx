import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface DrawingControlsProps {
  currentColor?: string;
  currentBrushSize?: number;
  onSelectColor?: (color: string) => void;
  onSelectBrushSize?: (size: number) => void;
}

export function DrawingControls({
  currentColor = '#5c60f5',
  currentBrushSize = 6,
  onSelectColor,
  onSelectBrushSize,
}: DrawingControlsProps) {
  const colors = ['#5c60f5', '#ef4444', '#10b981', '#f59e0b', '#0f172a'];
  const brushSizes = [3, 6, 10, 14];

  return (
    <View style={styles.container}>
      {/* Color Palette Picker */}
      <View style={styles.row}>
        <Text style={styles.label}>Ink Color:</Text>
        <View style={styles.paletteRow}>
          {colors.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.colorDot,
                { backgroundColor: c },
                currentColor === c && styles.colorDotSelected,
              ]}
              onPress={() => onSelectColor && onSelectColor(c)}
            />
          ))}
        </View>
      </View>

      {/* Brush Size Picker */}
      <View style={styles.row}>
        <Text style={styles.label}>Stroke Size:</Text>
        <View style={styles.sizeRow}>
          {brushSizes.map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.sizeBtn,
                currentBrushSize === s && styles.sizeBtnSelected,
              ]}
              onPress={() => onSelectBrushSize && onSelectBrushSize(s)}
            >
              <Text
                style={[
                  styles.sizeText,
                  currentBrushSize === s && styles.sizeTextSelected,
                ]}
              >
                {s}px
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 10,
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  paletteRow: {
    flexDirection: 'row',
    gap: 8,
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: '#cbd5e1',
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  sizeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
  },
  sizeBtnSelected: {
    backgroundColor: '#5c60f5',
  },
  sizeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  sizeTextSelected: {
    color: '#ffffff',
  },
});
