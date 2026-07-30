import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { sfxPlayer } from '../lib/sfx-player';

export function SoundBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const enableAudio = () => {
    sfxPlayer.setSoundEnabled(true);
    sfxPlayer.playSound('click');
    setDismissed(true);
  };

  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>🔊 Tap to enable audio feedback for lessons & quizzes</Text>
      <TouchableOpacity style={styles.button} onPress={enableAudio}>
        <Text style={styles.buttonText}>Enable Audio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: 'rgba(92, 96, 245, 0.12)',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#5c60f5',
  },
  bannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
    flex: 1,
  },
  button: {
    backgroundColor: '#5c60f5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
});
