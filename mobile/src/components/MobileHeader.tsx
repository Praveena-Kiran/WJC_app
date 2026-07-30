import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface MobileHeaderProps {
  title?: string;
  onOpenMoreMenu?: () => void;
}

export function MobileHeader({
  title = 'Zengo • 禅語',
  onOpenMoreMenu,
}: MobileHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {onOpenMoreMenu && (
        <TouchableOpacity style={styles.menuButton} onPress={onOpenMoreMenu}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#5c60f5',
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 20,
    color: '#0f172a',
  },
});
