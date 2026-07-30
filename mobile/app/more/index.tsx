import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function MoreMenuScreen() {
  const router = useRouter();

  const menuItems = [
    { title: '📅 JLPT N5 Planner & Roadmap', path: '/more/planner', icon: '🗺️' },
    { title: '🎙️ Pronunciation & Pitch Coach', path: '/more/pronunciation', icon: '🎤' },
    { title: '🧩 Kanji Radical Builder', path: '/more/radicals', icon: '🧩' },
    { title: '⚡ Super Admin Portal', path: '/more/admin', icon: '⚙️' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>More Modules & Settings</Text>
        <Text style={styles.subtitle}>Explore additional learning tools and system features.</Text>
      </View>

      {menuItems.map((item, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.menuCard}
          onPress={() => router.push(item.path as any)}
        >
          <Text style={styles.menuIcon}>{item.icon}</Text>
          <Text style={styles.menuTitle}>{item.title}</Text>
          <Text style={styles.arrowText}>→</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8fafc',
    flexGrow: 1,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
    elevation: 2,
  },
  menuIcon: {
    fontSize: 24,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  arrowText: {
    fontSize: 16,
    color: '#5c60f5',
    fontWeight: '700',
  },
});
