import * as Speech from 'expo-speech';

export interface SpeechOptions {
  language?: string;
  pitch?: number;
  rate?: number;
}

export async function speakJapanese(text: string, options?: SpeechOptions): Promise<void> {
  if (!text) return;

  const defaultOptions: Speech.SpeechOptions = {
    language: options?.language || 'ja-JP',
    pitch: options?.pitch || 1.0,
    rate: options?.rate || 0.9,
  };

  try {
    Speech.speak(text, defaultOptions);
  } catch (error) {
    console.warn('[Speech] Error speaking text:', error);
  }
}

export async function checkJapaneseVoiceAvailable(): Promise<boolean> {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    return voices.some((v) => v.language.startsWith('ja'));
  } catch (error) {
    console.warn('[Speech] Error checking available voices:', error);
    return false;
  }
}
