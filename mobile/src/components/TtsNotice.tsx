import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { checkJapaneseVoiceAvailable } from '../lib/speech';

export function TtsNotice() {
  const [hasJaVoice, setHasJaVoice] = useState<boolean | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    async function verifyVoice() {
      const isAvailable = await checkJapaneseVoiceAvailable();
      setHasJaVoice(isAvailable);
    }
    verifyVoice();
  }, []);

  if (dismissed || hasJaVoice === true || hasJaVoice === null) {
    return null;
  }

  return (
    <View style={styles.noticeBox}>
      <Text style={styles.noticeText}>
        ⚠️ Japanese TTS voice (ja-JP) not detected on device. Pronunciation audio will fall back to default voice synthesis.
      </Text>
      <TouchableOpacity style={styles.dismissBtn} onPress={() => setDismissed(true)}>
        <Text style={styles.dismissText}>Dismiss</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  noticeBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f59e0b',
  },
  noticeText: {
    fontSize: 12,
    color: '#b45309',
    fontWeight: '600',
    flex: 1,
  },
  dismissBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f59e0b',
    borderRadius: 4,
    marginLeft: 8,
  },
  dismissText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
});
